import { UseFormSetValue } from "react-hook-form";
import { supplyStatus } from "./supplystatus";
import { supplyType } from "./supplytype";

export type inventoryTableProps = {
    laboratory_id: number;
    supplytypes: supplyType[];
    supplystatuses: supplyStatus[];
};

export type guestInventoryTableProps = {
    laboratory_id: number;
};

export type inventoryFormData = {
    //filters
    search: string;   
    //pagination
    page: number;
    rowsPerPage: number;
    //modals
    modalOpenCreate: boolean;
    modalOpenDelete: boolean;
    modalOpenEdit: boolean;
    //selected row
    selectedRowId: number;
    selectedRowName: string;
    selectedRow: null | fetchedSupply;
    //expanded row
    expandedRowId: null | number;
    //sort by column
    sortDirection: 'ASC' | 'DESC';
    sortColumn: string;
};

export type fetchSupplyData = {
    laboratory_id: number;
    name: string;
    sortColumn: string;
    sortDirection: "ASC" | "DESC";
    page: number;
    rowsPerPage: number;
};

export type fetchSupplyQuery = fetchSupplyData;

export type fetchedSupply = {
    id: number;
    name: string;
    description: string;
    year: number;
    supplystatus_id: number;
    supplytype_id: number;
    supplystatus: string;
    supplytype: string;
};

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
    supplytypes: supplyType[];
    supplystatuses: supplyStatus[];
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    year: number;
    name: string;
    description: string;
    supplytype_id: number;
    supplystatus_id: number;
}

export type newSupplyQuery = {
    name: string;
    description: string;
    year: number;
    supplystatus_id: number;
    supplytype_id: number;
    laboratory_id: number;
};

export type newSupplyData = newSupplyQuery;

export type editModalProps = {
    open: boolean;
    handleClose: () => void;
    supplytypes: supplyType[];
    supplystatuses: supplyStatus[];
    row: fetchedSupply;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type editFormData = createFormData;

export type editSupplyQuery = {
    id: number;
    name: string;
    description: string;
    year: number;
    supplystatus_id: number;
    supplytype_id: number;
};

export type editSupplyData = editSupplyQuery;

export type deleteSupplyModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};