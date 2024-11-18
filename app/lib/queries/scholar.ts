import { db } from "@vercel/postgres";
import { getTypeScholar } from "./usertype";
import { editScholarQuery, fetchedScholar, fetchScholarQuery, newScholarQuery } from "../dtos/scholar";
import { fetchedChatUser } from "../dtos/message";

const client = db;

export async function getScholars(labid: number) {
    try {
        const type = await getTypeScholar();
        const text = `SELECT u.id, u.name, u.email, u.created_at, u.dropped_at, 
                us.name AS userstatus, 
                s.file, s.dni, s.address, s.phone, s.careerlevel, s.usercareer_id, s.scholarshiptype_id,
                uc.name AS usercareer, 
                st.name AS scholarshiptype
            FROM "user" u
            JOIN "userstatus" us ON u.userstatus_id = us.id
            JOIN "scholar" s ON u.id = s.id
            JOIN "usercareer" uc ON s.usercareer_id = uc.id
            JOIN "scholarshiptype" st ON s.scholarshiptype_id = st.id
            WHERE u.usertype_id = $1
                AND u.laboratory_id = $2
        `;
        const values = [type, labid];
        const result = await client.query(text, values);
        return result.rows as fetchedScholar[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el becario");
    };
};

export async function getLabScholars(labid: number) {
    try {
        const type = await getTypeScholar();
        const text = `
        SELECT u.id, u.name
        FROM "user" u
        WHERE u.usertype_id = $1
            AND u.laboratory_id = $2
        `;
        const values = [type, labid];
        const result = await client.query(text, values);
        return result.rows as fetchedChatUser[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el becario");
    };
};

export async function hasProject(id: number) {
    try {
        const text = `
        SELECT * 
        FROM "projectscholar"
        WHERE scholar_id = $1
        `;
        const values = [id];
        const result = await client.query(text, values);
        if (result.rows.length > 0) {
            return true;
        };
        return false;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la asignación");
    };
};

export async function getAddScholars(labid: number, scholar_ids: number[]) {
    try {
        const type = await getTypeScholar();
        let text = `
        SELECT u.id, u.name
        FROM "user" u
        WHERE u.usertype_id = $1
            AND u.laboratory_id = $2
        `;
        if (scholar_ids.length > 0) {
            text +=  `${scholar_ids.length > 0 ? `AND u.id NOT IN (${scholar_ids.join(",")})` : ""}`
        };
        const values = [type, labid];
        const result = await client.query(text, values);
        return result.rows as fetchedChatUser[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el becario");
    };
};

export async function getScholarsTable(params: fetchScholarQuery) {
    try {
        const type = await getTypeScholar();
        const offset = (params.page) * params.rowsPerPage;
        const validColumns = ['u.name', 'u.userstatus_id'];
        if (!validColumns.includes(params.sortColumn)) {
            throw new Error('Columna invalida');
        }
        const validDirections = ['ASC', 'DESC'];
        if (!validDirections.includes(params.sortDirection.toUpperCase())) {
            throw new Error('Dirección de ordenación invalida');
        }
        const column = params.sortColumn;
        const direction = params.sortDirection.toUpperCase();
        const search = `%${params.search}%`;
        const baseValues = [type, params.laboratory_id, params.rowsPerPage, offset];
        let text = `
            SELECT u.id, u.name, u.email, u.created_at, u.dropped_at, 
                us.name AS userstatus, 
                s.file, s.dni, s.address, s.phone, s.careerlevel, s.usercareer_id, s.scholarshiptype_id,
                uc.name AS usercareer, 
                st.name AS scholarshiptype
            FROM "user" u
            JOIN "userstatus" us ON u.userstatus_id = us.id
            JOIN "scholar" s ON u.id = s.id
            JOIN "usercareer" uc ON s.usercareer_id = uc.id
            JOIN "scholarshiptype" st ON s.scholarshiptype_id = st.id
            WHERE u.usertype_id = $1
                AND u.laboratory_id = $2
        `;
        let values = [...baseValues];
        let filtertext = '';
        if (params.usercareer_id !== 0) {
            filtertext += `AND s.usercareer_id = $${values.length + 1} 
            `;
            values.push(params.usercareer_id);
        };
        if (params.scholarshiptype_id !== 0) {
            filtertext += `AND s.scholarshiptype_id = $${values.length + 1} 
            `;
            values.push(params.scholarshiptype_id);
        };
        if (params.search !== "") {
            filtertext += `AND unaccent(u.name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(search);
        };
        text += filtertext;
        let ordertext = '';
        if (column === "u.name") {
            ordertext = "ORDER BY u.name ";
        } else if (column === "u.userstatus_id") {
            ordertext = "ORDER BY u.userstatus_id ";
        };
        if (direction === "DESC" || direction === "ASC") {
            ordertext += direction;
        };
        text += ordertext + `
            LIMIT $3 OFFSET $4
        `;
        const result = await client.query(text, values);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "user" u
        WHERE u.usertype_id = $1
            AND u.laboratory_id = $2
        `;
        const values2 = [type, params.laboratory_id];
        const countresult = await client.query(text2, values2);
        return {
            scholars: result.rows as fetchedScholar[],
            totalScholars: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el becario");
    };
};

export async function createScholar(user: newScholarQuery)  {
    try {
        const begintext = `BEGIN`;
        await client.query(begintext);
        const values1 = [user.name, user.email, user.password, user.laboratory_id, user.usertype_id, user.userstatus_id];
        const text1 =` 
        INSERT INTO "user" (name, email, password, laboratory_id, usertype_id, userstatus_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `;
        const response = await client.query(text1, values1);
        const id = response.rows[0].id;
        const values2 = [id, user.dni, user.file, user.phone, user.address, user.careerlevel, user.usercareer_id, user.scholarshiptype_id];
        const text2 =` 
        INSERT INTO "scholar" (id, dni, file, phone, address, careerlevel, usercareer_id, scholarshiptype_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        await client.query(text2, values2);
        const committext = `COMMIT`;
        await client.query(committext);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        const rollbacktext = `ROLLBACK`;
        await client.query(rollbacktext);
        throw new Error("No se pudo crear el becario");
    };
};

export async function editScholar(user: editScholarQuery) {
    try {
        const begintext = `BEGIN`;
        await client.query(begintext);
        const values1 = [user.name, user.id];
        const text1 = `
            UPDATE "user"
            SET name = $1
            WHERE id = $2
        `;
        await client.query(text1, values1);
        const values2 = [user.file, user.dni, user.address, user.phone, user.careerlevel, user.scholarshiptype_id, user.usercareer_id, user.id];
        const text2 = `
            UPDATE "scholar"
            SET file = $1,
                dni = $2,
                address = $3,
                phone = $4,
                careerlevel = $5,
                scholarshiptype_id = $6,
                usercareer_id = $7
            WHERE id = $8
        `;
        await client.query(text2, values2);
        const committext = `COMMIT`;
        await client.query(committext);
        return { success: true, message: "Instancia editada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        const rollbacktext = `ROLLBACK`;
        await client.query(rollbacktext);
        throw new Error("No se pudo editar el becario");
    };
};