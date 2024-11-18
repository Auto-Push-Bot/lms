"use client"

import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { createProjectTaskData, newProjectTaskFormData, newProjectTaskModalProps } from '@/app/lib/dtos/task';
import { createProjectTask } from '@/app/services/projects/projects.service';

dayjs.locale('es');
dayjs.extend(localizedFormat);

export default function CreateTaskModal({ open, handleClose, project_id, start_date_new, setValueFeedback }: newProjectTaskModalProps) {
    let startDate = null as Dayjs | null;
    const { register, handleSubmit, reset, formState: { errors }, setValue, setError, clearErrors, watch } = useForm<newProjectTaskFormData>({
        defaultValues: {
            start: startDate ? startDate : null
        }
    });
    const mutation = useMutation({
        mutationFn: (data: createProjectTaskData) => createProjectTask(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Tarea creada correctamente`);
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
    const onSubmit: SubmitHandler<newProjectTaskFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            description: data.description,
            start: data.start,
            end: data.end,
            project_id: project_id
        });
    };
    const handleExit = () => {
        handleClose();
        reset();
    };
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    useEffect(() => {
        if (start_date_new) {
            reset({
                start: dayjs(start_date_new)
            })
        };
    }, [start_date_new]);
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
                elevation: 0,
                    style: { width: '600px', maxWidth: 'none' }
            }}
        >
            <div className='flex flex-col m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Nueva Tarea
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <div className='flex w-full'>
                            <TextField
                                id="name"
                                label="Nombre de Tarea *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register('name', { 
                                        required: "Este campo es requerido",
                                        maxLength: {
                                            value: 50, 
                                            message: "Máximo 50 caracteres"
                                        },
                                    }
                                )}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : 'Ingrese Nombre de Tarea'}
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
                                    }
                                )}
                                error={!!errors.description }
                                helperText={errors.description ? errors.description.message : "Descripción"}
                            />
                        </div>
                        <div className='flex flex-col md:flex-row w-full gap-4'>
                            <div className='flex md:w-[50%]'>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Fecha de Inicio *"
                                    value={watch('start')}
                                    onChange={(newValue) => {
                                        if (!newValue) {
                                            setError('start', {
                                                type: 'manual',
                                                message: 'Este campo es requerido',
                                            });
                                        } else {
                                            clearErrors('start');
                                            const endValue = watch('end');
                                            if (endValue && newValue.isAfter(endValue)) {
                                                setError('start', {
                                                    type: 'manual',
                                                    message: 'Combinación de fechas no valida',
                                                });
                                            } else {
                                                clearErrors('start');
                                            }
                                        }
                                        setValue('start', newValue, { shouldValidate: true });
                                    }}
                                    slotProps={{
                                        textField: {
                                            id: "start",
                                            helperText: errors.start ? errors.start.message : 'Ingrese Fecha de Inicio',
                                            error: !!errors.start,
                                            fullWidth: true,
                                            variant: "outlined",
                                            color: "warning"
                                        }
                                    }}
                                />
                                </LocalizationProvider>
                            </div>
                            <div className='flex md:w-[50%]'>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Fecha de Fin *"
                                    value={watch('end')}
                                    onChange={(newValue) => {
                                        if (!newValue) {
                                            setError('end', {
                                                type: 'manual',
                                                message: 'Este campo es requerido',
                                            });
                                        } else {
                                            clearErrors('end');
                                            const startValue = watch('start');
                                            if (startValue && newValue.isBefore(startValue)) {
                                                setError('end', {
                                                    type: 'manual',
                                                    message: 'Combinación de fechas no valida',
                                                });
                                            } else {
                                                clearErrors('end');
                                            }
                                        }
                                        setValue('end', newValue, { shouldValidate: true });
                                    }}
                                    slotProps={{
                                        textField: {
                                            id: "end",
                                            helperText: errors.end ? errors.end.message : 'Ingrese Fecha de Fin',
                                            error: !!errors.end,
                                            fullWidth: true,
                                            variant: "outlined",
                                            color: "warning"
                                        }
                                    }}
                                />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row m-3'>
                        <div className='flex flex-row justify-center gap-4'>
                            <Button variant="contained" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                            <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26}/> : <SaveIcon />} type="submit" disabled={mutation.isPending}>GUARDAR</Button>
                        </div>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};