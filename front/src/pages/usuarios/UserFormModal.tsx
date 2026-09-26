import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { type UserFormModalProps } from '../../types/authentication/props';
import { Select } from '@/components/ui/Select';
import type { Rol } from '@/types/authentication/auth';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';

export function UserFormModal({
    creating,
    closeModal,
    submit,
    form,
    setForm,
    roleOptions,
    role,
    saving,
}: UserFormModalProps) {
    return (
        <Modal
            open={creating}
            onClose={closeModal}
            title="Nuevo Usuario"
            size='lg'
        >
            <View className="gap-4 p-4">
                <Input
                    label="Usuario (username)"
                    value={form.username}
                    onChangeText={(text) => setForm({ ...form, username: text })}
                />
                <Input
                    label="Correo"
                    type="email"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                />
                <Input
                    label="Documento"
                    value={form.document}
                    onChangeText={(text) => setForm({ ...form, document: text })}
                />
                <Input
                    label="Nombre"
                    value={form.first_name}
                    onChangeText={(text) => setForm({ ...form, first_name: text })}
                />
                <Input
                    label="Apellido"
                    value={form.last_name}
                    onChangeText={(text) => setForm({ ...form, last_name: text })}
                />
                <Select
                    label="Rol"
                    value={form.role}
                    onChange={(value) => setForm({ ...form, role: value as Rol })}
                    options={roleOptions}
                    hint={
                        role === "admin"
                            ? "Como admin no puedes asignar rol superadmin/admin."
                            : undefined
                    }
                />
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                />
                <View className="flex-row justify-end gap-2">
                    <Button variant="secondary" onPress={closeModal}>
                        Cancelar
                    </Button>
                    <Button onPress={submit} loading={saving}>
                        Guardar
                    </Button>
                </View>
            </View>
        </Modal>

    )
}
