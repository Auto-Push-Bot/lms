import { db } from "@vercel/postgres";
import { deleteProjectData, editProjectQuery, fetchedPageProject, fetchedProjectForEdit, fetchedProjectScholars, fetchedTableProject, fethedProjectGrade, getScholarTableProjectsQuery, getTableProjectsQuery, newProjectQuery } from "../dtos/project";
import { addScholarQuery, removeScholarQuery } from "../dtos/scholar";
import { gradeProjectQuery } from "../dtos/grade";

const client = db;

export async function getProjectName(id: number) {
    try {
        const text = `
        SELECT name FROM "project" WHERE id = $1 LIMIT 1
        `;
        const values = [id];
        const result = await client.query(text, values);
        let response = result.rows;
        return response[0].name;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el nombre");
    };
};

export async function getTableProjects(params: getTableProjectsQuery) {
    try {
        const offset = (params.page) * params.rowsPerPage;
        const projectsearch = `%${params.projectSearch}%`;
        const scholarsearch = `%${params.scholarSearch}%`;
        const baseValues = [params.laboratory_id, params.rowsPerPage, offset];
        let text = `
            SELECT 
                p.id, 
                p.name, 
                p.description,   
                pt.name AS projecttypename,
                ps.name AS projectstatusname,
                (SELECT COUNT(*) 
                    FROM "task" t 
                    WHERE t.project_id = p.id ) AS projecttaskcount,
                (SELECT COUNT(*)
                    FROM "task" t
                    JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
                    WHERE t.project_id = p.id AND ts.name = 'Completada') AS completedprojecttaskcount
            FROM "project" p
            JOIN "projecttype" pt ON p.projecttype_id = pt.id
            JOIN "projectstatus" ps ON p.projectstatus_id = ps.id
            LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
            LEFT JOIN "scholar" s ON s.id = psc.scholar_id
            LEFT JOIN "usercareer" uc ON uc.id = s.usercareer_id
            LEFT JOIN "scholarshiptype" st ON st.id = s.scholarshiptype_id
            WHERE p.laboratory_id = $1
        `;
        const values: any = [...baseValues];
        let filtertext = '';
        if (params.projectSearch !== "") {
            filtertext += `AND unaccent(p.name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(projectsearch);
        };
        if (params.projecttype_id !== 0) {
            filtertext += `AND p.projecttype_id = $${values.length + 1}
            `;
            values.push(params.projecttype_id);
        };
        if (params.projectstatus_id !== 0) {
            filtertext += `AND p.projectstatus_id = $${values.length + 1}
            `;
            values.push(params.projectstatus_id);
        };
        if (params.scholarSearch !== "") {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "projectscholar" psc2
                JOIN "user" u ON u.id = psc2.scholar_id
                WHERE psc2.project_id = p.id
                AND unaccent(u.name) ILIKE unaccent($${values.length + 1})
            )
            `;
            values.push(scholarsearch)
        };
        if (params.scholarshiptype_id !== 0) {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "projectscholar" psc2
                JOIN "scholar" s2 ON s2.id = psc2.scholar_id
                WHERE psc2.project_id = p.id
                AND s2.scholarshiptype_id = $${values.length + 1}
            )
            `;
            values.push(params.scholarshiptype_id);
        };
        if (params.usercareer_id !== 0) {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "projectscholar" psc2
                JOIN "scholar" s2 ON s2.id = psc2.scholar_id
                WHERE psc2.project_id = p.id
                AND s2.usercareer_id = $${values.length + 1}
            )
            `;
            values.push(params.usercareer_id);
        };
        text += filtertext;
        const grouptext = `
            GROUP BY 
                p.id, pt.name, ps.name
        `;
        text += grouptext;
        text += `
            LIMIT $2 OFFSET $3
        `;
        const result = await client.query(text, values);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "project" p
        WHERE p.laboratory_id = $1
        `;
        const values2 = [params.laboratory_id];
        const countresult = await client.query(text2, values2);
        return {
            projects: result.rows as fetchedTableProject[],
            totalProjects: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos");
    };
};

export async function getScholarTableProjects(params: getScholarTableProjectsQuery) {
    try {
        const offset = (params.page) * params.rowsPerPage;
        const projectsearch = `%${params.projectSearch}%`;
        const baseValues = [params.laboratory_id, params.rowsPerPage, offset, params.current_id];
        let text = `
            SELECT 
                p.id, 
                p.name, 
                p.description,   
                pt.name AS projecttypename,
                ps.name AS projectstatusname,
                (SELECT COUNT(*) 
                    FROM "task" t 
                    WHERE t.project_id = p.id ) AS projecttaskcount,
                (SELECT COUNT(*)
                    FROM "task" t
                    JOIN "taskstatus" ts ON t.taskstatus_id = ts.id
                    WHERE t.project_id = p.id AND ts.name = 'Completada') AS completedprojecttaskcount,
                (SELECT COUNT(*)
                    FROM "observation_read" r
                    JOIN "observation" o ON r.observation_id = o.id
                    WHERE r.scholar_id = $4 AND is_read = false AND o.project_id = p.id) AS newobservations
            FROM "project" p
            JOIN "projecttype" pt ON p.projecttype_id = pt.id
            JOIN "projectstatus" ps ON p.projectstatus_id = ps.id
            LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
            WHERE p.laboratory_id = $1
            AND psc.scholar_id = $4
        `;
        const values: any = [...baseValues];
        let filtertext = '';
        if (params.projectSearch !== "") {
            filtertext += `AND unaccent(p.name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(projectsearch);
        };
        if (params.projecttype_id !== 0) {
            filtertext += `AND p.projecttype_id = $${values.length + 1}
            `;
            values.push(params.projecttype_id);
        };
        if (params.projectstatus_id !== 0) {
            filtertext += `AND p.projectstatus_id = $${values.length + 1}
            `;
            values.push(params.projectstatus_id);
        };
        text += filtertext;
        const grouptext = `
            GROUP BY 
                p.id, pt.name, ps.name
        `;
        text += grouptext;
        text += `
            LIMIT $2 OFFSET $3
        `;
        const result = await client.query(text, values);
        const text2 = `
        SELECT COUNT(*) AS total
        FROM "project" p
        LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
        WHERE p.laboratory_id = $1 AND psc.scholar_id = $2
        `;
        const values2 = [params.laboratory_id, params.current_id];
        const countresult = await client.query(text2, values2);
        return {
            projects: result.rows as fetchedTableProject[],
            totalProjects: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos");
    };
};

