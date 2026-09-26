import { cn } from "@/lib/cn";
import { Eye, EyeOff } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { View, Text, TextInput, Pressable, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    type?: "text" | "email" | "password" | "numeric";
}

export function Input({
    label, error, hint, leftIcon, className, type = "text", autoCapitalize, ...props
}: InputProps) {
    const isPassword = type === "password";
    const [show, setShow] = useState(false);

    return (
        <View className="flex flex-col gap-1.5">
            {label && (
                <Text className="text-sm font-medium text-text dark:text-text-dark">
                    {label}
                </Text>
            )}
            <View className="relative flex-row items-center">
                {leftIcon && <View className="absolute left-3 z-10">{leftIcon}</View>}
                <TextInput
                    secureTextEntry={isPassword && !show}
                    keyboardType={
                        type === "email" ? "email-address" : type === "numeric" ? "numeric" : "default"
                    }
                    autoCapitalize={type === "email" ? "none" : autoCapitalize}
                    placeholderTextColor="#5e6b66"
                    className={cn(
                        "w-full rounded-lg border bg-surface dark:bg-surface-dark px-3 py-2.5 text-sm text-text dark:text-text-dark",
                        error ? "border-danger" : "border-border dark:border-border-dark",
                        leftIcon ? "pl-10" : undefined,
                        isPassword ? "pr-10" : undefined,
                        className,
                    )}
                    {...props}
                />
                {isPassword && (
                    <Pressable
                        onPress={() => setShow((v) => !v)}
                        className="absolute right-3"
                        accessibilityLabel={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {show ? <EyeOff size={18} color="#5e6b66" /> : <Eye size={18} color="#5e6b66" />}
                    </Pressable>
                )}
            </View>
            {error ? (
                <Text className="text-xs text-danger">{error}</Text>
            ) : hint ? (
                <Text className="text-xs text-text-muted dark:text-text-muted-dark">{hint}</Text>
            ) : null}
        </View>
    )
}
