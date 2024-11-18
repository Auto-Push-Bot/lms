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
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from '@mui/material/CircularProgress';
import { createTaskObservationData, createTaskObservationFormData, createTaskObservationModalProps } from '@/app/lib/dtos/observation';
import { createTaskObservation } from '@/app/services/projects/projects.service';

export default function CreateObservationModal({ open, handleClose, project_id, task_id, current_id, setValueFeedback }: createTaskObservationModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<createTaskObservationFormData>();
    const mutation = useMutation({
        mutationFn: (data: createTaskObservationData) => createTaskObservation(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Observación creada correctamente`);
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
    const onSubmit: SubmitHandler<createTaskObservationFormData> = (data) => {
        mutation.mutate({ 
            content: data.content,
            project_id: project_id,
            task_id: task_id,
            current_id: current_id
        });
    };
    const handleExit = () => {
        handleClose();
        reset();
    };
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
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
                elevation: 0,
                    style: { width: '600px', maxWidth: 'none' }
            }}
        >
            <div className='flex flex-col m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Nueva Observación
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <TextField
                            id="content"
                            label="Observación *"
                            type="text"
                            variant="outlined"
                            color="warning"
                            multiline 
                            rows={4} 
                            fullWidth
                            {...register("content", { 
                                    required: "Este campo es requerido",
                                    maxLength: {
                                        value: 255, 
                                        message: "Máximo 255 caracteres"
                                    },
                                }
                            )}
                            error={!!errors.content }
                            helperText={errors.content ? errors.content.message : "Observación"}
                        />
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