import { createABMQuery, editABMQuery, checkExistanceQuery, fetchABMItemQuery, fetchABMQuery, checkItemExistanceQuery, editABMItemQuery, createABMItemQuery } from './dtos/abm';
import { checkGradesABM, createGrade, getGradesABM, editGrade} from './queries/grade';
import { createHistoricProjectStatus } from './queries/historicprojectstatus';
import { createHistoricProjectType } from './queries/historicprojecttype';
import { createHistoricScholarshipType } from './queries/historicscholarshiptype';
import { createHistoricUserCareer } from './queries/historicusercareer';
import { checkProjectStatusesABM, newProjectStatus, getProjectStatusesABM, editProjectStatus } from './queries/projectstatus';
import { checkProjectTypesABM, newProjectType, getProjectTypesABM, editProjectType } from './queries/projecttype';
import { checkScholarshipTypesABM, createScholarshipType, getScholarshipTypesABM, editScholarshipType } from './queries/scholarshiptype';
import { checkSupplyStatusesABM, createSupplyStatus, getSupplyStatusesABM, editSupplyStatus } from './queries/supplystatus';
import { checkSupplyTypesABM, createSupplyType, getSupplyTypesABM, editSupplyType } from './queries/supplytype';
import { checkUserCareersABM, createUserCareer, getUserCareersABM, editUserCareer } from './queries/usercareer';

export async function createInstance(params: createABMQuery) {
    try {
        const allowedTables = ["supplytype", "supplystatus", "projecttype", "projectstatus", "scholarshiptype", "grade", "usercareer"];
        if (!allowedTables.includes(params.table)) {
            throw new Error(`Tabla no valida: ${params.table}`);
        };
        const query = {
            name: params.name,
        } as createABMItemQuery;
        switch (params.table) {
            case "supplytype":
                await createSupplyType(query);
                break;
            case "supplystatus":
                await createSupplyStatus(query);
                break;
            case "projecttype":
                await newProjectType(query);
                await createHistoricProjectType(query);
                break;
            case "projectstatus":
                await newProjectStatus(query);
                await createHistoricProjectStatus(query);
                break;
            case "scholarshiptype":
                await createScholarshipType(query);
                await createHistoricScholarshipType(query);
                break;
            case "grade":
                await createGrade(query);
                break;
            case "usercareer":
                await createUserCareer(query);
                await createHistoricUserCareer(query);
                break;
            default:
                throw new Error(`No se puede manejar la tabla: ${params.table}`);
        }
        return { success: true };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo crear instancia (profundo)");
    };
};

export async function editInstance(params: editABMQuery) {
    try {
        const allowedTables = ["supplytype", "supplystatus", "projecttype", "projectstatus", "scholarshiptype", "grade", "usercareer"];
        if (!allowedTables.includes(params.table)) {
            throw new Error(`Tabla no valida: ${params.table}`);
        }
        const query = {
            name: params.name,
            id: params.id,
        } as editABMItemQuery;
        const query2 = {
            name: params.name,
        } as createABMItemQuery;
        switch (params.table) {
            case "supplytype":
                await editSupplyType(query);
                break;
            case "supplystatus":
                await editSupplyStatus(query);
                break;
            case "projecttype":
                await createHistoricProjectType(query2);
                await editProjectType(query);
                break;
            case "projectstatus":
                await createHistoricProjectStatus(query2);
                await editProjectStatus(query);
                break;
            case "scholarshiptype":
                await createHistoricScholarshipType(query2);
                await editScholarshipType(query);
                break;
            case "grade":
                await editGrade(query);
                break;
            case "usercareer":
                await createHistoricUserCareer(query2);
                await editUserCareer(query);
                break;
            default:
                throw new Error(`No se puede manejar la tabla: ${params.table}`);
        };
        return { success: true };
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo editar instancia (profundo)");
    };
};

export async function getInstances(params: fetchABMQuery) {  
    try {
        let data;
        const allowedTables = ["supplytype", "supplystatus", "projecttype", "projectstatus", "scholarshiptype", "grade", "usercareer"];
        if (!allowedTables.includes(params.table)) {
            throw new Error(`Tabla no valida: ${params.table}`);
        };
        const query = {
            name: params.name,
            page: params.page,
            rowsPerPage: params.rowsPerPage
        } as fetchABMItemQuery;
        switch (params.table) {
            case "supplytype":
                data = await getSupplyTypesABM(query);
                break;
            case "supplystatus":
                data = await getSupplyStatusesABM(query);
                break;
            case "projecttype":
                data = await getProjectTypesABM(query);
                break;
            case "projectstatus":
                data = await getProjectStatusesABM(query);
                break;
            case "scholarshiptype":
                data = await getScholarshipTypesABM(query);
                break;
            case "grade":
                data = await getGradesABM(query);
                break;
            case "usercareer":
                data = await getUserCareersABM(query);
                break;
            default:
                throw new Error(`No se puede manejar la tabla: ${params.table}`);
        };
        return data;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la instancia (profundo)");
    };
};

export async function checkInstanceExistance(params: checkExistanceQuery) {
    try {
        let data;
        const allowedTables = ["supplytype", "supplystatus", "projecttype", "projectstatus", "scholarshiptype", "grade", "usercareer"];
        if (!allowedTables.includes(params.table)) {
            throw new Error(`Tabla no valida: ${params.table}`);
        };
        const query = {
            name: params.name,
        } as checkItemExistanceQuery;
        switch (params.table) {
            case "supplytype":
                data = await checkSupplyTypesABM(query);
                break;
            case "supplystatus":
                data = await checkSupplyStatusesABM(query);
                break;
            case "projecttype":
                data = await checkProjectTypesABM(query);
                break;
            case "projectstatus":
                data = await checkProjectStatusesABM(query);
                break;
            case "scholarshiptype":
                data = await checkScholarshipTypesABM(query);
                break;
            case "grade":
                data = await checkGradesABM(query);
                break;
            case "usercareer":
                data = await checkUserCareersABM(query);
                break;
            default:
                throw new Error(`No se puede manejar la tabla: ${params.table}`);
        };
        return data;
    } catch (error) {
        console.error("Error de Base de Datos:", error);
        throw new Error("No se pudo obtener la instancia (profundo)");
    };
};