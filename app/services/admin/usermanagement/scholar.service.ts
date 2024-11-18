"use server"

import { createScholarData, editScholarData, editScholarQuery, fetchedScholar, fetchScholarData, fetchScholarQuery, newScholarQuery } from "@/app/lib/dtos/scholar";
import { createScholar, editScholar, getScholarsTable, hasProject } from "@/app/lib/queries/scholar";
import { userChangeStatus } from "@/app/lib/queries/user";
import { getStatusDeactivated, getStatusPending } from "@/app/lib/queries/userstatus";
import { getTypeScholar } from "@/app/lib/queries/usertype";
import { db } from "@vercel/postgres";
import bcrypt from 'bcryptjs';

interface APIErrors {
    dni?: string,
    file?: string,
    email?: string,
    message?: string;
};

export async function fetchTableData(data: fetchScholarData) {
    try {    
        const params = {
            search: data.search,
            scholarshiptype_id: data.scholarshiptype_id,
            usercareer_id: data.usercareer_id,
            laboratory_id: data.laboratory_id,
            sortColumn: data.sortColumn,
            sortDirection: data.sortDirection,
            page: data.page,
            rowsPerPage: data.rowsPerPage,
        } as fetchScholarQuery;
        let response: { scholars: fetchedScholar[]; totalScholars: any; };
        response = await getScholarsTable(params);
        return response;
    } catch (error) {
        console.error("Error en fetchTableData(Scholar):", error);
        throw error;
    };
};

export async function createTableData(data: createScholarData) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 5);
        const userstatus = await getStatusPending();
        const usertype = await getTypeScholar();
        const client = db;
        const text1 = `
            SELECT * FROM "user" WHERE email = $1 LIMIT 1
        `;    
        const values1 = [data.email];
        const existingUserEmail = await client.query(text1, values1);
        const text2 = `
            SELECT * FROM "scholar" WHERE file = $1 LIMIT 1
        `;
        const values2 = [data.file];
        const existingScholarFile = await client.query(text2, values2);
        const text3 = `
            SELECT * FROM "scholar" WHERE dni = $1 LIMIT 1
        `; 
        const values3 = [data.dni] ;
        const existingScholarDNI = await client.query(text3, values3);
        const apiErrors: APIErrors = {};
        if (existingUserEmail.rows.length > 0) {
            apiErrors.email = "Email en uso";
        };
        if (existingScholarFile.rows.length > 0) {
            apiErrors.file = "Legajo ya existe";
        };
        if (existingScholarDNI.rows.length > 0) {
            apiErrors.dni = "DNI ya existe";
        };
        if (Object.keys(apiErrors).length > 0) {
            return { success: false, apiError: apiErrors };
        };
        const user = {
            name: data.name,
            file: data.file,
            dni: data.dni,
            address: data.address,
            phone: data.phone,
            careerlevel: data.careerlevel,
            email: data.email,
            password: hashedPassword,
            laboratory_id: data.laboratory_id,
            usertype_id: usertype,
            userstatus_id: userstatus,
            scholarshiptype_id: data.scholarshiptype_id,
            usercareer_id: data.usercareer_id,
        } as newScholarQuery;
        try {
            await createScholar(user);
            return { success: true };
        } catch(error) {
            console.error("Error al crear Becario:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en createTableData(Scholar):", error);
        throw error;
    };
};

export async function editTableData(data: editScholarData) {
    try {
        const client = db;
        const text1 = `
            SELECT * FROM "scholar" WHERE file = $1 AND id != $2 LIMIT 1
        `;
        const values1 = [data.file, data.id];
        const existingScholarFile = await client.query(text1, values1);
        const text2 = `
            SELECT * FROM "scholar" WHERE dni = $1 AND id != $2 LIMIT 1
        `;    
        const values2 = [data.dni, data.id];
        const existingScholarDNI = await client.query(text2, values2);
        const apiErrors: APIErrors = {};
        if (existingScholarFile.rows.length > 0) {
            apiErrors.file = "Legajo ya existe";
        };
        if (existingScholarDNI.rows.length > 0) {
            apiErrors.dni = "DNI ya existe";
        };
        if (Object.keys(apiErrors).length > 0) {
            return { success: false, apiError: apiErrors };
        };
        const user = {
            id: data.id,
            name: data.name,
            file: data.file,
            dni: data.dni,
            address: data.address,
            phone: data.phone,
            careerlevel: data.careerlevel,
            scholarshiptype_id: data.scholarshiptype_id,
            usercareer_id: data.usercareer_id,
        } as editScholarQuery;
        try {
            await editScholar(user);
            return { success: true };
        } catch(error) {
            console.error("Error al editar Becario:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en editTableData(Scholar):", error);
        throw error;
    };
};

export async function deactivateTableData(id: number) {
    try {
        const isAssigned = await hasProject(id);
        const apiError: APIErrors = {};
        if ( isAssigned ) {
            apiError.message = "El becario se encuentra asignado a uno o más proyectos";
        }
        if (Object.keys(apiError).length > 0) {
            return { success: false, apiError: apiError };
        }
        const newStatus = await getStatusDeactivated();
        try {
            await userChangeStatus(id, newStatus);
            return { success: true };
        } catch(error) {
            console.error("Error al deshabilitar Becario:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en deactivateTableData(Scholar):", error);
        throw error;
    };
};