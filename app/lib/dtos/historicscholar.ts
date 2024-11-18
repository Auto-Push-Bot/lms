export type fetchedHistoricScholar = {
    id: number;
    name: string;
    email?: string;
    dni?: string;
    file?: string;
    phone?: string;
    careerlevel?: number;
    historicusercareer_id: number;
    historicusercareername: string;
    historicscholarshiptype_id: number;
    historicscholarshiptypename: string;
};

export type newHistoricScholarQuery = {
    name: string;
    email?: string;
    dni?: string;
    file?: string;
    phone?: string;
    careerlevel?: number;
    historicusercareer_id?: number;
    historicscholarshiptype_id?: number;
};