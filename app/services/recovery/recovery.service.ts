"use server"

import { createRecoveryToken, deleteRecoveryToken, getRecoveryTokenByEmail, getRecoveryTokenByToken } from "@/app/lib/queries/recoverytoken";
import { changeUserPassword, getUserByEmail } from "@/app/lib/queries/user";
import sendRecoveryEmail from "@/app/lib/recoveryemail";
import { nanoid } from "nanoid";
import bcrypt from 'bcryptjs';

interface APIErrors {
    email?: string,
};

export async function recoveryEmail(data: { email: string }) {
    try {
        const user = await getUserByEmail(data.email as string);
        const apiErrors: APIErrors = {};
        if (user) {
            const recoveryTokenExists = await getRecoveryTokenByEmail(user.email);
            if (recoveryTokenExists?.email) {
                await deleteRecoveryToken(user.email);
            };
            const token = nanoid();
            const expirationdate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await createRecoveryToken(token, user.email, expirationdate);
            await sendRecoveryEmail(user.email, token);
            return { success: true }
        } else {
            apiErrors.email = "El email ingresado no se encuentra registrado";
            return { success: false, apiError: apiErrors };
        };
    } catch (error) {
        console.error("Error en sendRecoveryEmail:", error);
        throw error;
    };
};

export async function changePassword(data: { password: string, token: string }) {
    try {
        const databaseToken = await getRecoveryTokenByToken(data.token);
        if (!databaseToken) {
            throw new Error("No se encontro el token");
        };
        if (databaseToken.expires_at < new Date()){
            return new Error("Token expirado");
        };
        const hashedPassword = await bcrypt.hash(data.password, 5);
        const params = {
            password: hashedPassword,
            email: databaseToken.email,
        } as { password: string, email: string }
        await changeUserPassword(params);
        await deleteRecoveryToken(databaseToken.email);
        return { success: true }
    } catch (error) {
        console.error("Error en sendRecoveryEmail:", error);
        throw error;
    };
};