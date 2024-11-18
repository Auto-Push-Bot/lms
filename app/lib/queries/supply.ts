import { db } from "@vercel/postgres";
import { editSupplyQuery, fetchedSupply, fetchSupplyQuery, newSupplyQuery } from "../dtos/supply";

const client = db;

export async function getSupplies(labid: number) {
    try {
        const text = `
        SELECT 
            s.id, s.name, s.year, s.description, s.supplytype_id, s.supplystatus_id,
            ss.name AS supplystatus,
            st.name AS supplytype
        FROM "supply" s
        JOIN "supplytype" st ON s.supplytype_id = st.id
        JOIN "supplystatus" ss ON s.supplystatus_id = ss.id
        WHERE s.laboratory_id = $1
        `;
        const values = [labid];
        const result = await client.query(text, values);
        return result.rows as fetchedSupply[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supply");
    };
};

export async function getSuppliesTable(data: fetchSupplyQuery) {
    try {
        const offset = (data.page) * data.rowsPerPage;
        const validColumns = ['s.name', 's.supplytype_id', 's.year', 's.supplystatus_id'];
        if (!validColumns.includes(data.sortColumn)) {
            throw new Error('Columna invalida');
        };
        const validDirections = ['ASC', 'DESC'];
        if (!validDirections.includes(data.sortDirection.toUpperCase())) {
            throw new Error('Dirección de ordenación invalida');
        };
        const column = data.sortColumn;
        const direction = data.sortDirection.toUpperCase();
        const search = `%${data.name}%`;
        const baseValues = [data.laboratory_id, data.rowsPerPage, offset];
        let text = `
        SELECT 
            s.id, s.name, s.year, s.description, s.supplytype_id, s.supplystatus_id,
            ss.name AS supplystatus,
            st.name AS supplytype
        FROM "supply" s
        JOIN "supplytype" st ON s.supplytype_id = st.id
        JOIN "supplystatus" ss ON s.supplystatus_id = ss.id
        WHERE s.laboratory_id = $1
        `;
        let values = [...baseValues] as any;
        let filtertext = '';
        if (data.name !== "") {
            filtertext += `AND unaccent(s.name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(search);
        };
        text += filtertext;
        let ordertext = '';
        if (column === "s.name") {
            ordertext = "ORDER BY s.name ";
        };
        if (column === "s.year") {
            ordertext = "ORDER BY s.year ";
        };
        if (column === "s.supplytype_id") {
            ordertext = "ORDER BY s.supplytype_id ";
        };
        if (column === "s.supplystatus_id") {
            ordertext = "ORDER BY s.supplystatus_id ";
        };
        if (direction === "DESC" || direction === "ASC") {
            ordertext += direction;
        };
        text += ordertext + `
            LIMIT $2 OFFSET $3
        `;
        const result = await client.query(text, values);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "supply" s
        WHERE s.laboratory_id = $1
        `;
        const values2 = [data.laboratory_id];
        const countresult = await client.query(text2, values2);
        return {
            supplies: result.rows as fetchedSupply[],
            totalSupplies: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supply");
    };
};

export async function getSupplyByName(name: string, labid: number) {
    try {
        const text = `
        SELECT 
            s.id, s.name, s.year, s.description, s.supplytype_id, s.supplystatus_id,
            ss.name AS supplystatus,
            st.name AS supplytype
        FROM "supply" s
        JOIN "supplytype" st ON s.supplytype_id = st.id
        JOIN "supplystatus" ss ON s.supplystatus_id = ss.id
        WHERE s.name ILIKE $1
            AND s.laboratory_id = $1
        `;
        const namefinal = '%' + name + '%';
        const values = [namefinal, labid];
        const result = await client.query(text, values);
        return result.rows as fetchedSupply[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el supply");
    };
};

export async function createSupply(supply: newSupplyQuery) {
    try {
        const text = `
        INSERT INTO "supply" (name, description, year, laboratory_id, supplytype_id, supplystatus_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [supply.name, supply.description, supply.year, supply.laboratory_id, supply.supplytype_id, supply.supplystatus_id];
        return client.query(text, values);
    }   catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el supply");
    };
};

export async function editSupply(supply: editSupplyQuery) {
    try {
        const text = `
        UPDATE "supply"
        SET name = $1,
            description = $2,
            year = $3,
            supplystatus_id = $4,
            supplytype_id = $5
        WHERE id = $6
        `;
        const values = [supply.name, supply.description, supply.year, supply.supplystatus_id, supply.supplytype_id, supply.id];
        return client.query(text, values);
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar el supply");
    };
};

export async function dropSupply(id: number) {
    try {
        const text = `
        DELETE FROM "supply"
        WHERE id = $1
        `;
        const values = [id];
        return client.query(text, values);
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo eliminar el supply");
    };
};
