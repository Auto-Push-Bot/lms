"use server"

import { createGuestData, fetchedGuest, fetchGuestData, fetchGuestQuery, newGuestQuery } from "@/app/lib/dtos/guest";
import { createGuest, dropGuest, getGuestsTable, getGuestStatus } from "@/app/lib/queries/guest";
import { getStatusExpired, getStatusPending } from "@/app/lib/queries/userstatus";
import { getTypeGuest } from "@/app/lib/queries/usertype";
import { db } from "@vercel/postgres";
import bcrypt from 'bcryptjs';

interface APIError {
    email?: string;
    message?: string;
};

export async function fetchTableData(data: fetchGuestData) {
    try {
        const params = {
            search: data.search,
            laboratory_id: data.laboratory_id,
            sortColumn: data.sortColumn,
            sortDirection: data.sortDirection,
            page: data.page,
            rowsPerPage: data.rowsPerPage,
        } as fetchGuestQuery;
        let response: { guests: fetchedGuest[]; totalGuests: any; };
        response = await getGuestsTable(params);
        return response;
    } catch (error) {
        console.error("Error en fetchTableData(Guest):", error);
        throw error;
    };
};

export async function createTableData(data: createGuestData) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 5);
        const userstatus = await getStatusPending() as number;
        const usertype = await getTypeGuest() as number;
        const client = db;
        const text1 = `
            SELECT * FROM "user" WHERE email = $1 LIMIT 1
        `;    
        const values1 = [data.email];
        const existingUserEmail = await client.query(text1, values1);
        const apiError: APIError = {};
        if (existingUserEmail.rows.length > 0) {
            apiError.email = "Email en uso";
        };
        if (Object.keys(apiError).length > 0) {
            return { success: false, apiError: apiError };
        };
        const user = {
            name: data.name,
            email: data.email,
            expires_at: data.expires_at,
            password: hashedPassword,
            laboratory_id: data.laboratory_id,
            usertype_id: usertype,
            userstatus_id: userstatus,
        } as newGuestQuery;
        try {
            await createGuest(user);
            return { success: true };
        } catch(error) {
            console.error("Error al crear Invitado:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en createTableData(Guest):", error);
        throw error;
    };
};

export async function deleteTableData(id: number) {
    try {
        const isExpired = await getStatusExpired();
        const guestStatus = await getGuestStatus(id);
        const apiError: APIError = {};
        if (isExpired !== guestStatus) {
            apiError.message = "El invitado no ha expirado";
        }
        if (Object.keys(apiError).length > 0) {
            return { success: false, apiError: apiError };
        }
        try {
            await dropGuest(id);
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar Invitado:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en deleteTableData(Guest):", error);
        throw error;
    };
};