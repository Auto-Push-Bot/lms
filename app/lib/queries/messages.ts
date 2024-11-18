import { db } from "@vercel/postgres";
import { deleteMessageQuery, fetchedMessages, newMessageQuery } from "../dtos/message";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const client = db;

export async function getMessages(sender_id: number, receiver_id: number, page: number) {
    try {
        const limit = 30;
        const offset = (page - 1) * limit;
        const text = `
        SELECT id, content, timestamp, sender_id, receiver_id, is_read
        FROM "message"
        WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY timestamp ASC
        LIMIT $3 OFFSET $4
        `;
        const values = [sender_id, receiver_id, limit, offset];
        const result = await client.query(text, values);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "message"
        WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)
        `;
        const values2 = [sender_id, receiver_id];
        const count = await client.query(text2, values2);
        return {
            messages: result.rows as fetchedMessages[],
            totalMessages: count.rows[0].total as number,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el message");
    };
};

export async function createMessage(message: newMessageQuery) {
    try {
        const argentinaTimestamp = dayjs().tz('America/Argentina/Buenos_Aires').format();
        const text = `
        INSERT INTO "message" (content, sender_id, receiver_id, timestamp)
        VALUES ($1, $2, $3, $4)
        `;
        const values = [message.content, message.sender_id, message.receiver_id, argentinaTimestamp];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear el message");
    };
};

export async function readMessage(sender_id: number, receiver_id: number) {
    try {
        const text = `
        UPDATE "message"
        SET is_read = true
        WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
        `;
        const values = [sender_id, receiver_id];
        await client.query(text, values);
        return { success: true, message: "Instancia modificada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo modificar el message");
    };
    ;
}

export async function countUnreadMessages(sender_id: number, receiver_id: number) {
    try {
        const text = `
        SELECT COUNT(*) FROM message
        WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
        `;
        const values = [sender_id, receiver_id];
        const count = await client.query(text, values);
        return parseInt(count.rows[0].count, 10);
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo contar los message");
    };
};

export async function countAllUnreadMessages(receiver_id: number) {
    try {
        const text = `
        SELECT COUNT(*) FROM message
        WHERE receiver_id = $1 AND is_read = false
        `;
        const values = [receiver_id];
        const count = await client.query(text, values);
        return parseInt(count.rows[0].count, 10);
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo contar los message");
    };
};

export async function dropMessage(params: deleteMessageQuery) {
    try {
        const text = `
        DELETE FROM "message" WHERE id = $1
        `;
        const values = [params.id];
        await client.query(text, values);
        return { success: true };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo eliminar el mensaje");
    };
};