"use server"

import { fetchedHistoricProject, fetchHistoricProjectData, fetchHistoricProjectQuery, newHistoricProjectData, newHistoricProjectQuery } from "@/app/lib/dtos/historicproject";
import { createHistoricProject, getHistoricProjects } from "@/app/lib/queries/historicproject";

export async function fetchTableData(data: fetchHistoricProjectData) {
    try {
        const params = {
            projectSearch: data.projectSearch,
            historicprojectstatus_id: data.historicprojectstatus_id,
            historicprojecttype_id: data.historicprojecttype_id,
            year: data.year,
            scholarSearch: data.scholarSearch,
            historicusercareer_id: data.historicusercareer_id,
            historicscholarshiptype_id: data.historicscholarshiptype_id,
            laboratory_id: data.laboratory_id,
            sortColumn: data.sortColumn,
            sortDirection: data.sortDirection,
            page: data.page,
            rowsPerPage: data.rowsPerPage,
        } as fetchHistoricProjectQuery;
        let response: { projects: fetchedHistoricProject[]; totalProjects: any; }; 
        response = await getHistoricProjects(params);
        return response;
    } catch (error) {
        console.error("Error en fetchTableData(Historic):", error);
        throw error;
    };
};

export async function createTableData(data: newHistoricProjectData) {
    try {
        const historicproject = {
            name: data.name,
            description: data.description,
            year: data.year,
            projectstatus_id: data.projectstatus_id,
            projecttype_id: data.projecttype_id,
            laboratory_id: data.laboratory_id,
            scholars: data.scholars
        } as newHistoricProjectQuery;
        try {
            await createHistoricProject(historicproject);
            return { success: true };
        } catch (error) {
            console.error("Error al crear proyecto:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en createTableData(Historic):", error);
        throw error;
    };
};