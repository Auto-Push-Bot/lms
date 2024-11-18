import { db } from '@vercel/postgres';
import { getTypeGuest } from './usertype';
import { fetchedGuest, fetchGuestQuery, newGuestQuery } from '../dtos/guest';

const client = db;

export async function getGuests(labid: number) {
    try {
        const type = await getTypeGuest();
        const text = `SELECT u.id, u.name, u.created_at, u.dropped_at, u.email, g.expires_at AS expires_at , us.name AS userstatus
        FROM "user" u
        JOIN "userstatus" us ON u.userstatus_id = us.id
        JOIN "guest" g ON u.id = g.id
        WHERE u.usertype_id = $1
            AND u.laboratory_id = $2
        `;
        const values = [type, labid];
        const result = await client.query(text, values);
        return result.rows as fetchedGuest[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el invitado");
    };
};

export async function getGuestsTable(params: fetchGuestQuery) {
    try {
        const type = await getTypeGuest();
        const offset = (params.page) * params.rowsPerPage;
        const validColumns = ['u.name', 'u.userstatus_id'];
        if (!validColumns.includes(params.sortColumn)) {
            throw new Error('Columna invalida');
        };
        const validDirections = ['ASC', 'DESC'];
        if (!validDirections.includes(params.sortDirection.toUpperCase())) {
            throw new Error('Dirección de ordenación invalida');
        };
        const column = params.sortColumn;
        const direction = params.sortDirection.toUpperCase();
        const search = `%${params.search}%`;
        const baseValues = [type, params.laboratory_id, params.rowsPerPage, offset];
        let text = `
            SELECT u.id, u.name, u.created_at, u.dropped_at, u.email, g.expires_at AS expires_at , us.name AS userstatus
            FROM "user" u
            JOIN "userstatus" us ON u.userstatus_id = us.id
            JOIN "guest" g ON u.id = g.id
            WHERE u.usertype_id = $1
                AND u.laboratory_id = $2
        `;
        let values = [...baseValues];
        let filtertext = '';
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
            guests: result.rows as fetchedGuest[],
            totalGuests: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el becario");
    };
};

export async function getGuestExpirationDate(id: number) {
    try {
        const text = `
        SELECT expires_at
        FROM "guest"
        WHERE id = $1
        `;
        const values = [id];
        const response = await client.query(text, values);
        const { expires_at } = response.rows[0];
        return new Date(expires_at);
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo encontrar el invitado");
    };
};

export async function createGuest(user: newGuestQuery)  {
    try {
        const date = new Date(user.expires_at);
        const dateExpiration = date.toISOString().split('T')[0];
        const begintext = `BEGIN`;
        await client.query(begintext);
        const text = `
        INSERT INTO "user" (name, email, password, laboratory_id, usertype_id, userstatus_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        ;`;
        const values = [user.name, user.email, user.password, user.laboratory_id, user.usertype_id, user.userstatus_id];
        const response = await client.query(text, values);
        const id = response.rows[0].id;
        const text2 = `
        INSERT INTO "guest" (id, expires_at)
        VALUES ($1, $2)
        ;`;
        const values2 = [id, dateExpiration];
        await client.query(text2, values2);
        const committext = `COMMIT`;
        await client.query(committext);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        const rollbacktext = `ROLLBACK`;
        await client.query(rollbacktext);
        throw new Error("No se pudo crear el invitado");
    };
};

export async function dropGuest(id: number) {
    try {
        const begintext = `BEGIN`;
        await client.query(begintext);
        const text = `
        DELETE FROM "guest"
        WHERE id = $1
        `;
        const values = [id];
        await client.query(text, values);
        const text2 = `
        DELETE FROM "user"
        WHERE id = $1
        `;
        const values2 = [id];
        await client.query(text2, values2);
        const committext = `COMMIT`;
        await client.query(committext);
        return { success: true, message: "Instancia eliminada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        const rollbacktext = `ROLLBACK`;
        await client.query(rollbacktext);
        throw new Error("No se pudo eliminar el invitado");
    };
};

export async function getGuestStatus(id: number) {
    try {
        const text = `SELECT userstatus_id
        FROM "user"
        WHERE id = $1
        `;
        const values = [id];
        const result = await client.query(text, values);
        const response = result.rows;
        if (response.length > 0) {
            return response[0].userstatus_id;;
        } else {
            throw new Error("No se encontró el estatus");
        }
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el status");
    };
};