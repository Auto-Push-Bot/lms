import { UseFormSetValue } from "react-hook-form";
import { projectStatus } from "./projectstatus";
import { projectType } from "./projecttype";
import { fetchedProjectPageScholar } from "./scholar";
import { scholarshipType } from "./scholarshiptype";
import { userCareer } from "./usercareer";

export type projectFormData = {
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
    //selected row
    selectedRowId: number;
    selectedRowName: string;
    //modals
    modalOpenCreate: boolean;
    modalOpenDelete: boolean;
};

export type scholarProjectFormData = {
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
    //pagination
    page: number;
    rowsPerPage: number;
};

export type projectsTableProps = {
    usercareers: userCareer[];
    scholarships: scholarshipType[];
    projecttypes: projectType[];
    projectstatuses: projectStatus[];
    laboratory_id: number;
};

export type scholarProjectsTableProps = {
    projecttypes: projectType[];
    projectstatuses: projectStatus[];
    laboratory_id: number;
    current_id: number;
};

export type fetchTableProjectsData = {
    projectSearch: string;
    projectstatus_id: number;
    projecttype_id: number;
    scholarSearch: string;
    usercareer_id: number;
    scholarshiptype_id: number;
    laboratory_id: number;
    page: number;
    rowsPerPage: number;
};

export type fetchScholarTableProjectsData = {
    projectSearch: string;
    projectstatus_id: number;
    projecttype_id: number;
    laboratory_id: number;
    page: number;
    rowsPerPage: number;
    current_id: number;
};

export type getScholarTableProjectsQuery = fetchScholarTableProjectsData;

export type getTableProjectsQuery = fetchTableProjectsData;

export type fetchedTableProject = {
    id: number;
    name: string;
    description: string;
    projecttaskcount: number;
    completedprojecttaskcount: number;
    projecttypename: string;
    projectstatusname: string;
    newobservations: number;
};

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
    projecttypes: projectType[];
    projectstatuses: projectStatus[];
    laboratory_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    name: string;
    description: string;
    projectstatus: number;
    projecttype: number;
    scholars: { scholar_id: number }[];
};

export type newProjectData = {
    name: string;
    description: string;
    projectstatus_id: number;
    projecttype_id: number;
    laboratory_id: number;
    scholars: { scholar_id: number }[];
};

export type newProjectQuery = newProjectData;

export type fetchedPageProject = {
    id: number;
    name: string;
    description: string;
    projecttype_id: number;
    projectstatus_id: number;
    laboratory_id: number;
    scholars: fetchedProjectPageScholar[];
};

export type fetchedProjectForEdit = {
    name: string;
    description: string;
    projecttype_id: number;
    projectstatus_id: number;
    grade_date: Date | null;
    grade_name: string | null;
};

export type fethedProjectGrade = {
    date: Date;
    name: string;
};

export type fetchedProjectScholars = {
    laboratory_id: number;
    scholars: fetchedProjectPageScholar[];
};

export type editProjectParams = {
    id: number;
    name: string;
    description: string;
    projecttype_id: number;
    projectstatus_id: number;
};

export type editFormProps = {
    id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type editFormData = {
    name: string;
    description: string;
    projectstatus_id: number | '';
    projecttype_id: number | '';
    grade_date: Date | null;
    grade_name: string | null;
    modalOpenHistoric: boolean;
    modalOpenGradeHistoric: boolean;
    modalOpenGrade: boolean;
};

export type editProjectData = {
    name: string;
    description: string;
    projectstatus_id: number;
    projecttype_id: number;
    id: number;
};

export type editProjectQuery = editProjectData;

export type deleteProjectData = {
    id: number;
};

export type historicModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type deleteModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type gradeHistoryModalProps = {
    open: boolean;
    handleClose: () => void;
    id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};