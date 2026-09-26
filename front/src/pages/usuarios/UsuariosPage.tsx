import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { UserFormModal } from "./UserFormModal";
import { type Rol } from "@/types/authentication/auth";
import { ASSIGNABLE_ROLES, canAssignRole, ROLE_LABEL } from "@/lib/permissions";
import { type FormState } from "@/types/authentication/form";
import { empty } from "@/utils/user.utils";
import type { CreateUserInput } from "@/types/authentication/user";
import { userServices } from '../../services/users.service';
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api";

export function UsuariosPage() {
    const { usuario } = useAuth();
    const role = usuario?.role;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormState>(empty);


    const assignableRoles = useMemo<Rol[]>(
        () => ASSIGNABLE_ROLES.filter((r) => canAssignRole(role, r)),
        [role],
    )

    const roleOptions = useMemo(
        () => assignableRoles.map((r) => ({ value: r, label: String(ROLE_LABEL[r]) })),
        [assignableRoles],
    );

    const openCreate = () => {
        setForm({
            ...empty,
            role: assignableRoles[0] ?? "student",
        });
        setCreating(true);
    }

    const closeModal = () => {
        setCreating(false);
        setForm(empty);
    }

    const submit = async () => {
        if (!canAssignRole(role, form.role)) {
            Alert.alert("No tienes permisos para asignar este rol");
            return;
        }
        setSaving(true);

        try {
            const payload: CreateUserInput = {
                username: form.username,
                document: form.document,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                role: form.role,
                password: form.password
            }
            await userServices.create(payload);
        } catch (err) {
            Alert.alert(getApiErrorMessage(err, 'Error al guardar'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <View className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">
            <UserFormModal
                creating={creating}
                closeModal={closeModal}
                submit={submit}
                form={form}
                setForm={setForm}
                roleOptions={roleOptions}
                role={role}
                saving={saving}
            />
        </View>
    )
}
