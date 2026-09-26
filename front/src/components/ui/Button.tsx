import { cn } from "@/lib/cn";
import { ActivityIndicator, Pressable, Text, type GestureResponderEvent } from "react-native";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    className?: string;
    children: ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
}

const variants: Record<Variant, string> = {
    primary: "bg-primary active:bg-primary-hover",
    secondary: "bg-app-muted dark:bg-app-muted-dark border border-border dark:border-border-dark",
    ghost: "bg-transparent",
}

const textVariants: Record<Variant, string> = {
    primary: "text-white",
    secondary: "text-text dark:text-text-dark",
    ghost: "text-text dark:text-text-dark",
}

const sizes: Record<Size, string> = {
    sm: "h-9 px-3",
    md: "h-11 px-4",
    lg: "h-12 px-6",
};

export function Button({
    variant = "primary",
    size = "md",
    loading,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    onPress,
}: ButtonProps) {
    const isDisabled = disabled || loading;
    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={cn(
                "flex-row items-center justify-center gap-2 rounded-lg",
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                isDisabled && "opacity-60",
                className,
            )}
        >
            {loading ? (
                <ActivityIndicator size="small" color={variant === "primary" ? "#ffffff" : "#0f6b5c"} />
            ) : (
                leftIcon
            )}
            {typeof children === "string" ? (
                <Text className={cn("text-sm font-semibold", textVariants[variant])}>{children}</Text>
            ) : (
                children
            )}
            {!loading && rightIcon}
        </Pressable>
    )
}
