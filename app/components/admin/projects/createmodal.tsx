"use client"

import React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { CircularProgress, Divider, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import '@/app/components/globals.css';
import { createFormData, createModalProps, newProjectData } from '@/app/lib/dtos/project';
import { createProject, fetchLabScholars } from '@/app/services/projects/projects.service';

export default function CreateProjectModal({ open, handleClose, projecttypes, projectstatuses, laboratory_id, setValueFeedback }: createModalProps) {
    const { watch, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<createFormData>({
        defaultValues: {
            projectstatus: 0,
            projecttype: 0,
            scholars: [],
        },
    });
    const mutation = useMutation({
        mutationFn: (data: newProjectData) => createProject(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Proyecto creado correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                handleExit();
                reset();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            handleExit();
            reset();
        }
    });
    //scholars
    const scholars = watch("scholars");
    const handleScholarChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const newScholars = [...scholars];
        type ScholarField = 'scholar_id';
        const fieldName = name as ScholarField;
        if (fieldName === 'scholar_id') {
            newScholars[index][fieldName] = parseInt(value, 10) as any;
        };
        setValue("scholars", newScholars);
    };
    const handleAddScholar = () => {
        setValue("scholars", [
            ...scholars,
            {
                scholar_id: 0,
            },
        ]);
    };
    const handleRemoveScholar = (index: number) => {
        const newScholars = scholars.filter((_, i) => i !== index);
        setValue("scholars", newScholars);
    };
    //fetch scholars
    const { data: labscholars, isLoading } = useQuery({
        queryKey: ['fetchLabScholars'],
        queryFn: () => fetchLabScholars(laboratory_id),
        refetchOnWindowFocus: false
    });
    const onSubmit: SubmitHandler<createFormData> = (data) => {
        mutation.mutate({
            name: data.name,
            description: data.description,
            projectstatus_id: data.projectstatus,
            projecttype_id: data.projecttype,
            laboratory_id: laboratory_id,
            scholars: data.scholars
        });
    };
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    const handleExit = () => {
        handleClose();
        reset();
    };
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            maxWidth={false}
            fullWidth
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit(onSubmit),
                onClick: handleDialogClick,
                className: "custom-scrollbar",
                elevation: 0,
                style: { width: '600px', maxWidth: 'none', overflowY: 'auto' }
            }}
        >
            <div className='flex flex-col m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Añadir Proyecto
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <div className='flex w-full'>
                            <TextField
                                id="name"
                                label="Nombre *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("name", { required: "Este campo es requerido" })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : "Ingrese Nombre"}
                            />
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="description"
                                label="Descripción *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                multiline
                                rows={4}
                                fullWidth
                                {...register("description", {
                                    required: "Este campo es requerido",
                                    maxLength: {
                                        value: 255,
                                        message: "Máximo 255 caracteres"
                                    },
                                })}
                                error={!!errors.description}
                                helperText={errors.description ? errors.description.message : "Ingrese Descripción"}
                            />
                        </div>
                        <div className='md:flex md:gap-4 w-full'>
                            <div className='flex w-full mb-4 md:mb-0 md:w-3/6'>
                                <TextField
                                    id="projecttype"
                                    label="Tipo *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    select
                                    fullWidth
                                    value={watch("projecttype")}
                                    {...register("projecttype", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.projecttype}
                                    helperText={errors.projecttype ? errors.projecttype.message : "Seleccionar Tipo de Proyecto"}
                                >
                                    {projecttypes.map((type: any) => (
                                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className='flex w-full md:w-3/6'>
                                <TextField
                                    id="projectstatus"
                                    label="Estado *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    select
                                    fullWidth
                                    value={watch("projectstatus")}
                                    {...register("projectstatus", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.projectstatus}
                                    helperText={errors.projectstatus ? errors.projectstatus.message : "Seleccionar Estado de Proyecto"}
                                >
                                    {projectstatuses.map((status: any) => (
                                        <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
                        <Divider className="w-full"></Divider>
                        <div className='flex flex-row w-full'>
                            <div className='text-gray-700 items-center font-medium text-xl md:text-2xl mb-2'>
                                Becarios
                            </div>
                            <div className='flex grow' />
                            <Button variant="contained" color="warning" disableElevation onClick={handleAddScholar}>Añadir Becario</Button>
                        </div>
                        <Divider className="w-full"></Divider>
                        {scholars.map((scholar, index) => {
                            const selectedScholarIds = scholars.map((s) => s.scholar_id);
                            return (
                                <div key={index} className='flex flex-col w-full md:gap-4'>
                                    <div className='flex w-full'>
                                        <TextField
                                            id="scholar_id"
                                            label="Becario"
                                            type="text"
                                            variant="outlined"
                                            color="warning"
                                            select
                                            fullWidth
                                            value={scholar.scholar_id}
                                            {...register(`scholars.${index}.scholar_id`, {
                                                required: "Este campo es requerido",
                                                onChange: (event) => handleScholarChange(index, event),
                                                validate: value => value !== 0 || "Este campo es requerido"
                                            })}
                                            error={!!errors.scholars?.[index]?.scholar_id}
                                            helperText={errors.scholars?.[index]?.scholar_id ? errors.scholars[index].scholar_id.message : isLoading ? "Cargando Becarios" : "Seleccionar Becario"}
                                            disabled={isLoading}
                                        >
                                            {labscholars && labscholars.length > 0 && labscholars
                                                .filter((labScholar: any) => !scholars.some((selectedScholar: any, i) => selectedScholar.scholar_id === labScholar.id && i !== index))
                                                .map((scholar: any) => (
                                                    <MenuItem key={scholar.id} value={scholar.id}>{scholar.name}</MenuItem>
                                                ))}
                                        </TextField>
                                    </div>
                                    <div className='flex flex-row justify-end items-end md:mt-0 md:mb-0 mt-2 mb-2'>
                                        <div className='flex flex-row gap-4'>
                                            <Button variant="contained" color="error" disableElevation onClick={() => handleRemoveScholar(index)}>Eliminar Becario</Button>
                                        </div>
                                    </div>
                                    <Divider className="w-full"></Divider>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row m-3'>
                        <div className='flex flex-row justify-center gap-4'>
                            <Button variant="contained" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                            <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26} /> : <SaveIcon />} type="submit" disabled={mutation.isPending}>GUARDAR</Button>
                        </div>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};