export async function countAllUnreadObservations(id: number) {
    try {
        const text = `
        SELECT COUNT(*)
        FROM "observation_read" r
        JOIN "observation" o ON r.observation_id = o.id
        WHERE r.scholar_id = $1 AND is_read = false
        `;
        const values = [id];
        const count = await client.query(text, values);
        return parseInt(count.rows[0].count, 10);
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos");
    };
};

export async function getProjectById(id: number) {
    try {
        let text = `
            SELECT 
                p.id, 
                p.name, 
                p.description,  
                p.projecttype_id,
                p.projectstatus_id,
                p.laboratory_id,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', s.id,
                            'name', u.name,
                            'email', u.email,
                            'file', s.file
                        )
                    ) FILTER (WHERE s.id IS NOT NULL), '[]'
                ) AS scholars
            FROM "project" p
            JOIN "projecttype" pt ON p.projecttype_id = pt.id
            JOIN "projectstatus" ps ON p.projectstatus_id = ps.id
            LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
            LEFT JOIN "scholar" s ON s.id = psc.scholar_id
            LEFT JOIN "user" u ON u.id = s.id
            WHERE p.id = $1
        `;
        const values = [id]
        const grouptext = `
            GROUP BY 
                p.id, pt.name, ps.name
        `;
        text += grouptext;
        text += `
            LIMIT 1
        `;
        const result = await client.query(text, values);
        return result.rows[0] as fetchedPageProject;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos");
    };
};

export async function getProjectScholarsByProjectId(id: number) {
    try {
        let text = `
            SELECT 
                p.laboratory_id,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', s.id,
                            'name', u.name,
                            'email', u.email,
                            'file', s.file
                        )
                    ) FILTER (WHERE s.id IS NOT NULL), '[]'
                ) AS scholars
            FROM "project" p
            LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
            LEFT JOIN "scholar" s ON s.id = psc.scholar_id
            LEFT JOIN "user" u ON u.id = s.id
            WHERE p.id = $1
        `;
        const values = [id]
        const grouptext = `
            GROUP BY 
                p.id
        `;
        text += grouptext;
        const result = await client.query(text, values);
        return result.rows[0] as fetchedProjectScholars;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos");
    };
};

