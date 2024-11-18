export type grade = {
    id: number;
    name: string;
};

export type gradeProjectFormData = {
    grade_id: number;
};

export type gradeProjectData = {
    grade_id: number;
    project_id: number;
};

export type gradeProjectQuery = gradeProjectData;