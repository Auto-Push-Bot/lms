import { db } from '@vercel/postgres';
import { projectStatus } from '../dtos/projectstatus';
import { createABMItemQuery } from '../dtos/abm';

const client = db;

export async function getHistoricProjectStatuses() {
    try {
        const text = `
        SELECT * FROM "historicprojectstatus"
        `;
        const result = await client.query(text);
        return result.rows as projectStatus[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicprojectstatus");
    };
};

export async function createHistoricProjectStatus(params: createABMItemQuery) {
    try {
        const text = `
        INSERT INTO "historicprojectstatus" (name)
        VALUES ($1)
        `;
        const values = [params.name];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el historicprojectstatus");
    };
};

export async function getHistoricProjectStatusByName(name: string) {
    try {
        const text = `
        SELECT * FROM "historicprojectstatus"
        WHERE name = $1
        LIMIT 1
        `;
        const values = [name];
        const result = await client.query(text, values);
        return result.rows[0] as projectStatus;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicprojectstatus");
    };
};
