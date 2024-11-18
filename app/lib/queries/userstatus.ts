import { db } from "@vercel/postgres";

const client = db;

export async function getStatusPending() {
    try {
        const text1 = `
            SELECT id
            FROM "userstatus"
            WHERE name ILIKE 'Pendiente'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "userstatus" (name)
            VALUES ('Pendiente')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el estado 'Pendiente':", error);
        throw error;
    };
};

export async function getStatusActive() {
    try {
        const text1 = `
            SELECT id
            FROM "userstatus"
            WHERE name ILIKE 'Activo'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "userstatus" (name)
            VALUES ('Activo')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el estado 'Activo':", error);
        throw error;
    };
};

export async function getStatusDeactivated() {
    try {
        const text1 = `
            SELECT id
            FROM "userstatus"
            WHERE name ILIKE 'Inactivo'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "userstatus" (name)
            VALUES ('Inactivo')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el estado 'Inactivo':", error);
        throw error;
    };
};

export async function getStatusExpired() {
    try {
        const text1 = `
            SELECT id
            FROM "userstatus"
            WHERE name ILIKE 'Expirado'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "userstatus" (name)
            VALUES ('Expirado')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el estado '':", error);
        throw error;
    };
};