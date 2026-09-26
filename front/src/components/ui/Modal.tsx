import { cn } from "@/lib/cn";
import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { Modal as RNModal, Pressable, ScrollView, Text, View } from "react-native";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizes: Record<NonNullable<ModalProps["size"]>, string> = {
    xs: "w-auto max-w-[15rem]",
    sm: "w-full max-w-md",
    md: "w-full max-w-lg",
    lg: "w-full max-w-2xl",
    xl: "w-full max-w-4xl",
}

export function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
}: ModalProps) {
    return (
        <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/50 p-4">
                <Pressable className="absolute inset-0" onPress={onClose} accessibilityElementsHidden />
                <View
                    className={cn(
                        "rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark",
                        sizes[size],
                    )}
                >
                    <View
                        className={cn(
                            "flex-row items-center justify-between border-b border-border dark:border-border-dark",
                            size === "xs" ? "px-2.5 py-1.5" : "px-5 py-3",
                        )}
                    >
                        <Text
                            className={cn(
                                "font-semibold text-text dark:text-text-dark",
                                size === "xs" ? "text-sm" : "text-base",
                            )}
                        >
                            {title}
                        </Text>
                        <Pressable
                            onPress={onClose}
                            accessibilityLabel="Cerrar"
                            className="h-8 w-8 items-center justify-center rounded-lg"
                        >
                            <X size={16} color="#5e6b66" />
                        </Pressable>
                    </View>
                    <ScrollView className="max-h-[75%]">{children}</ScrollView>
                </View>
            </View>
        </RNModal>
    )
}
