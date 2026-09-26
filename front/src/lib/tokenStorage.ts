import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
    async getAccess(): Promise<string | null> {
        return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },
    async getRefresh(): Promise<string | null> {
        return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },
    async set(access: string, refresh?: string): Promise<void> {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
        if (refresh) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
    },
    async clear(): Promise<void> {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    },
};
