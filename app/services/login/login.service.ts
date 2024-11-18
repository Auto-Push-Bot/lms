"use server"

import { signIn, signOut } from "@/app/lib/auth";
import { loginFormData } from "@/app/lib/dtos/user";
import { getGuestExpirationDate } from "@/app/lib/queries/guest";
import { getUserByEmail, userChangeStatus } from "@/app/lib/queries/user";
import { getStatusDeactivated, getStatusExpired, getStatusPending } from "@/app/lib/queries/userstatus";
import { getTypeGuest } from "@/app/lib/queries/usertype";
import { createVerificationToken, deleteVerificationToken, getVerificationTokenByEmail } from "@/app/lib/queries/validationtoken";
import sendVerificationEmail from "@/app/lib/verificationemail";
import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";

interface APIErrors {
    email?: string,
    password?: string,
    other?: string
};

export async function doCredentialLogin(data: loginFormData) {
    try {
        const user = await getUserByEmail(data.email as string);
        const apiErrors: APIErrors = {};
        if (user) {
            const hashedPassword = user.password;
            const isMatch = await bcrypt.compare(data.password as string, hashedPassword);
            const userTypeGuest = await getTypeGuest();
            const statusExpired = await getStatusExpired();
            const statusDeactivated = await getStatusDeactivated();
            const statusPending = await getStatusPending();
            if (isMatch) {
                //is guest expired?
                if (user.usertype_id === userTypeGuest) {
                    const idnumber = Number(user.id);
                    const expirationdate = await getGuestExpirationDate(idnumber);
                    if (expirationdate < new Date()) {
                        await userChangeStatus(idnumber, statusExpired);
                        apiErrors.other = "Usuario expirado, contacte a un administrador de laboratorio";
                        return { success: false, apiError: apiErrors };
                    };
                };
                //is active?
                if (user.userstatus_id === statusDeactivated || user.userstatus_id === statusExpired) {
                    apiErrors.other = "La cuenta ha expirado o ha sido deshabilitada, contacte a un administrador de laboratorio";
                    return { success: false, apiError: apiErrors };
                };
                //is verified?
                if (user.userstatus_id === statusPending) {
                    const verificationTokenExists = await getVerificationTokenByEmail(user.email);
                    if (verificationTokenExists?.email) {
                        await deleteVerificationToken(user.email);
                    };
                    const token = nanoid();
                    const expirationdate = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    await createVerificationToken(token, user.email, expirationdate);
                    await sendVerificationEmail(user.email, token);
                    apiErrors.other = "Se envió un email de verificación, por favor, revisa tu bandeja de entrada";
                    return { success: false, apiError: apiErrors };
                };
                //everything ok
                const response = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });
                return { success: true, ...response, usertype_id: user.usertype_id, userlab: user.laboratory_id, user_id: user.id };
            } else {
                apiErrors.password = "Contraseña incorrecta";
                return { success: false, apiError: apiErrors };
            };
        } else {
            apiErrors.email = "Email incorrecto";
            return { success: false, apiError: apiErrors };
        };
    } catch (error) {
        console.error("Error en doCredentialLogin:", error);
        throw error;
    };
};

export async function doLogout() {
    await signOut({ redirectTo: "/" });
};