import { db } from '@vercel/postgres';

const client = db;

export async function getRecoveryTokenByToken(token: string) {
    try {
        const text = `
        SELECT * FROM "recoverytoken" WHERE token = $1 LIMIT 1
        `;
        const values = [token];
        const result = await client.query(text, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el recoverytoken");
    };
};

export async function getRecoveryTokenByEmail(email: string) {
    try {
        const text = `
        SELECT * FROM "recoverytoken" WHERE email = $1 LIMIT 1
        `;
        const values = [email];
        const result = await client.query(text, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el recoverytoken");
    };
};

export async function deleteRecoveryToken(email: string) {
    try {
        const text = `
        DELETE FROM "recoverytoken"
        WHERE email = $1
        `;
        const values = [email];
        return client.query(text, values);
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo eliminar el recoverytoken");
    };
};

export async function createRecoveryToken(token: string, email: string, expirationdate: Date){
    try {
        const expirationDateOnly = expirationdate.toISOString().split('T')[0];
        const text = `
        INSERT INTO "recoverytoken" (email, token, expires_at)
        VALUES ($1, $2, $3)
        `;
        const values = [email, token, expirationDateOnly];
        await client.query(text, values);
        return {success: true};
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el recoverytoken");
    };
};