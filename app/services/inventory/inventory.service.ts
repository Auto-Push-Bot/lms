"use server"

import { editSupplyData, editSupplyQuery, fetchedSupply, fetchSupplyData, newSupplyData, newSupplyQuery } from "@/app/lib/dtos/supply";
import { createSupply, dropSupply, editSupply, getSuppliesTable } from "@/app/lib/queries/supply";

export async function fetchTableData(data: fetchSupplyData) {
    try {
        let response: { supplies: fetchedSupply[]; totalSupplies: any; };
        response = await getSuppliesTable(data);
        return response;
    } catch (error) {
        console.error("Error en fetchTableData(Inventory):", error);
        throw error;
    };
};

export async function createTableData(data: newSupplyData) {
    try {
        const supply = {
            name: data.name,
            description: data.description,
            year: data.year,
            supplystatus_id: data.supplystatus_id,
            supplytype_id: data.supplytype_id,
            laboratory_id: data.laboratory_id,
        } as newSupplyQuery;
        try {
            await createSupply(supply);
            return { success: true };
        } catch (error) {
            console.error("Error al crear Supply:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en createTableData(Supply):", error);
        throw error;
    };
};

export async function deleteTableData(id: number) {
    try {
        await dropSupply(id);
        return { success: true };
    } catch(error) {
        console.error("Error en deleteTableData(Supply):", error);
        throw error;
    };
};

export async function editTableData(data: editSupplyData) {
    try {
        const supply = {
            name: data.name,
            description: data.description,
            year: data.year,
            supplystatus_id: data.supplystatus_id,
            supplytype_id: data.supplytype_id,
            id: data.id,
        } as editSupplyQuery;
        try {
            await editSupply(supply);
            return { success: true };
        } catch (error) {
            console.error("Error al editar Supply:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en editTableData(Supply):", error);
        throw error;
    };
};