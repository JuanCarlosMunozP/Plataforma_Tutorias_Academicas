import type { Dispatch, SetStateAction } from "react";
import type { FormState } from "./form";
import type { Rol } from "./auth";

export interface UserFormModalProps {
    creating:boolean;
    closeModal:() => void;
    submit: () => void | Promise<void>;
    form:FormState;
    setForm: Dispatch<SetStateAction<FormState>>;
    roleOptions: {value:Rol, label:string}[];
    role: Rol | undefined;
    saving: boolean;
}