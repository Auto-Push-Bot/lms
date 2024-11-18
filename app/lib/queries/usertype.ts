import { db } from '@vercel/postgres';

const client = db;

export async function getTypeScholar() {
    try {
        const text1 = `
            SELECT id
            FROM "usertype"
            WHERE name ILIKE 'Becario'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "usertype" (name)
            VALUES ('Becario')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el tipo 'Becario':", error);
        throw error;
    };
};

export async function getTypeAdmin() {
    try {
        const text1 = `
            SELECT id
            FROM "usertype"
            WHERE name ILIKE 'Admin'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "usertype" (name)
            VALUES ('Admin')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el tipo 'Admin':", error);
        throw error;
    };
};

export async function getTypeGuest() {
    try {
        const text1 = `
            SELECT id
            FROM "usertype"
            WHERE name ILIKE 'Invitado'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "usertype" (name)
            VALUES ('Invitado')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el tipo 'Invitado':", error);
        throw error;
    };
};