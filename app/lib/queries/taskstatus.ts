import { db } from "@vercel/postgres";
import { taskStatus } from "../dtos/taskstatus";

const client = db;

export async function getTaskStatuses() {
    try {
        const text = `
        SELECT * FROM "taskstatus"
        `;
        const result = await client.query(text);
        return result.rows as taskStatus[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el taskstatus");
    };
};


export async function getTaskStatusPending() {
    try {
        const text1 = `
            SELECT id
            FROM "taskstatus"
            WHERE name ILIKE 'Pendiente'
        `;
        const result = await client.query(text1);
        let response = result.rows;
        if (response.length > 0) {
            return response[0].id;
        };
        const text2 = `
            INSERT INTO "taskstatus" (name)
            VALUES ('Pendiente')
            RETURNING id
        `;
        const insertResult = await client.query(text2);
        response = insertResult.rows;
        return response[0].id;
    } catch (error) {
        console.error("Error al obtener o crear el estado de tarea 'Pendiente':", error);
        throw error;
    };
};