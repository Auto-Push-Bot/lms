import { laboratory } from "./laboratory";

export type user = {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    dropped_at?: Date;
    laboratory_id: number;
    usertype_id: number;
    userstatus_id: number;
    emailVerified: Date | null;
};

export type userSchema = {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    deactivated_at?: Date;
    laboratory_id: number;
    usertype_id: number;
    userstatus_id: number;
    emailVerified: Date | null;
};

export type newUserQuery = {
    name: string;
    email: string;
    password: string;
    usertype_id: number;
    userstatus_id: number;
};

export type registerFormProps = {
    laboratories: laboratory[];
};

export type registerFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type labFormData = {
    laboratory_id: number | '';
    modalOpenCreate: boolean;
};

export type createAdminData = {
    name: string;
    email: string;
    password: string;
}; 

export type addLabData = {
    laboratory_id: number;
    user_id: number;
};


export type addLabQuery = addLabData;

export type loginFormProps = {
    admin: number;
    guest: number;
    scholar: number;
};

export type loginFormData = {
    email: string;
    password: string;
};