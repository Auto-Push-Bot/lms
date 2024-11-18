import { UseFormSetValue } from "react-hook-form";

export type ABMTableProps = {
    table: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
    table: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type createFormData = {
    name: string;
};

export type createABMQuery = {
    name: string;
    table: string;
};

export type createABMItemQuery = {
    name: string;
};

export type editModalProps = {
    open: boolean;
    handleClose: () => void;
    table: string;
    id: number;
    name: string;
    setValueFeedback: UseFormSetValue<{ feedbackOpen: boolean, feedbackSeverity: 'success' | 'error', feedbackMessage: string }>
};

export type editFormData = {
    name: string;
};

export type editABMQuery = {
    name: string;
    id: number;
    table: string;
};

export type editABMItemQuery = {
    name: string;
    id: number;
};

export type fetchABMData = {
    search: string;
    table: string;
    page: number;
    rowsPerPage: number;
};

export type fetchABMQuery = {
    name: string;
    table: string;
    page: number;
    rowsPerPage: number;
};

export type fetchABMItemQuery = {
    name: string;
    page: number;
    rowsPerPage: number;
};

export type fetchedABMItem = {
    id: number;
    name: string;
};

export type checkExistanceQuery = {
    name: string;
    table: string;
};

export type checkItemExistanceQuery = {
    name: string;
};