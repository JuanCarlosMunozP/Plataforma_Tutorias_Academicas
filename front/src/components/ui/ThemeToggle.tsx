import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/cn";
import { Moon, Sun } from "lucide-react-native";
import { Pressable } from "react-native";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Pressable
            accessibilityLabel={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className={cn(
                "h-10 w-10 items-center justify-center rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark",
                className,
            )}
            onPress={toggleTheme}
        >
            {isDark ? <Sun size={18} color="#f3f6f4" /> : <Moon size={18} color="#1c2420" />}
        </Pressable>
    )
}
