import { UseFormSetValue } from "react-hook-form";
import { fetchedHistoricScholar, newHistoricScholarQuery } from "./historicscholar";
import { projectStatus } from "./projectstatus";
import { projectType } from "./projecttype";
import { scholarshipType } from "./scholarshiptype";
import { userCareer } from "./usercareer";

export type historicTableProps = {
    historicusercareers: userCareer[];
    historicscholarships: scholarshipType[];
    historicprojecttypes: projectType[];
    historicprojectstatus: projectStatus[];
    laboratory_id: number;
};

export type historicFormData = {
    //filters
    filterAnchor: any;
    filterMenuOpen: boolean;
    activeFilters: { [key: string ]: any }
    showProjectSearchForm: boolean;
    projectSearch: string;
    normalProjectSearch: string;
    projectTypeFilter: number;
    showProjectTypeFilter: boolean;
    projectStatusFilter: number;
    showProjectStatusFilter: boolean;
    yearFilter: number;
    showYearFilter: boolean;
    showScholarSearchForm: boolean;
    scholarSearch: string;
    normalScholarSearch: string;
    showScholarshipTypeFilter: boolean;
    scholarshipTypeFilter: number;
    userCareerFilter: number;
    showUserCareerFilter: boolean;    
    //pagination
    page: number;
    rowsPerPage: number;
    //modals
    modalOpenCreate: boolean;
    //expanded row
    expandedRowId: null | number;
    //sort by column
    sortDirection: 'ASC' | 'DESC';
    sortColumn: string;
};

export type fetchHistoricProjectData = {
    projectSearch: string;
    historicprojectstatus_id: number;
    historicprojecttype_id: number;
    year: number;
    scholarSearch: string;
    historicusercareer_id: number;
    historicscholarshiptype_id: number;
    laboratory_id: number;
    sortColumn: string,
    sortDirection: 'ASC' | 'DESC';
    page: number;
    rowsPerPage: number;
};

export type fetchHistoricProjectQuery = fetchHistoricProjectData;

export type fetchedHistoricProject = {
    id: number;
    name: string;
    description: string;
    year: number;
    historicprojecttype_id: number;
    historicprojecttypename: string;
    historicprojectstatus_id: number;
    historicprojectstatusname: string;
    historicscholars: fetchedHistoricScholar[];
};

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
    historicusercareers: userCareer[];
    historicscholarships: scholarshipType[];
    historicprojecttypes: projectType[];
    historicprojectstatus: projectStatus[];
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    year: number;
    projectstatus: number;
    projecttype: number;
    scholars: newHistoricScholarQuery[];
    name: string;
    description: string;
};

export type newHistoricProjectData = newHistoricProjectQuery;

export type newHistoricProjectQuery = {
    name: string;
    description: string;
    year: number;
    projectstatus_id: number;
    projecttype_id: number;
    laboratory_id: number;
    scholars: newHistoricScholarQuery[];
};