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
import { CircularProgress, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createFormData, createModalProps, newSupplyData } from '@/app/lib/dtos/supply';
import { useMutation } from '@tanstack/react-query';
import { createTableData } from '@/app/services/inventory/inventory.service';

export default function CreateSupplyModal({ open, handleClose, supplytypes, supplystatuses, laboratory_id, setValueFeedback }: createModalProps) {
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<createFormData>({
        defaultValues: {
            year: 0,
            supplytype_id: 0,
            supplystatus_id: 0,
        }
    });
    const mutation = useMutation({
        mutationFn: (data: newSupplyData) => createTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Insumo creado correctamente`);
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
    const onSubmit: SubmitHandler<createFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            description: data.description,
            year: data.year,
            supplystatus_id: data.supplystatus_id,
            supplytype_id: data.supplytype_id,
            laboratory_id: laboratory_id,
        });
    };
    //year select values
    const añoInicio = 2008;
    const añoFinal = new Date().getFullYear();
    const años = Array.from({ length: añoFinal - añoInicio + 1 }, (_, index) => añoInicio + index)
    //
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
                        Crear nuevo Insumo
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <div className='md:flex md:gap-4 w-full'>                    
                            <div className='flex w-full mb-4 md:mb-0 md:w-4/6'>
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
                            <div className='flex w-full md:w-2/6'>
                                <TextField 
                                    id="year"  
                                    label="Año *" 
                                    type="text" 
                                    variant="outlined" 
                                    color="warning" 
                                    select 
                                    fullWidth 
                                    value={watch("year")}
                                    {...register("year", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.year}
                                    helperText={errors.year ? errors.year.message : "Seleccionar Año"}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                    overflowY: 'auto',
                                                },
                                            },
                                        },
                                    }}
                                >
                                {años.map((año) => (
                                    <MenuItem key={año} value={año}>
                                        {año}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </div>
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
                                    id="supplytype_id" 
                                    label="Tipo *" 
                                    type="text"
                                    variant="outlined" 
                                    color="warning" 
                                    select 
                                    fullWidth 
                                    value={watch("supplytype_id")} 
                                    {...register("supplytype_id", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.supplytype_id}
                                    helperText={errors.supplytype_id ? errors.supplytype_id.message : "Selecciona el Tipo de Insumo"}
                                >
                                    {supplytypes.map(type => (
                                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className='flex w-full mb-4 md:mb-0 md:w-3/6'>
                                <TextField 
                                    id="supplystatus_id" 
                                    label="Estado *" 
                                    type="text" 
                                    variant="outlined" 
                                    color="warning" 
                                    select 
                                    fullWidth 
                                    value={watch("supplystatus_id")} 
                                    {...register("supplystatus_id", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.supplystatus_id}
                                    helperText={errors.supplystatus_id ? errors.supplystatus_id.message : "Selecciona el Estado de Insumo"}
                                > 
                                    {supplystatuses.map(status => (
                                        <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
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