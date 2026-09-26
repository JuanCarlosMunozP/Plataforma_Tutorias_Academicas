import type { CreateUserInput } from "@/types/authentication/user";
import { api } from "@/lib/api";
import type { Usuario } from "@/types/authentication/auth";

export const userServices = {
    async create(input: CreateUserInput) {
        const res = await api.post<Usuario>("/users/", input);
        return res.data;
    }
}
