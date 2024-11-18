"use client"

import React, { useState } from 'react';
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
import { createFormData, createLabData, createModalProps } from '@/app/lib/dtos/laboratory';
import { createLaboratory } from '@/app/services/register/register.service';
import CircularProgress from '@mui/material/CircularProgress';

interface APIError {
    name?: string
};

export default function CreateLaboratoryModal({ open, handleClose }: createModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<createFormData>();
    const [apiError, setApiError] = useState<APIError>({});
    const mutation = useMutation({
        mutationFn: (data: createLabData) => createLaboratory(data),
        onSuccess: (result) => {
            if (result && result.success) {
                handleClose();
                reset();
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                };
            };
        },
        onError: (error: APIError) => {
            setApiError({ name: error.name });
        }
    });
    const onSubmit: SubmitHandler<createFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
        });
    };
    const handleExit = () => {
        handleClose();
        setApiError({});
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
                        Crear nuevo Laboratorio
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <TextField
                            id="name"
                            label="Nombre *"
                            type="text"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            {...register("name", { 
                                    required: "Este campo es requerido" 
                                }
                            )}
                            error={!!errors.name || !!apiError.name}
                            helperText={errors.name ? errors.name.message : apiError.name ? apiError.name : "Nombre de Nuevo Laboratorio (siglas)"}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row m-4 hidden md:block'>
                        <div className='flex flex-row gap-4'>
                            <Button variant="contained" size="large" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                            <Button 
                                variant="contained" 
                                size="large" 
                                color="success" 
                                disableElevation 
                                endIcon={mutation.isPending ? <CircularProgress color="warning" size={26}/> : <SaveIcon />} 
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                GUARDAR
                            </Button>
                        </div>
                    </div>
                    <div className='flex flex-row m-3 block md:hidden'>
                        <div className='flex flex-row justify-center gap-1'>
                            <Button variant="contained" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                            <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26}/> : <SaveIcon />} type="submit" disabled={mutation.isPending}>GUARDAR</Button>
                        </div>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};