import { db } from "@vercel/postgres";
import { calendarTasks, newProjectTaskQuery, dropTaskQuery, dragTaskQuery, editTaskQuery, fetchedPageTask, fetchedTask } from "../dtos/task";
import { getTaskStatusPending } from "./taskstatus";
import dayjs from "dayjs";

const client = db;

export async function getTaskById(id: number, project_id: number) {
    try {
        let text = `
        SELECT
            name,
            description,
            start_date AS "start",
            end_date AS "end",
            taskstatus_id
        FROM "task"
        WHERE id = $1 AND project_id = $2
        LIMIT 1
        `;
        const values= [id, project_id];
        const result = await client.query(text, values);
        return result.rows[0] as fetchedTask;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la tarea");
    };
};

export async function getProjectTasks(project_id: number, page: number) {
    try {
        const limit = 5;
        const offset = (page - 1) * limit;
        const text1 = `
        SELECT
            t.id,
            t.name,
            t.description,
            t.created_at,
            t.start_date AS "start",
            t.end_date AS "end",
            ts.name AS taskstatusname
        FROM "task" t
        JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
        WHERE t.project_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `;
        const values1 = [project_id, limit, offset];
        const result = await client.query(text1, values1);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "task"
        WHERE project_id = $1
        `;
        const values2 = [project_id];
        const count = await client.query(text2, values2);
        return {
            tasks: result.rows as fetchedPageTask[],
            totalTasks: count.rows[0].total as number,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la tarea");
    };
};

export async function getScholarProjectTasks(project_id: number, page: number, scholar_id: number) {
    try {
        const limit = 5;
        const offset = (page - 1) * limit;
        const text1 = `
        SELECT
            t.id,
            t.name,
            t.description,
            t.created_at,
            t.start_date AS "start",
            t.end_date AS "end",
            ts.name AS taskstatusname,
            (SELECT COUNT(*)
                FROM "observation_read" r
                JOIN "observation" o ON r.observation_id = o.id
                WHERE r.scholar_id = $4 AND is_read = false AND o.task_id = t.id) AS newobservations
        FROM "task" t
        JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
        WHERE t.project_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `;
        const values1 = [project_id, limit, offset, scholar_id];
        const result = await client.query(text1, values1);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "task"
        WHERE project_id = $1
        `;
        const values2 = [project_id];
        const count = await client.query(text2, values2);
        return {
            tasks: result.rows as fetchedPageTask[],
            totalTasks: count.rows[0].total as number,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la tarea");
    };
};

export async function getTaskName(id: number) {
    try {
        const text = `
        SELECT name FROM "task" WHERE id = $1 LIMIT 1
        `;
        const values = [id];
        const result = await client.query(text, values);
        let response =  result.rows;
        return response[0].name;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el nombre");
    };
};

export async function getCalendarTasks(id: number, start_date: Date, end_date: Date) {
    try {
        const formatedstart = new Date(start_date).toISOString().split('T')[0];
        const formatedend = new Date(end_date).toISOString().split('T')[0];
        const text = `
        SELECT
            t.id,
            t.name AS title,
            t.start_date AS "start",
            t.end_date AS "end",
            t.description,
            ts.name AS taskstatusname,
            t.created_at
        FROM "task" t
        JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
        WHERE t.project_id = $1
            AND t.start_date BETWEEN $2 AND $3
        `;
        const values = [id, formatedstart, formatedend];
        const result = await client.query(text, values);
        return result.rows as calendarTasks[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la tarea");
    };
};

export async function getScholarCalendarTasks(id: number, start_date: Date, end_date: Date, current_id: number) {
    try {
        const formatedstart = new Date(start_date).toISOString().split('T')[0];
        const formatedend = new Date(end_date).toISOString().split('T')[0];
        const text = `
        SELECT
            t.id,
            t.name AS title,
            t.start_date AS "start",
            t.end_date AS "end",
            t.description,
            ts.name AS taskstatusname,
            t.created_at,
            (SELECT COUNT(*)
                FROM "observation_read" r
                JOIN "observation" o ON r.observation_id = o.id
                WHERE r.scholar_id = $4 AND is_read = false AND o.task_id = t.id) AS newobservations
        FROM "task" t
        JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
        WHERE t.project_id = $1
            AND t.start_date BETWEEN $2 AND $3
        `;
        const values = [id, formatedstart, formatedend, current_id];
        const result = await client.query(text, values);
        return result.rows as calendarTasks[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la tarea");
    };
};

export async function newProjectTask(params: newProjectTaskQuery) {
    try {
        const statusPending = await getTaskStatusPending() as number;
        const start = dayjs(params.start).tz('America/Argentina/Buenos_Aires').format();
        const end = dayjs(params.end).tz('America/Argentina/Buenos_Aires').format();
        const text = `
        INSERT INTO "task" (name, description, start_date, end_date, project_id, taskstatus_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [params.name, params.description, start, end, params.project_id, statusPending];
        await client.query(text, values);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear la observacion");
    };
};

export async function dropTask(params: dropTaskQuery) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        const text1 = `
        SELECT id
        FROM "observation"
        WHERE task_id = $1
        `;
        const values1 = [params.id];
        const observations = await client.query(text1, values1);
        for (const observation of observations.rows) {
            const observation_id = observation.id;
            const text2 = `
            DELETE FROM "observation_read" WHERE observation_id = $1
            `;
            const values2 = [observation_id];
            await client.query(text2, values2);
        };
        const text3 = `
        DELETE FROM "observation" WHERE task_id = $1
        `;
        const values3 = [params.id];
        await client.query(text3, values3);
        const text4 = `
        DELETE FROM "task" WHERE id = $1
        `;
        const values4 = [params.id];
        await client.query(text4, values4);
        const textcommit = `COMMIT`;
        await client.query(textcommit);
        return { success: true, message: "Instancia eliminada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        const textrollback = `ROLLBACK`;
        await client.query(textrollback);
        throw new Error("No se pudo eliminar la observacion");
    };
};

export async function dragTask(params: dragTaskQuery) {
    try {
        const startDate = new Date(params.start).toISOString();
        const endDate = new Date(params.end).toISOString();
        const text = `
        UPDATE "task" 
        SET start_date = $2,
            end_date = $3
        WHERE id = $1
        `;
        const values = [params.id, startDate, endDate];
        await client.query(text, values);
        return { success: true, message: "Instancia editada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar la observacion");
    };
};

export async function editTask(params: editTaskQuery) {
    try {
        const startDate = new Date(params.start).toISOString();
        const endDate = new Date(params.end).toISOString();
        const text = `
        UPDATE "task"
        SET name = $1,
            description = $2,
            taskstatus_id = $3,
            start_date = $4,
            end_date = $5
        WHERE id = $6
        `;
        const values = [params.name, params.description, params.taskstatus_id, startDate, endDate, params.id];
        return client.query(text, values);
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar el proyecto");
    };
};