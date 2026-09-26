import { Redirect } from "expo-router";
import { PUBLIC_REGISTRATION_ENABLED } from "@/lib/featureFlags";
import { RegistroPage } from "@/pages/RegistroPage";

export default function Registro() {
    return PUBLIC_REGISTRATION_ENABLED ? <RegistroPage /> : <Redirect href="/" />;
}
