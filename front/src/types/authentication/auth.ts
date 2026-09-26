export type Rol =
    | "superadmin"
    | "admin"
    | "tutor"
    | "coordinator"
    | "auditor"
    | "direccion"
    | "student"

export interface Usuario {
    id:number;
    username:string;
    document:string;
    email:string;
    first_name:string;
    last_name:string;
    role:Rol;
    is_active:boolean;
    date_joined?:string;
    last_login?:string;
}

export interface LoginRequest {
    username:string;
    password:string;
}