import { db } from '@vercel/postgres';
import { supplyType } from '../dtos/supplytype';
import { checkItemExistanceQuery, createABMItemQuery, editABMItemQuery, fetchABMItemQuery, fetchedABMItem } from '../dtos/abm';

const client = db;

export async function getSupplyTypes() {
    try {
        const text = `
        SELECT * FROM "supplytype"
        `;
        const result = await client.query(text)
        return result.rows as supplyType[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supplytype");
    }
};

export async function getSupplyTypesABM(params: fetchABMItemQuery) {
    try {
        const offset = (params.page) * params.rowsPerPage;
        const name = `%${params.name}%`;
        const baseValues: (number | string)[] = [ params.rowsPerPage, offset ];
        let text = `
        SELECT * FROM "supplytype" 
        `;
        let values = [...baseValues];
        let filtertext = '';
        if (params.name !== "") {
            filtertext += `WHERE unaccent(name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(name);
        }
        text += filtertext + `
        LIMIT $1 OFFSET $2
        `;
        const result = await client.query(text, values)
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "supplytype"
        `;
        const countresult = await client.query(text2)
        return {
            items: result.rows as fetchedABMItem[],
            totalItems: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supplytype");
    }
};

export async function checkSupplyTypesABM(params: checkItemExistanceQuery) {
    try {
        const text = `SELECT * FROM "supplytype" WHERE name = $1 LIMIT 1
        `;
        const values = [params.name];
        const result = await client.query(text, values);
        return result;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supplytype");
    }
};

export async function createSupplyType(params: createABMItemQuery) {
    try {
        const text = `
        INSERT INTO "supplytype" (name)
        VALUES ($1)
        `;
        const values = [params.name];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el supplytype");
    }
};

export async function editSupplyType(params: editABMItemQuery) {
    try {
        const text = `
        UPDATE "supplytype"
        SET name = $1
        WHERE id = $2
        `;
        const values = [params.name, params.id];
        await client.query(text, values);
        return { success: true, message: "Instancia editada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar el supplytype");
    }
};