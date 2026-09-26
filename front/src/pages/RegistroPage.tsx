import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft, BadgeCheck, CheckCircle, IdCard, Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";

interface FormState {
    nombre: string;
    apellido: string;
    documento: string;
    correo: string;
    cargo: string;
    password: string;
    confirmPassword: string;
}

const initial: FormState = {
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
    cargo: "",
    password: "",
    confirmPassword: "",
};

const cargoOptions = [
    { value: "estudiante", label: "Estudiante" },
    { value: "biologia", label: "Profesor de Biología" },
    { value: "filosofia", label: "Profesor de Filosofía" },
    { value: "administrativo", label: "Administrativo" },
];

export function RegistroPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initial);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const setField = (name: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio";
        if (!form.documento.trim()) e.documento = "El documento es obligatorio";
        else if (!/^\d{6,15}$/.test(form.documento))
            e.documento = "El documento debe tener entre 6 y 15 dígitos";
        if (!form.cargo.trim()) e.cargo = "Seleccione un cargo";
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
            e.correo = "Correo no válido";
        if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
        else if (!/[A-Z]/.test(form.password) || !/\d/.test(form.password))
            e.password = "Debe incluir al menos una mayúscula y un número";
        if (form.confirmPassword !== form.password)
            e.confirmPassword = "Las contraseñas no coinciden";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <View className="min-h-dvh flex-1 items-center justify-center bg-app-muted dark:bg-app-muted-dark px-4 py-8">
                <Card padding="lg" className="w-full max-w-md items-center">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle size={28} color="#0f6b5c" />
                    </View>
                    <Text className="mt-4 text-2xl font-semibold text-text dark:text-text-dark text-center">
                        Solicitud enviada
                    </Text>
                    <Text className="mt-3 text-sm leading-relaxed text-text-muted dark:text-text-muted-dark text-center">
                        Hemos recibido tu solicitud de registro. Un administrador la revisará y
                        recibirás una notificación al correo{" "}
                        <Text className="font-semibold text-text dark:text-text-dark">{form.correo}</Text> cuando tu
                        cuenta esté activa.
                    </Text>
                    <Button className="mt-6" onPress={() => router.replace("/")} fullWidth>
                        Ir a iniciar sesión
                    </Button>
                </Card>
            </View>
        );
    }

    return (
        <ScrollView className="min-h-dvh flex-1 bg-app-muted dark:bg-app-muted-dark" contentContainerClassName="px-4 py-6">
            <View className="mb-4 flex-row items-center justify-between gap-3">
                <Link href="/" className="flex-row items-center gap-2 text-sm font-medium text-text-muted dark:text-text-muted-dark">
                    <ArrowLeft size={16} color="#5e6b66" />
                    {" "}Volver a iniciar sesión
                </Link>
                <ThemeToggle />
            </View>
            <Card className="gap-4">
                <View className="mb-2 flex-row items-start gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <BadgeCheck size={22} color="#0f6b5c" />
                    </View>
                    <View className="shrink flex-1">
                        <Text className="text-xl font-semibold text-text dark:text-text-dark">
                            Solicitar registro
                        </Text>
                        <Text className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
                            Completa tus datos. Tu cuenta deberá ser aprobada por un
                            administrador antes de poder ingresar al sistema.
                        </Text>
                    </View>
                </View>
                <View className="gap-4">
                    <Input
                        label="Nombre"
                        value={form.nombre}
                        onChangeText={(text) => setField("nombre", text)}
                        leftIcon={<User size={16} color="#5e6b66" />}
                        error={errors.nombre}
                    />
                    <Input
                        label="Apellido"
                        value={form.apellido}
                        onChangeText={(text) => setField("apellido", text)}
                        leftIcon={<User size={16} color="#5e6b66" />}
                        error={errors.apellido}
                    />
                    <Input
                        label="Documento de identidad"
                        value={form.documento}
                        onChangeText={(text) => setField("documento", text)}
                        leftIcon={<IdCard size={16} color="#5e6b66" />}
                        error={errors.documento}
                        hint="Solo números, sin puntos ni guiones"
                        type="numeric"
                    />
                    <Select
                        label="Cargo"
                        value={form.cargo}
                        onChange={(value) => setField("cargo", value)}
                        options={cargoOptions}
                        placeholder="Seleccione un cargo"
                        error={errors.cargo}
                    />
                    <Input
                        label="Correo institucional"
                        value={form.correo}
                        type="email"
                        autoComplete="email"
                        error={errors.correo}
                        onChangeText={(text) => setField("correo", text)}
                        leftIcon={<Mail size={16} color="#5e6b66" />}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChangeText={(text) => setField("password", text)}
                        leftIcon={<Lock size={16} color="#5e6b66" />}
                        error={errors.password}
                        hint="Mínimo 8 caracteres, una mayúscula y un número"
                    />
                    <Input
                        label="Confirmar contraseña"
                        type="password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChangeText={(text) => setField("confirmPassword", text)}
                        leftIcon={<Lock size={16} color="#5e6b66" />}
                        error={errors.confirmPassword}
                    />
                    <View>
                        <Button onPress={handleSubmit} loading={loading} fullWidth size="lg">
                            {loading ? "Enviando..." : "Enviar solicitud"}
                        </Button>
                        <View className="mt-3 flex-row justify-center gap-1">
                            <Text className="text-sm text-text-muted dark:text-text-muted-dark">¿Ya tienes cuenta?</Text>
                            <Link href="/" className="text-sm font-medium text-primary">
                                Inicia sesión
                            </Link>
                        </View>
                    </View>
                </View>
            </Card>
        </ScrollView>
    );
}
