import type { LoginRequest, Usuario } from "@/types/authentication/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { userCache } from "@/lib/api";
import { authService } from "@/services/auth.service";

interface AuthContextValue {
    usuario: Usuario | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<Usuario>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false;

        userCache
            .get()
            .then((cached) => {
                if (!cancelled && cached) setUsuario(cached as Usuario);
            })
            .finally(() => {
                authService
                    .me()
                    .then((u) => {
                        if (cancelled) return;
                        setUsuario(u);
                        void userCache.set(u);
                    })
                    .catch(() => {
                        if (cancelled) return;
                        void userCache.clear();
                        setUsuario(null);
                    })
                    .finally(() => {
                        if (!cancelled) setLoading(false);
                    });
            });

        return () => {
            cancelled = true;
        }
    }, []);

    const login = async (data: LoginRequest) => {
        await authService.login(data);
        const u = await authService.me();
        setUsuario(u);
        void userCache.set(u);
        return u;
    }

    const logout = () => {
        void authService.logout();
        void userCache.clear();
        setUsuario(null);
    }

    const refreshUser = async () => {
        const u = await authService.me();
        setUsuario(u);
        void userCache.set(u);
    }

    return (
        <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, loading, login, logout, refreshUser, }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider.")
    return ctx;
}
