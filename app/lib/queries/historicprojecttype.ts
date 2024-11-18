import { db } from '@vercel/postgres';
import { projectType } from '../dtos/projecttype';
import { createABMItemQuery } from '../dtos/abm';

const client = db;

export async function getHistoricProjectTypes() {
    try {
        const text = `
        SELECT * FROM "historicprojecttype"
        `;
        const result = await client.query(text)
        return result.rows as projectType[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicprojecttype");
    };
};

export async function createHistoricProjectType(params: createABMItemQuery) {
    try {
        const text = `
        INSERT INTO "historicprojecttype" (name)
        VALUES ($1)
        `;
        const values = [params.name];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el historicprojecttype");
    };
};

export async function getHistoricProjectTypeByName(name: string) {
    try {
        const text = `
        SELECT * FROM "historicprojecttype"
        WHERE name = $1
        LIMIT 1
        `;
        const values = [name];
        const result = await client.query(text, values);
        return result.rows[0] as projectType;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicprojecttype");
    };
};
