"use client"

import { editFormData, editFormProps, editProjectData } from "@/app/lib/dtos/project";
import { editProject, fetchProjectForEditById, fetchProjectSelectData } from "@/app/services/projects/projects.service";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import HistoricModal from "./historicmodal";
import { Skeleton } from "@mui/material";
import GradeHistoricModal from "./gradehistorymodal";
import GradeModal from "./grademodal";

export default function EditProjectForm({ id, setValueFeedback }: editFormProps) {
    const { register, watch, handleSubmit, reset, formState: { errors }, setValue } = useForm<editFormData>({
        defaultValues: {
            name: "",
            description: "",
            projectstatus_id: '',
            projecttype_id: '',
            grade_date: null,
            grade_name: null,
            modalOpenHistoric: false,
            modalOpenGradeHistoric: false,
            modalOpenGrade: false
        },
    });
    //fetch select data
    const { data: selectData, isLoading: selectDataLoading } = useQuery({
        queryKey: ['fetchSelectData'],
        queryFn: () => fetchProjectSelectData(),
        refetchOnWindowFocus: false
    });
    //fetch project data
    const { data: projectData, isLoading: projectDataLoading, refetch: projectDataRefetch, isError } = useQuery({
        queryKey: ['fetchProjectForEditById', id],
        queryFn: () => fetchProjectForEditById(id),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
    useEffect(() => {
        if (projectData && selectData && !projectDataLoading && !selectDataLoading) {
            if (projectData.grade_date && projectData.grade_name) {
                reset({
                    name: projectData.name,
                    description: projectData.description,
                    projectstatus_id: projectData.projectstatus_id,
                    projecttype_id: projectData.projecttype_id,
                    grade_name: projectData.grade_name,
                    grade_date: projectData.grade_date
                });
            } else {
                reset({
                    name: projectData.name,
                    description: projectData.description,
                    projectstatus_id: projectData.projectstatus_id,
                    projecttype_id: projectData.projecttype_id,
                });
            };
        };
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [projectData, selectData, projectDataLoading, selectDataLoading, isError, reset]);
    //save
    const mutation = useMutation({
        mutationFn: (data: editProjectData) => editProject(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Proyecto editado correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                projectDataRefetch();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            projectDataRefetch();
        }
    });
    const onSubmit: SubmitHandler<editFormData> = (data) => {
        mutation.mutate({
            name: data.name,
            description: data.description,
            projecttype_id: data.projecttype_id as number,
            projectstatus_id: data.projectstatus_id as number,
            id: id,
        });
    };
    //historic
    const modalOpenHistoric = watch("modalOpenHistoric");
    const handleOpenHistoricModal = () => setValue("modalOpenHistoric", true);
    const handleCloseHistoricModal = () => setValue("modalOpenHistoric", false);
    //grade historic
    const modalOpenGradeHistoric = watch("modalOpenGradeHistoric");
    const handleOpenGradeHistoricModal = () => setValue("modalOpenGradeHistoric", true);
    const handleCloseGradeHistoricModal = () => setValue("modalOpenGradeHistoric", false);
    //grade
    const modalOpenGrade = watch("modalOpenGrade");
    const handleOpenGradeModal = () => setValue("modalOpenGrade", true);
    const handleCloseGradeModal = () => {
        setValue("modalOpenGrade", false);
        projectDataRefetch();
    };
    //grade stuff
    const grade_date = watch("grade_date");
    const grade_name = watch("grade_name");
    return (
        <div className="flex flex-col w-full h-full gap-2">
            <div className="flex flex-row gap-4">
                <div className='flex text-gray-700 items-center justify-center font-bold text-xl md:text-2xl mb-2'>
                    Información
                </div>
                <div className="flex grow" />
                <div className="flex mr-2">
                    <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26} /> : <SaveIcon />} type="submit" disabled={mutation.isPending || isError || projectDataLoading}>GUARDAR</Button>
                </div>
            </div>
            {projectDataLoading ? (
                <div className='flex flex-col flex-grow w-full h-full gap-4 py-2 pr-2'>
                    <Skeleton variant="rectangular" height="21rem" width="100%" className="rounded" />
                </div>
            ) : (
                <form className='flex flex-grow flex-col w-full h-full gap-4 py-2 pr-2 overflow-y-auto custom-scrollbar' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex w-full'>
                        <TextField
                            id="name"
                            label={errors.name ? errors.name.message : "Nombre de Proyecto"}
                            type="text"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            value={watch("name")}
                            {...register("name", { required: "Este campo es requerido" })}
                            error={!!errors.name}
                        />
                    </div>
                    <div className='flex w-full'>
                        <TextField
                            id="description"
                            label={errors.description ? errors.description.message : "Descripción de Proyecto"}
                            type="text"
                            variant="outlined"
                            color="warning"
                            multiline
                            rows={4}
                            fullWidth
                            value={watch("description")}
                            {...register("description", {
                                required: "Este campo es requerido",
                                maxLength: {
                                    value: 255,
                                    message: "Máximo 255 caracteres"
                                },
                            })}
                            error={!!errors.description}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row md:gap-4 w-full'>
                        <div className='flex w-full mb-4 md:mb-0'>
                            <TextField
                                id="projecttype_id"
                                label={errors.projecttype_id ? errors.projecttype_id.message : selectDataLoading ? "Cargando Tipos" : "Tipo de Proyecto"}
                                type="text"
                                variant="outlined"
                                color="warning"
                                select
                                fullWidth
                                value={watch("projecttype_id")}
                                {...register("projecttype_id", { required: "Este campo es requerido" })}
                                error={!!errors.projecttype_id}
                                disabled={selectDataLoading}
                            >
                                {selectDataLoading && <MenuItem value=''></MenuItem>}
                                {selectData && selectData.projecttypes && selectData.projecttypes.length > 0 && selectData.projecttypes.map((type: any) => (
                                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="projectstatus_id"
                                label={errors.projectstatus_id ? errors.projectstatus_id.message : selectDataLoading ? "Cargando Estados" : "Estado de Proyecto"}
                                type="text"
                                variant="outlined"
                                color="warning"
                                select
                                fullWidth
                                value={watch("projectstatus_id")}
                                {...register("projectstatus_id", { required: "Este campo es requerido" })}
                                error={!!errors.projectstatus_id}
                                disabled={selectDataLoading}
                            >
                                {selectDataLoading && <MenuItem value=''></MenuItem>}
                                {selectData && selectData.projectstatuses && selectData.projectstatuses.length > 0 && selectData.projectstatuses.map((status: any) => (
                                    <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row md:gap-4 w-full'>
                        <div className='flex w-full mb-4 md:mb-0'>
                            <TextField
                                id="grade_date"
                                label="Última vez calificado"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                value={grade_date
                                    ? new Date(grade_date).toLocaleDateString('es-AR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : "Sin calificar"}
                                InputProps={{
                                    readOnly: true,
                                    style: { userSelect: "none", pointerEvents: "none" }
                                }}
                            />
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="grade_name"
                                label="Última calificación"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                value={grade_name !== null && grade_name !== undefined ? grade_name : "Sin calificar"}
                                InputProps={{
                                    readOnly: true,
                                    style: { userSelect: "none", pointerEvents: "none" }
                                }}
                            />
                        </div>
                    </div>
                </form>
            )}
            <div className="flex flex-col md:flex-row md:justify-between w-full gap-4">
                <div className="flex w-full">
                    <Button variant="contained" color="warning" disableElevation fullWidth onClick={handleOpenGradeHistoricModal} disabled={mutation.isPending || isError || projectDataLoading}>CALIFICACIONES</Button>
                </div>
                <div className="flex w-full">
                    <Button variant="contained" color="success" disableElevation fullWidth onClick={handleOpenGradeModal} disabled={mutation.isPending || isError || projectDataLoading}>CALIFICAR</Button>
                </div>
                <div className="flex w-full mr-2">
                    <Button variant="contained" color="error" disableElevation fullWidth onClick={handleOpenHistoricModal} disabled={mutation.isPending || isError || projectDataLoading}>PASAR A HISTORICO</Button>
                </div>
            </div>
            {projectData && !isError &&
                <HistoricModal
                    open={modalOpenHistoric}
                    handleClose={handleCloseHistoricModal}
                    id={id}
                    name={projectData.name}
                    setValueFeedback={setValueFeedback}
                />
            }
            <GradeHistoricModal
                open={modalOpenGradeHistoric}
                handleClose={handleCloseGradeHistoricModal}
                id={id}
                setValueFeedback={setValueFeedback}
            />
            <GradeModal
                open={modalOpenGrade}
                handleClose={handleCloseGradeModal}
                id={id}
                setValueFeedback={setValueFeedback}
            />
        </div>
    );
};