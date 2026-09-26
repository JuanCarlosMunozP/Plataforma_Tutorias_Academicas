import { cn } from "@/lib/cn";
import { View, Text, type ViewProps } from "react-native";
import type { ReactNode } from "react";

interface CardProps extends ViewProps {
    children: ReactNode;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
}

export function Card({ children, padding = "md", className, ...props }: CardProps) {
    return (
        <View
            {...props}
            className={cn(
                "rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark",
                paddings[padding],
                className,
            )}
        >
            {children}
        </View>
    )
}

export function CardHeader({
    title,
    subtitle,
    action,
    compact = false,
}: {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    compact?: boolean;
}) {
    return (
        <View
            className={cn("flex-row items-start justify-between gap-3", compact ? "mb-2" : "mb-4")}>
            <View>
                <Text className={cn("font-semibold text-text dark:text-text-dark", compact ? "text-sm" : "text-base")}>
                    {title}
                </Text>
                {subtitle && <Text className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
                    {subtitle}
                </Text>}
            </View>
            {action}
        </View>
    )
}
