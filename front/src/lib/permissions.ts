import type { Rol } from "@/types/authentication/auth";

export const ASSIGNABLE_ROLES: Rol[] = [
    "superadmin",
    "admin",
    "auditor",
    "coordinator",
    "tutor",
    "student"
]

export function canAssignRole(actorRole: Rol | undefined, targetRole:Rol):boolean {
    if (!actorRole) return false;
    if (targetRole === "superadmin") return false;
    if (actorRole === "superadmin") return ASSIGNABLE_ROLES.includes(targetRole);
    if (actorRole === "admin") {
        return targetRole !== "admin" && ASSIGNABLE_ROLES.includes(targetRole);
    }
    return false
}

export const ROLE_LABEL: Record<Rol,String> = {
    superadmin: "Super administrator",
    admin: "Administrador",
    coordinator: "Coordinador",
    tutor: "Tutor",
    direccion: "Direccion",
    auditor: "Auditor",
    student: "Estudiante",
}

export function panelHome(_role:Rol | undefined): string {
    return "/admin";
}