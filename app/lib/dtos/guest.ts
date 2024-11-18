import { Dayjs } from "dayjs";
import { newUserQuery, userSchema } from "./user";
import { UseFormSetValue } from "react-hook-form";

export type guestTableProps = {
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type guestFormData = {
    //filters
    search: string;
    //pagination
    page: number;
    rowsPerPage: number;
    //modals
    modalOpenCreate: boolean;
    modalOpenDelete: boolean;
    //selected row
    selectedRowId: number;
    selectedRowName: string;
    //expanded row
    expandedRowId: null | number;
    //sort by column
    sortDirection: 'ASC' | 'DESC';
    sortColumn: string;
};

export type guest = userSchema & {
    expires_at: Date;
};

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    name: string;
    email: string;
    expires_at: Dayjs | null;
    password: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createGuestData = {
    name: string;
    email: string;
    password: string;
    expires_at: any;
    laboratory_id:number;
};

export type newGuestQuery = newUserQuery & {
    expires_at: Date;
    laboratory_id: number;
};

export type fetchedGuest = {
    id: number;
    name: string;
    created_at: Date;
    dropped_at: Date | null;
    expires_at: Date;
    email: string;
    userstatus: string;
};

export type fetchGuestData = {
    search: string;
    laboratory_id: number; 
    sortColumn: string;
    sortDirection: "ASC" | "DESC";
    page: number; 
    rowsPerPage: number;
};

export type fetchGuestQuery = {
    search: string;
    laboratory_id: number;
    sortColumn: string;
    sortDirection: "ASC" | "DESC";
    page: number;
    rowsPerPage: number;
};

export type deleteModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};