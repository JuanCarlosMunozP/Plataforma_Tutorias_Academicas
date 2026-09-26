import type { Rol } from "./auth";

export interface FormState {
    username:string;
    email:string;
    document:string;
    first_name:string;
    last_name:string;
    role:Rol;
    password:string;
    is_active:boolean;
}