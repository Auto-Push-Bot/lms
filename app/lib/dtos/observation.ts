import { UseFormSetValue } from "react-hook-form";

export type fetchedObservations = {
    id: number;
    content: string;
    created_at: Date;
    author_name: string;
};

export type projectObservationTableProps = {
    id: number;
    current_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type projectObservationFormData = {
    loadMoreDisabled: boolean;
    observations: fetchedObservations[];
    modalOpenCreate: boolean;
    page: number;
};

export type newProjectObservationModalProps = {
    scholar_ids: number[];
    open: boolean;
    handleClose: () => void;
    project_id: number;
    current_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type newProjectObservationFormData = {
    content: string;
};

export type createProjectObservationData = {
    scholar_ids: number[];
    content: string;
    project_id: number;
    current_id: number;
};

export type newProjectObservationQuery = createProjectObservationData;

export type deleteObservationData = {
    id: number
};

export type  deleteObservationQuery = deleteObservationData;

export type taskObservationTableProps = {
    task_id: number;
    project_id: number;
    current_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type taskObservationFormData = projectObservationFormData;

export type createTaskObservationModalProps = {
    open: boolean;
    handleClose: () => void;
    project_id: number;
    task_id: number;
    current_id: number;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createTaskObservationFormData = {
    content: string;
};

export type createTaskObservationData = {
    content: string;
    project_id: number;
    task_id: number;
    current_id: number;
};

export type newTaskObservationQuery = createTaskObservationData;