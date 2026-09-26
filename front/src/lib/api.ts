import axios, {
    AxiosError,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { tokenStorage } from "./tokenStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const USER_KEY = "postgres";

export const userCache = {
    async get(): Promise<unknown | null> {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },
    async set(user: unknown) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    async clear() {
        await AsyncStorage.removeItem(USER_KEY);
    },
}

const REQUEST_TIMEOUT_MS = 15000;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
});

const rawClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
})

async function attachAuthHeader(config: InternalAxiosRequestConfig) {
    const access = await tokenStorage.getAccess();
    if (access) {
        config.headers.set("Authorization", `Bearer ${access}`);
    }
    return config;
}

api.interceptors.request.use(attachAuthHeader);

let isRefreshing = false;
let pending: Array<(ok: boolean) => void> = [];

function notifyAll(ok: boolean) {
    pending.forEach((cb) => cb(ok));
    pending = [];
}

async function refreshAccessToken(): Promise<boolean> {
    try {
        const refresh = await tokenStorage.getRefresh();
        if (!refresh) return false;
        const res = await rawClient.post("/auth/token/refresh/", { refresh });
        const { access, refresh: newRefresh } = res.data as {
            access: string;
            refresh?: string;
        };
        await tokenStorage.set(access, newRefresh);
        return true;
    } catch {
        return false;
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const url = original?.url ?? "";

        const isAuthEndpoint = url.includes("/auth/token");

        if (status !== 401 || original?._retry || isAuthEndpoint) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pending.push((ok) => {
                    if (!ok) {
                        reject(error);
                        return;
                    }
                    original._retry = true;
                    resolve(api(original));
                })
            })
        }

        original._retry = true;
        isRefreshing = true;
        const refreshed = await refreshAccessToken();
        isRefreshing = false;
        notifyAll(refreshed);

        if (!refreshed) {
            await tokenStorage.clear();
            await userCache.clear();
            router.replace("/");
            return Promise.reject(error);
        }
        return api(original);
    }
)

function isUnusableApiErrorBody(data: unknown, contentType: string): boolean {
    if (contentType.includes("text/html")) return true;
    if (typeof data !== "string") return false;
    const s = data.trimStart();
    if (!s) return false;
    if (s.startsWith("<") || /<!doctype/i.test(s)) return true;
    if (/h1\s*\{\s*font-weight/i.test(s.slice(0, 800))) return true;
    return false;
}

export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error"): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        const contentType = String(
            (typeof error.response?.headers?.get === "function"
                ? error.response.headers.get("content-type")
                : error.response?.headers?.["content-type"] ??
                error.response?.headers?.["Content-Type"]
            ) ?? "",
        );
        if (isUnusableApiErrorBody(data, contentType)) return fallback;
        if (typeof data === "string") {
            const message = data.trim();
            return message || fallback;
        }
        if (data && typeof data === "object") {
            const detail = (data as { detail?: unknown }).detail;
            if (typeof detail === "string") return detail;
            const firstField = Object.values(data as Record<string, unknown>)[0];
            if (Array.isArray(firstField) && typeof firstField[0] === "string") {
                return firstField[0];
            }
            if (typeof firstField === "string") return firstField;
        }
    }
    return fallback;
}

export function getApiFieldError(error: unknown): Record<string, string> {
    if (!axios.isAxiosError(error)) return {};
    if (error.response?.data) return {};
    const data = error.response?.data;
    if (!data || typeof data != "object" || Array.isArray(data)) return {};

    const out: Record<string, string> = {};
    for (const [field, value] of Object.entries(data as Record<string, unknown>)) {
        const message = Array.isArray(value)
            ? value.find((v): v is string => typeof v === "string")
            : typeof value === "string"
                ? value
                : undefined;
        if (message === undefined) continue;
        out[field === "non_field_errors" || field === "detail" ? "" : field] = message;
    }
    return out;
}
