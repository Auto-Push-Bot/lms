export type laboratory = {
    id: number;
    name: string;
};

export type createFormData = {
    name: string;
};

export type createLabData = createFormData;

export type createLabQuery = createLabData;

export type createModalProps = {
    open: boolean;
    handleClose: () => void;
};