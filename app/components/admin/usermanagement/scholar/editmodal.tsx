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
import { CircularProgress, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { editTableData } from '@/app/services/admin/usermanagement/scholar.service';
import { editFormData, editModalProps, editScholarData } from '@/app/lib/dtos/scholar';

interface APIErrors {
    dni?: string,
    file?: string,
    email?: string,
};

export default function EditScholarModal({ open, handleClose, row, usercareers, scholarships, setValueFeedback }: editModalProps) {
    const { watch, register, handleSubmit, reset, formState: { errors } } = useForm<editFormData>({
        defaultValues: {
            name: row?.name,
            file: row?.file,
            dni: row?.dni,
            address: row?.address,
            phone: row?.phone,
            careerlevel: row?.careerlevel,
            usercareer_id: row?.usercareer_id,
            scholarshiptype_id: row?.scholarshiptype_id,
        },
    });
    const [apiError, setApiError] = useState<APIErrors>({});
    const mutation = useMutation({
        mutationFn: (data: editScholarData) => editTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Becario editado correctamente`);
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
        }
    });
    const onSubmit: SubmitHandler<editFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            file: data.file,
            dni: data.dni,
            careerlevel: data.careerlevel,
            usercareer_id: data.usercareer_id,
            scholarshiptype_id: data.scholarshiptype_id,
            address: data.address,
            phone: data.phone,
            id: row.id
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
            name: row?.name,
            file: row?.file,
            dni: row?.dni,
            address: row?.address,
            phone: row?.phone,
            careerlevel: row?.careerlevel,
            usercareer_id: row?.usercareer_id,
            scholarshiptype_id: row?.scholarshiptype_id,
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
                            Editar Becario con ID {row?.id}: {row?.name}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                    <div className='flex flex-col w-full items-center justify-center pt-4 gap-4'>
                        <div className='flex w-full'>
                            <TextField
                                id="name"
                                label="Nombre y Apellido *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("name", { required: "Este campo es requerido" })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : "Ingrese Nombre y Apellido"}
                            />
                        </div>
                        <div className='md:flex md:gap-4 w-full'>
                            <div className='flex w-full mb-4 md:mb-0 md:w-4/5'>
                                <TextField
                                    id="dni"
                                    label="DNI *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    fullWidth
                                    {...register("dni", { required: "Este campo es requerido" })}
                                    error={!!errors.dni || !!apiError.dni}
                                    helperText={errors.dni ? errors.dni.message : apiError.dni ? apiError.dni : "Ingrese DNI"}
                                />
                            </div>                    
                            <div className='flex w-full md:w-2/6'>
                                <TextField
                                    id="file"
                                    label="Legajo *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    fullWidth
                                    {...register("file", { required: "Este campo es requerido" })}
                                    error={!!errors.file || !!apiError.file}
                                    helperText={errors.file ? errors.file.message : apiError.file ? apiError.file : "Ingrese Legajo"}
                                />
                            </div>
                        </div>
                        <div className='md:flex md:gap-4 w-full'>
                            <div className='flex w-full mb-4 md:mb-0 md:w-4/5'>
                                <TextField
                                    id="usercareer_id"
                                    label="Carrera *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    select
                                    fullWidth
                                    value={watch("usercareer_id")}
                                    {...register("usercareer_id", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.usercareer_id}
                                    helperText={errors.usercareer_id ? errors.usercareer_id.message : "Seleccionar Carrera"}
                                >
                                    {usercareers.map(usercareer => (
                                        <MenuItem key={usercareer.id} value={usercareer.id}>{usercareer.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className='flex w-full md:w-2/6'>
                                <TextField
                                    id="careerlevel"
                                    label="Año *"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    select
                                    fullWidth
                                    value={watch("careerlevel")}
                                    {...register("careerlevel", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.careerlevel}
                                    helperText={errors.careerlevel ? errors.careerlevel.message : "Año de Cursado"}
                                >
                                    <MenuItem key={1} value={1}>Primero</MenuItem>
                                    <MenuItem key={2} value={2}>Segundo</MenuItem>
                                    <MenuItem key={3} value={3}>Tercero</MenuItem>
                                    <MenuItem key={4} value={4}>Cuarto</MenuItem>
                                    <MenuItem key={5} value={5}>Quinto</MenuItem>
                                    <MenuItem key={6} value={6}>Sexto</MenuItem>
                                </TextField>
                            </div>
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="scholarshiptype_id"
                                label="Beca *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                select
                                fullWidth
                                value={watch("scholarshiptype_id")}
                                {...register("scholarshiptype_id", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                error={!!errors.scholarshiptype_id}
                                helperText={errors.scholarshiptype_id ? errors.scholarshiptype_id.message : "Selecciona la Beca Correspondiente"}
                            >
                                {scholarships.map(scholarship => (
                                    <MenuItem key={scholarship.id} value={scholarship.id}>{scholarship.name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="address"
                                label="Dirección *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("address", { required: "Este campo es requerido" })}
                                error={!!errors.address}
                                helperText={errors.address ? errors.address.message : "Ingrese Dirección"}
                            />
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="phone"
                                label="Teléfono *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("phone", { required: "Este campo es requerido" })}
                                error={!!errors.phone}
                                helperText={errors.phone ? errors.phone.message : "Ingrese Teléfono"}
                            />
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