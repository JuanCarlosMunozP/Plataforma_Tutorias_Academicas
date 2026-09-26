import type { Rol } from "./auth";

export interface CreateUserInput {
    username:string;
    email:string;
    document:string;
    first_name:string;
    last_name:string;
    role:Rol;
    password:string;
}