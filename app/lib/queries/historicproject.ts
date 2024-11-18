import { db } from '@vercel/postgres';
import { fetchedHistoricProject, fetchHistoricProjectData, newHistoricProjectQuery } from '../dtos/historicproject';
import { getHistoricProjectStatusByName } from './historicprojectstatus';
import { getHistoricProjectTypeByName } from './historicprojecttype';
import { getHistoricUserCareerByName } from './historicusercareer';
import { getHistoricScholarshipTypeByName } from './historicscholarshiptype';
import { dropProject } from './project';

const client = db;

export async function getHistoricProjects(params: fetchHistoricProjectData) {
    try {
        const offset = (params.page) * params.rowsPerPage;
        const validColumns = ['hp.name', 'hp.year', 'hp.historicprojecttype_id', 'hp.historicprojectstatus_id'];
        if (!validColumns.includes(params.sortColumn)) {
            throw new Error('Columna invalida');
        }
        const validDirections = ['ASC', 'DESC'];
        if (!validDirections.includes(params.sortDirection.toUpperCase())) {
            throw new Error('Dirección de ordenación invalida');
        }
        const column = params.sortColumn;
        const direction = params.sortDirection.toUpperCase();
        const projectsearch = `%${params.projectSearch}%`;
        const scholarsearch = `%${params.scholarSearch}%`;
        const baseValues = [params.laboratory_id, params.rowsPerPage, offset];
        let text = `
            SELECT 
                hp.id, 
                hp.name, 
                hp.description, 
                hp.year, 
                hp.historicprojecttype_id, 
                hpt.name AS historicprojecttypename,
                hp.historicprojectstatus_id, 
                hps.name AS historicprojectstatusname,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', hs.id,
                            'name', hs.name,
                            'email', hs.email,
                            'dni', hs.dni,
                            'file', hs.file,
                            'phone', hs.phone,
                            'careerlevel', hs.careerlevel,
                            'historicusercareer_id', hs.historicusercareer_id,
                            'historicusercareername', huc.name,
                            'historicscholarshiptype_id', hs.historicscholarshiptype_id,
                            'historicscholarshiptypename', hst.name
                        )
                    ) FILTER (WHERE hs.id IS NOT NULL), '[]'
                ) AS historicscholars
            FROM "historicproject" hp
            JOIN "historicprojecttype" hpt ON hp.historicprojecttype_id = hpt.id
            JOIN "historicprojectstatus" hps ON hp.historicprojectstatus_id = hps.id
            LEFT JOIN "historicprojectscholar" hpsc ON hp.id = hpsc.historicproject_id
            LEFT JOIN "historicscholar" hs ON hs.id = hpsc.historicscholar_id
            LEFT JOIN "historicusercareer" huc ON huc.id = hs.historicusercareer_id
            LEFT JOIN "historicscholarshiptype" hst ON hst.id = hs.historicscholarshiptype_id
            WHERE hp.laboratory_id = $1
        `;
        const values: any = [...baseValues];
        let filtertext = '';
        if (params.projectSearch !== "") {
            filtertext += `AND unaccent(hp.name) ILIKE unaccent($${values.length + 1}) 
            `;
            values.push(projectsearch);
        };
        if (params.historicprojecttype_id !== 0) {
            filtertext += `AND hp.historicprojecttype_id = $${values.length +1}
            `;
            values.push(params.historicprojecttype_id);
        };
        if (params.historicprojectstatus_id !== 0) {
            filtertext += `AND hp.historicprojectstatus_id = $${values.length +1}
            `;
            values.push(params.historicprojectstatus_id);
        };
        if (params.year !== 0) {
            filtertext += `AND hp.year = $${values.length +1}
            `;
            values.push(params.year);
        };
        if (params.scholarSearch !== "") {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "historicprojectscholar" hpsc2
                JOIN "historicscholar" hs2 ON hs2.id = hpsc2.historicscholar_id
                WHERE hpsc2.historicproject_id = hp.id
                AND unaccent(hs2.name) ILIKE unaccent($${values.length + 1})
            )
            `;
            values.push(scholarsearch)
        };
        if (params.historicscholarshiptype_id !== 0) {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "historicprojectscholar" hpsc2
                JOIN "historicscholar" hs2 ON hs2.id = hpsc2.historicscholar_id
                WHERE hpsc2.historicproject_id = hp.id
                AND hs2.historicscholarshiptype_id = $${values.length +1}
            )
            `;
            values.push(params.historicscholarshiptype_id);
        };
        if (params.historicusercareer_id !== 0) {
            filtertext += `AND EXISTS (
                SELECT 1
                FROM "historicprojectscholar" hpsc2
                JOIN "historicscholar" hs2 ON hs2.id = hpsc2.historicscholar_id
                WHERE hpsc2.historicproject_id = hp.id
                AND hs2.historicusercareer_id = $${values.length +1}
            )
            `;
            values.push(params.historicusercareer_id);
        };
        text += filtertext;
        const grouptext = `
            GROUP BY 
                hp.id, hpt.name, hps.name
        `;
        text += grouptext;
        let ordertext = '';
        if (column === "hp.name") {
            ordertext = "ORDER BY hp.name ";
        } else if (column === "hp.year") {
            ordertext = "ORDER BY hp.year ";
        } else if (column === "hp.historicprojecttype_id") {
            ordertext = "ORDER BY hp.historicprojecttype_id ";
        } else if (column === "hp.historicprojectstatus_id") {
            ordertext = "ORDER BY hp.historicprojectstatus_id ";
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
        FROM "historicproject" hp
        WHERE hp.laboratory_id = $1
        `;
        const values2 = [params.laboratory_id];
        const countresult = await client.query(text2, values2);
        return {
            projects: result.rows as fetchedHistoricProject[],
            totalProjects: countresult.rows[0].total,
        };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener los proyectos históricos");
    };
};

export async function createHistoricProject(historicProject: newHistoricProjectQuery) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        const text1 = `
        INSERT INTO "historicproject" (name, description, year, laboratory_id, historicprojectstatus_id, historicprojecttype_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        ;`;
        const values1 = [historicProject.name, historicProject.description, historicProject.year, historicProject.laboratory_id, historicProject.projectstatus_id, historicProject.projecttype_id];
        const response = await client.query(text1, values1);
        const projectid = response.rows[0].id;
        for (const scholar of historicProject.scholars) {
            const emailValue = scholar.email !== undefined && scholar.email !== '' ? scholar.email : null;
            const dniValue = scholar.dni !== undefined && scholar.dni !== '' ? scholar.dni : null;
            const fileValue = scholar.file !== undefined && scholar.file !== '' ? scholar.file : null;
            const phoneValue = scholar.phone !== undefined && scholar.phone !== '' ? scholar.phone : null;
            const careerlevelValue = scholar.careerlevel !== undefined ? scholar.careerlevel : null;
            const text2 = `
            INSERT INTO "historicscholar" (name, email, dni, file, phone, careerlevel, historicusercareer_id, historicscholarshiptype_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            ;`;
            const values2 = [scholar.name, emailValue, dniValue, fileValue, phoneValue, careerlevelValue, scholar.historicusercareer_id, scholar.historicscholarshiptype_id];
            const response = await client.query(text2, values2);
            const scholarid = response.rows[0].id;
            const text3 = `
            INSERT INTO "historicprojectscholar" (historicproject_id, historicscholar_id)
            VALUES ($1, $2)
            `;
            const values3 = [projectid, scholarid];
            await client.query(text3, values3)
        }
        const textcommit = `COMMIT`;
        await client.query(textcommit);
        return { success: true, message: "Instancia creada correctamente" };
    } catch(error) {
        console.error("Error de Base de Datos:", error);
        const textrollback = `ROLLBACK`;
        await client.query(textrollback);
        throw new Error("No se pudo crear el historico");
    };
};

export async function recordHistoricProject(id: number) {
    try {
        const textbegin = `BEGIN`;
        await client.query(textbegin);
        const text1 = `
        SELECT
            p.name,
            p.description,
            EXTRACT(YEAR FROM p.created_at) AS year,
            ps.name AS projectstatus,
            pt.name AS projecttype,
            p.laboratory_id,
            COALESCE(
                json_agg(
                    json_build_object(
                        'name', u.name,
                        'email', u.email,
                        'file', s.file,
                        'dni', s.dni,
                        'phone', s.phone,
                        'careerlevel', s.careerlevel,
                        'usercareer', uc.name,
                        'scholarshiptype', st.name
                    )
                ) FILTER (WHERE s.id IS NOT NULL), '[]'
            ) AS scholars
            FROM "project" p
            JOIN "projecttype" pt ON p.projecttype_id = pt.id
            JOIN "projectstatus" ps ON p.projectstatus_id = ps.id
            LEFT JOIN "projectscholar" psc ON p.id = psc.project_id
            LEFT JOIN "scholar" s ON s.id = psc.scholar_id
            LEFT JOIN "user" u ON u.id = s.id
            LEFT JOIN "usercareer" uc ON s.usercareer_id = uc.id
            LEFT JOIN "scholarshiptype" st ON s.scholarshiptype_id = st.id
            WHERE p.id = $1
            GROUP BY 
                p.id, pt.name, ps.name
            LIMIT 1
        `;
        const values1 = [id];
        const project = await client.query(text1, values1);
        const projectstatus = await getHistoricProjectStatusByName(project.rows[0].projectstatus);
        const projecttype = await getHistoricProjectTypeByName(project.rows[0].projecttype);
        const scholars = project.rows[0].scholars;
        const scholarPromises = scholars.map(async (scholar: any) => {
            const usercareer = await getHistoricUserCareerByName(scholar.usercareer);
            const scholarshiptype = await getHistoricScholarshipTypeByName(scholar.scholarshiptype);
            return {
                name: scholar.name,
                email: scholar.email,
                dni: scholar.dni,
                file: scholar.file,
                phone: scholar.phone,
                careerlevel: scholar.careerlevel,
                historicscholarshiptype_id: scholarshiptype.id,
                historicusercareer_id: usercareer.id,
            };
        });
        const formattedScholarsResult = await Promise.all(scholarPromises);
        const params = {
            name: project.rows[0].name,
            description: project.rows[0].description,
            year: project.rows[0].year,
            laboratory_id: project.rows[0].laboratory_id,
            projectstatus_id: projectstatus.id,
            projecttype_id: projecttype.id,
            scholars: formattedScholarsResult
        } as newHistoricProjectQuery;
        await createHistoricProject(params);
        await dropProject({id});
        const textcommit = `COMMIT`;
        await client.query(textcommit);
        return { success: true, message: "Instancia creada correctamente" };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        const textrollback = `ROLLBACK`;
        await client.query(textrollback);
        throw new Error("No se pudo crear el historico");
    };
};