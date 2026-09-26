import type { FormState } from "../types/authentication/form";

export const empty: FormState = {
    username:"",
    email:"",
    document:"",
    first_name:"",
    last_name:"",
    role:"student",
    password:"",
    is_active:true
}