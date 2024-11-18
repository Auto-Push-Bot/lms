import { db } from '@vercel/postgres';
import { createLabQuery, laboratory } from '../dtos/laboratory';

const client = db;

export async function getLabs() {
    try {
        const text = `
        SELECT * FROM "laboratory"
        `;
        const result = await client.query(text);
        return result.rows as laboratory[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el laboratory");
    };
};

export async function getLabById(id: number) {
    try {
        const text = `
        SELECT * FROM "laboratory"
        WHERE id = $1
        `;
        const values = [id];
        const result = await client.query(text, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el laboratory");
    };
};

export async function createLab(params: createLabQuery) {
    try {
        const text = `
        INSERT INTO "laboratory" (name)
        VALUES ($1)
        `;
        const values = [params.name];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el laboratory");
    };
};