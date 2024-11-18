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
import { SubmitHandler, useForm } from 'react-hook-form';
import { editTableData } from '@/app/services/admin/paramsmanagement/abm.service';
import { useMutation } from '@tanstack/react-query';
import { editABMQuery, editFormData, editModalProps } from '@/app/lib/dtos/abm';
import CircularProgress from '@mui/material/CircularProgress';

interface APIError {
    name?: string
};

export default function EditModal({ open, handleClose, table, id, name, setValueFeedback}: editModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<editFormData>({
        defaultValues: {
            name: name
        },
    });
    const [apiError, setApiError] = useState<APIError>({});
    const mutation = useMutation({
        mutationFn: (data: editABMQuery) => editTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `${(() => {
                    switch (table) {
                        case "supplytype":
                            return "Tipo de Insumo creado";
                        case "projecttype":
                            return "Tipo de Proyecto creado";
                        case "supplystatus":
                            return "Estado de Insumo creado";
                        case "projectstatus":
                            return "Estado de Proyecto creado";
                        case "scholarshiptype":
                            return "Tipo de Beca creado";
                        case "grade":
                            return "Calificación creada";
                        case "usercareer":
                            return "Carrera creada";
                        default:
                            return "";
                    }
                })()} correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                handleExit();
                reset();
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                };
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            handleExit();
            reset();
        },
    });
    const onSubmit: SubmitHandler<editFormData> = (data) => {
        mutation.mutate({ 
            name: data.name, 
            id, table 
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
    useEffect(() => {
        reset({
            name: name
        });
    }, [name, reset]);
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
                            Editar  
                            {(() => {
                                switch (table) {
                                    case "supplytype":
                                        return " Tipo de Insumo ";
                                    case "projecttype":
                                        return " Tipo de Proyecto ";
                                    case "supplystatus":
                                        return " Estado de Insumo ";
                                    case "projectstatus":
                                        return " Estado de Proyecto ";
                                    case "scholarshiptype":
                                        return " Tipo de Beca ";
                                    case "grade":
                                        return " Calificación ";
                                    case "usercareer":
                                        return " Carrera ";
                                    default:
                                        return "";
                                }
                            })()}
                            con ID {id}: {name}
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
                                {...register("name", { required: "Este campo es requerido" })}
                                error={!!errors.name || !!apiError.name}
                                helperText={errors.name ? errors.name.message : apiError.name ? apiError.name : "Nombre de Nuevo Elemento"}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-row m-3'>
                            <div className='flex flex-row justify-center gap-4'>
                                <Button variant="contained"  color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                                <Button variant="contained"  color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26}/> : <SaveIcon />} type="submit" disabled={mutation.isPending}>GUARDAR</Button>
                            </div>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
    );
};