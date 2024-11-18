import { UseFormSetValue } from "react-hook-form";
import { scholarshipType } from "./scholarshiptype";
import { newUserQuery, userSchema } from "./user";
import { userCareer } from "./usercareer";

export type scholarTableProps = {
    usercareers: userCareer[];
    scholarships: scholarshipType[];
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type scholarFormData = {
    //filters
    filterAnchor: any;
    filterMenuOpen: boolean;
    activeFilters: { [key: string ]: any }
    showSearchForm: boolean;
    search: string;
    normalsearch: string;
    showScholarshipTypeFilter: boolean;
    scholarshipTypeFilter: number;
    userCareerFilter: number;
    showUserCareerFilter: boolean;    
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
    selectedRow: null | fetchedScholar;
    //expanded row
    expandedRowId: null | number;
    //sort by column
    sortDirection: 'ASC' | 'DESC';
    sortColumn: string;
};

export type createModalPorps = {
    open: boolean;
    handleClose: () => void;
    usercareers: userCareer[];
    scholarships: scholarshipType[];
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    name: string;
    file: string;
    dni: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
    address: string;
    phone: string;
    email: string;
    password: string;
}; 

export type createScholarData = {
    name: string;
    file: string;
    dni: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
    address: string;
    phone: string;
    email: string;
    password: string;
    laboratory_id: number;
};

export type newScholarQuery = newUserQuery & {
    dni: string;
    file: string;
    phone?: string;
    address?: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
    laboratory_id: number;
};

export type editModalProps = {
    open: boolean;
    handleClose: () => void;
    usercareers: userCareer[];
    scholarships: scholarshipType[];
    row: fetchedScholar;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type editFormData = {
    name: string;
    file: string;
    dni: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
    address: string;
    phone: string;
};

export type editScholarData = {
    name: string;
    file: string;
    dni: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
    address: string;
    phone: string;
    id: number;
};

export type editScholarQuery = {
    id: number;
    name: string;
    file: string;
    dni: string;
    address?: string;
    phone?: string;
    careerlevel: number;
    scholarshiptype_id: number;
    usercareer_id: number;
};

export type fetchScholarData = {
    search: string;
    scholarshiptype_id?: number;
    usercareer_id?: number;
    laboratory_id: number;
    sortColumn: string;
    sortDirection: "ASC" | "DESC";
    page: number;
    rowsPerPage: number;
};

export type fetchScholarQuery = {
    search: string;
    scholarshiptype_id: number;
    usercareer_id: number;
    laboratory_id: number;
    sortColumn: string;
    sortDirection: "ASC" | "DESC";
    page: number;
    rowsPerPage: number;
};

export type fetchedScholar = {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    dropped_at?: Date;
    userstatus: string;
    file: string;
    dni: string;
    address?: string;
    phone?: string;
    careerlevel: number;
    usercareer_id: number;
    usercareer: string;
    scholarshiptype_id: number;
    scholarshiptype: string;
};

export type deleteModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type Scholar = userSchema & {
    dni: string;
    file: string;
    phone?: string;
    address?: string;
    careerlevel: number;
    usercareer_id: number;
    scholarshiptype_id: number;
};

export type fetchedProjectPageScholar = {
    id: number;
    name: string;
    file: number;
    email: string;
};

export type projectScholarTableProps = {
    id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type projectScholarFormData = {
    modalOpenCreate: boolean;
    modalOpenDelete: boolean;
    selectedRowId: number | '';
    selectedRowName: string;
    expandedRowId: number | null;
};

export type addScholarModalProps = {
    open: boolean;
    handleClose: () => void;
    laboratory_id: number;
    project_id: number;
    scholar_ids: number[];
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type addScholarFormData = {
    scholars: { scholar_id: number }[];
};

export type addScholarData = {
    scholars: { scholar_id: number }[];
    project_id: number;
};

export type addScholarQuery = addScholarData;

export type removeScholarModalProps = {
    open: boolean;
    handleClose: () => void;
    scholarname: string;
    project_id: number;
    scholar_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type removeScholarData =  {
    project_id: number;
    scholar_id: number; 
};

export type removeScholarQuery = removeScholarData;