import { cn } from "@/lib/cn";
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    error?: string;
    hint?: string;
    options: Option[];
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Select({
    label,
    error,
    hint,
    options,
    placeholder,
    value,
    onChange,
    className,
}: SelectProps) {
    return (
        <View className="flex flex-col gap-1.5">
            {label && (
                <Text className="text-sm font-medium text-text dark:text-text-dark">
                    {label}
                </Text>
            )}
            <View
                className={cn(
                    "rounded-lg border bg-surface dark:bg-surface-dark",
                    error ? "border-danger" : "border-border dark:border-border-dark",
                    className,
                )}
            >
                <Picker selectedValue={value} onValueChange={(v) => onChange(String(v))}>
                    {placeholder && <Picker.Item label={placeholder} value="" />}
                    {options.map((o) => (
                        <Picker.Item key={o.value} label={o.label} value={o.value} />
                    ))}
                </Picker>
            </View>
            {error ? (
                <Text className="text-xs text-danger">{error}</Text>
            ) : hint ? (
                <Text className="text-xs text-text-muted dark:text-text-muted-dark">{hint}</Text>
            ) : null}
        </View>
    )
}
