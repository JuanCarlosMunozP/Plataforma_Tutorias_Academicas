import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";
import { type Usuario, type LoginRequest } from "@/types/authentication/auth";

export const authService = {
    async login(data: LoginRequest) {
        const res = await api.post<{ access: string; refresh: string }>("/auth/token", data);
        await tokenStorage.set(res.data.access, res.data.refresh);
    },
    async me() {
        const res = await api.get<Usuario>("/users/me/");
        return res.data;
    },
    async logout() {
        const refresh = await tokenStorage.getRefresh();
        if (refresh) {
            await api.post("/auth/token/blacklist/", { refresh }).catch(() => undefined);
        }
        await tokenStorage.clear();
    }
}