export async function getProjectForEditById(id: number) {
    try {
        let text = `
            SELECT  
                p.name, 
                p.description,  
                p.projecttype_id,
                p.projectstatus_id,
                pg.date AS grade_date,
                g.name AS grade_name
            FROM "project" p
            LEFT JOIN "projectgrade" pg ON p.id = pg.project_id
            LEFT JOIN "grade" g ON pg.grade_id = g.id
            WHERE p.id = $1
            ORDER BY pg.date DESC
            LIMIT 1
        `;
        const values = [id];
        const result = await client.query(text, values);
        return result.rows[0] as fetchedProjectForEdit;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el proyecto");
    };
};

export async function getProjectGrades(id: number) {
    try {
        let text = `
            SELECT  
                pg.date, 
                g.name AS name
            FROM "projectgrade" pg
            JOIN "grade" g ON pg.grade_id = g.id
            WHERE pg.project_id = $1
            ORDER BY pg.date DESC
        `;
        const values = [id];
        const result = await client.query(text, values);
        return result.rows as fethedProjectGrade[];
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener el proyecto");
    };
};

export async function newProject(params: newProjectQuery) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        const text1 = `
        INSERT INTO "project" (name, description, laboratory_id, projectstatus_id, projecttype_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        ;`;
        const values1 = [params.name, params.description, params.laboratory_id, params.projectstatus_id, params.projecttype_id];
        const response = await client.query(text1, values1);
        const projectid = response.rows[0].id;
        for (const scholar of params.scholars) {
            const scholarid = scholar.scholar_id;
            const text2 = `
            INSERT INTO "projectscholar" (project_id, scholar_id)
            VALUES ($1, $2)
            `;
            const values2 = [projectid, scholarid];
            await client.query(text2, values2)
        };
        const textcommit = `COMMIT`;
        await client.query(textcommit);
        return { success: true, message: "Instancia creada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        const textrollback = `ROLLBACK`;
        await client.query(textrollback);
        throw new Error("No se pudo crear el proyecto");
    };
};

export async function addScholar(params: addScholarQuery) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        for (const scholar of params.scholars) {
            const scholarid = scholar.scholar_id;
            const text = `
            INSERT INTO "projectscholar" (project_id, scholar_id)
            VALUES ($1, $2)
            `;
            const values = [params.project_id, scholarid];
            await client.query(text, values)
        }
        const textcommit = `COMMIT`;
        await client.query(textcommit);
        return { success: true, message: "Becario agregado correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        const textrollback = `ROLLBACK`;
        await client.query(textrollback);
        throw new Error("No se pudo agregar el becario");
    };
};

export async function removeScholar(params: removeScholarQuery) {
    try {
        const text = `
            DELETE FROM "projectscholar"
            WHERE scholar_id = $1 AND project_id = $2
            `;
        const values = [params.scholar_id, params.project_id];
        await client.query(text, values)
        return { success: true, message: "Becario desasociado correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo quitar el becario");
    };
};

export async function updateProject(params: editProjectQuery) {
    try {
        const currenttimestamp = new Date().toISOString();
        const text = `
        UPDATE "project"
        SET name = $1,
            description = $2,
            projectstatus_id = $3,
            projecttype_id = $4,
            modified_at = $5
        WHERE id = $6
        `;
        const values = [params.name, params.description, params.projectstatus_id, params.projecttype_id, currenttimestamp, params.id];
        return client.query(text, values);
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar el proyecto");
    };
};

export async function dropProject(params: deleteProjectData) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        const text1 = `
        SELECT id
        FROM "observation"
        WHERE project_id = $1
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
        DELETE FROM "observation" WHERE project_id = $1
        `;
        const values3 = [params.id];
        await client.query(text3, values3);
        const text4 = `
        DELETE FROM "task" WHERE project_id = $1
        `;
        const values4 = [params.id];
        await client.query(text4, values4);
        const text5 = `
        DELETE FROM "projectscholar" WHERE project_id = $1
        `;
        const values5 = [params.id];
        await client.query(text5, values5);
        const text7 = `
        DELETE FROM "projectgrade" WHERE project_id = $1
        `;
        const values7 = [params.id];
        await client.query(text7, values7)
        const text6 = `
        DELETE FROM "project" WHERE id = $1
        `;
        const values6 = [params.id];
        await client.query(text6, values6);
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

export async function createProjectGrade(params: gradeProjectQuery) {
    try {
        const text = `
        INSERT INTO "projectgrade" (grade_id, project_id)
        VALUES ($1, $2)
        `;
        const values = [params.grade_id, params.project_id];
        await client.query(text, values)
        return { success: true };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo calificar el proyecto");
    };
};