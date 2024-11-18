"use client"

import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { CircularProgress, MenuItem } from '@mui/material';
import { editFormData, editModalProps, editSupplyData } from '@/app/lib/dtos/supply';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { editTableData } from '@/app/services/inventory/inventory.service';

export default function EditSupplyModal({ open, handleClose, supplytypes, supplystatuses, row, setValueFeedback }: editModalProps) {
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<editFormData>({
        defaultValues: {
            name: row?.name,
            description: row?.description,
            year: row?.year,
            supplystatus_id: row?.supplystatus_id,
            supplytype_id: row?.supplytype_id
        },
    });
    const mutation = useMutation({
        mutationFn: (data: editSupplyData) => editTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Insumo editado correctamente`);
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
    const onSubmit: SubmitHandler<editFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            description: data.description,
            year: data.year,
            supplystatus_id: data.supplystatus_id,
            supplytype_id: data.supplytype_id,
            id: row.id,
        });
    };
    const handleExit = () => {
        handleClose();
        reset();
    };
    //year values
    const añoInicio = 2008;
    const añoFinal = 2034;
    const años = Array.from({ length: añoFinal - añoInicio + 1 }, (_, index) => añoInicio + index);
    //
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    //initial values
        
    useEffect(() => {
        reset({
            name: row?.name,
            description: row?.description,
            supplystatus_id: row?.supplystatus_id,
            supplytype_id: row?.supplytype_id,
            year: row?.year
        });
    }, [row, reset]);
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
                        Editar Insumo con ID {row?.id}: {row?.name}
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
                                    {...register("year", { required: "Este campo es requerido" })}
                                    error={!!errors.year}
                                    helperText={errors.year ? errors.year.message : "Seleccione Año"}
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
                                    {...register("supplytype_id", { required: "Este campo es requerido" })}
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
                                    {...register("supplystatus_id", { required: "Este campo es requerido" })}
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