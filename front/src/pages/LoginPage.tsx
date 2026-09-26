import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/cn";
import { PUBLIC_REGISTRATION_ENABLED } from "@/lib/featureFlags";
import { panelHome } from "@/lib/permissions";
import { UserIcon } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Link, useLocalSearchParams, useRouter, type Href } from "expo-router";

const features = [
    {
        title: "Búsqueda de tutores",
        desc: "Consulta tutores especializados.",
    },
    {
        title: "Acompañamiento académico",
        desc: "Recibe acompañamiento académico.",
    },
];

function safeInternalPath(value: string | string[] | null | undefined): string | null {
    const v = Array.isArray(value) ? value[0] : value;
    if (!v || !v.startsWith("/") || v.startsWith("//")) return null;
    return v;
}

export function LoginPage() {
    const router = useRouter();
    const { next } = useLocalSearchParams<{ next?: string }>();
    const { login } = useAuth();

    const explicitRedirect = safeInternalPath(next);
    const isWeb = Platform.OS === "web";

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            const u = await login(formData);
            router.replace((explicitRedirect ?? panelHome(u.role)) as Href);
        } catch (err) {
            setError(getApiErrorMessage(err, "Credenciales inválidas"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="min-h-dvh flex-1 bg-app-muted dark:bg-app-muted-dark"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerClassName={cn("min-h-dvh flex-grow", isWeb && "flex-row")}
                keyboardShouldPersistTaps="handled"
            >
                <View
                    className={cn(
                        "bg-primary px-5 py-8",
                        isWeb && "w-[32rem] shrink-0 justify-center px-12",
                    )}
                >
                    <View className="flex-row items-center gap-3">
                        <View className="h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                            <Text className="text-base font-semibold text-white">T</Text>
                        </View>
                        <View className="shrink">
                            <Text className="text-sm font-semibold leading-tight text-white">
                                Tutorías académicas
                            </Text>
                            <Text className="text-xs text-white/75">Acompañamiento del grado</Text>
                        </View>
                    </View>
                    <Text className="mt-5 text-xl font-semibold leading-snug text-white">
                        Plataforma de tutorías académicas.
                    </Text>
                    <View className="mt-4 gap-3">
                        {features.map((feature) => (
                            <View key={feature.title}>
                                <Text className="text-sm font-medium leading-snug text-white">
                                    {feature.title}
                                </Text>
                                <Text className="text-sm leading-snug text-white/75">{feature.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View
                    className={cn(
                        "flex-1 items-center justify-center bg-surface dark:bg-surface-dark px-4 py-8",
                        isWeb && "px-10",
                    )}
                >
                    <View className="w-full max-w-md">
                        <View className="mb-6">
                            <Text className="text-2xl font-semibold text-text dark:text-text-dark">
                                Bienvenido
                            </Text>
                            <Text className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
                                Ingresa tus credenciales para acceder al sistema.
                            </Text>
                        </View>

                        {error && (
                            <View
                                accessibilityRole="alert"
                                className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2"
                            >
                                <Text className="text-sm text-danger">{error}</Text>
                            </View>
                        )}

                        <View className="flex flex-col gap-4">
                            <Input
                                label="Usuario"
                                autoComplete="username"
                                placeholder="usuario"
                                value={formData.username}
                                onChangeText={(text) => setFormData((prev) => ({ ...prev, username: text }))}
                                leftIcon={<UserIcon size={16} color="#5e6b66" />}
                            />
                            <Input
                                label="Contraseña"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                            />
                            <Button onPress={handleSubmit} loading={loading} fullWidth>
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </Button>
                            <View className="flex flex-col items-start gap-2">
                                <Link href={"/recuperar-password" as Href} className="text-sm font-medium text-primary">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                                {PUBLIC_REGISTRATION_ENABLED ? (
                                    <Link href="/registro" className="text-sm font-medium text-primary">
                                        ¿No tienes cuenta? Solicitar registro
                                    </Link>
                                ) : (
                                    <Text className="text-sm text-text-muted dark:text-text-muted-dark">
                                        ¿No tienes cuenta? Solicita una nueva cuenta a un administrador.
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
