import { AlertTriangle } from "lucide-react-native";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text } from "react-native";
import * as Updates from "expo-updates";
import { Button } from "./ui/Button";

interface Props {
    children: ReactNode;
    resetKey?: string;
    scope?: string;
}

interface State {
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidUpdate(prev: Props) {
        if (this.state && prev.resetKey !== this.props.resetKey) {
            this.setState({ error: null });
        }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        const tag = this.props.scope ? `Error Boundary . ${this.props.scope}` : "Error Boundary";
        console.error(`[${tag}]`, error, info.componentStack);
    }

    private handleRetry = () => this.setState({ error: null });

    private handleReload = () => {
        Updates.reloadAsync().catch(() => this.handleRetry());
    };

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <View className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-danger/10">
                    <AlertTriangle size={16} color="#9b3d3b" />
                </View>
                <Text className="text-xl font-bold text-text dark:text-text-dark text-center">
                    Algo salió mal en esta pantalla
                </Text>
                <Text className="text-sm text-text-muted dark:text-text-muted-dark text-center">
                    No pudimos mostrar el contenido. Tu sesión sigue activa: puedes
                    reintentar, ir al panel o recargar la aplicación.
                </Text>
                <View className="mt-2 flex-row flex-wrap justify-center gap-2">
                    <Button variant="secondary" onPress={this.handleRetry}>
                        Reintentar
                    </Button>
                    <Button onPress={this.handleReload}>Recargar la aplicación</Button>
                </View>
            </View>
        )
    }

}
