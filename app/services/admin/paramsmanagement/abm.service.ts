"use server"

import { checkInstanceExistance, createInstance, editInstance, getInstances } from "@/app/lib/abm";
import { createABMQuery, editABMQuery, fetchABMData, fetchABMQuery, fetchedABMItem } from "@/app/lib/dtos/abm";

interface APIError {
    name?: string;
};

export async function fetchTableData(data: fetchABMData) {
    try {
        const params = {
            name: data.search,
            page: data.page,
            rowsPerPage: data.rowsPerPage,
            table: data.table
        } as fetchABMQuery;
        let response: { items: fetchedABMItem[]; totalItems: any; };
        response = await getInstances(params);
        return response;
    } catch (error) {
        console.error("Error en fetchTableData(ABM):", error);
        throw error;
    };
};

export async function createTableData(data: { name: string; table: string }) {
    try {
        const existingNameInstance = await checkInstanceExistance({ table: data.table, name: data.name });
        const apiError: APIError = {};
        if (existingNameInstance.rows.length > 0) {
            apiError.name = "Instancia ya existe";
        };
        if (Object.keys(apiError).length > 0) {
            return { success: false, apiError: apiError };
        };
        const query = {
            name: data.name,
            table: data.table
        } as createABMQuery;
        try {
            await createInstance(query);
            return { success: true };
        } catch (error) {
            console.error("Error al crear Instancia:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en createTableData(ABM):", error);
        throw error;
    };
};

export async function editTableData(data: { name: string; table: string; id:number }) {
    try {
        const existingNameInstance = await checkInstanceExistance({ table: data.table, name: data.name });
        const apiError: APIError = {};
        if (existingNameInstance.rows.length > 0) {
            apiError.name = "Instancia ya existe";
        };
        if (Object.keys(apiError).length > 0) {
            return { success: false, apiError: apiError };
        };
        const query = {
            name: data.name,
            table: data.table,
            id: data.id
        } as editABMQuery;
        try {
            await editInstance(query);
            return { success: true };
        } catch (error) {
            console.error("Error al editar instancia:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en editTableData(ABM):", error);
        throw error;
    };
};