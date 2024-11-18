import { db } from '@vercel/postgres';
import { userCareer } from '../dtos/usercareer';
import { createABMItemQuery } from '../dtos/abm';

const client = db;

export async function getHistoricUserCareers() {
    try {
        const text = `
        SELECT * FROM "historicusercareer"
        `;
        const result = await client.query(text);
        return result.rows as userCareer[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicusercareer");
    };
};

export async function createHistoricUserCareer(params: createABMItemQuery) {
    try {
        const text = `
        INSERT INTO "historicusercareer" (name)
        VALUES ($1)
        `;
        const values = [params.name];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el historicusercareer");
    };
};

export async function getHistoricUserCareerByName(name: string) {
    try {
        const text = `
        SELECT * FROM "historicusercareer"
        WHERE name = $1
        LIMIT 1
        `;
        const values = [name];
        const result = await client.query(text, values);
        return result.rows[0] as userCareer;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el historicusercareer");
    };
};