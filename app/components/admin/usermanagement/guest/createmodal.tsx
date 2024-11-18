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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createTableData } from '@/app/services/admin/usermanagement/guest.service';
import { createFormData, createGuestData, createModalProps } from '@/app/lib/dtos/guest';
import CircularProgress from '@mui/material/CircularProgress';

dayjs.locale('es');
dayjs.extend(localizedFormat);

interface APIError {
    email?:string,
};

export default function CreateGuestModal({ open, handleClose, laboratory_id, setValueFeedback }: createModalProps) {
    const { watch, register, handleSubmit, reset, formState: { errors }, setValue, setError, clearErrors } = useForm<createFormData>({
        defaultValues: {
            name: '',
            email: '',
            expires_at: null,
            password: ''
        },
      });
    const [apiError, setApiError] = useState<APIError>({});
    const mutation = useMutation({
        mutationFn: (data: createGuestData) => createTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Invitado creado correctamente`);
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
    const onSubmit: SubmitHandler<createFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            email: data.email.toLowerCase(),
            expires_at: data.expires_at,
            password: data.password,
            laboratory_id: laboratory_id
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
    const isValidFutureDate = (value: Dayjs | null) => {
        return value && value.isValid() && value.isAfter(dayjs());
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
                        Crear nuevo Invitado
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
                                {...register('name', { required: "Este campo es requerido" })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : 'Ingrese Nombre y Apellido'}
                            />
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="email"
                                label="Email *"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("email", { 
                                    required: "Este campo es requerido",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Ingrese un email válido"
                                    }
                                 }
                                )}
                                error={!!errors.email || !!apiError.email}
                                helperText={errors.email ? errors.email.message : apiError.email ? apiError.email : "Ingrese Email"}
                            />
                        </div>
                        <div className='flex w-full'>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <DatePicker
                                label="Fecha de Vencimiento *"
                                value={watch('expires_at')}
                                onChange={(newValue) => {
                                    if (!newValue) {
                                        setError('expires_at', {
                                            type: 'manual',
                                            message: 'Este campo es requerido',
                                        });
                                    } else if (!isValidFutureDate(newValue)) {
                                        setError('expires_at', {
                                            type: 'manual',
                                            message: 'La fecha debe ser válida y futura',
                                        });
                                    } else {
                                        clearErrors('expires_at');
                                    }
                                    setValue('expires_at', newValue, { shouldValidate: true });
                                }}
                                slotProps={{
                                    textField: {
                                        id: "expires_at",
                                        helperText: errors.expires_at ? errors.expires_at.message : 'Ingrese Fecha de Vencimiento',
                                        error: !!errors.expires_at,
                                        fullWidth: true,
                                        variant: "outlined",
                                        color: "warning"
                                    }
                                }}
                            />
                            </LocalizationProvider>
                        </div>
                        <div className='flex w-full'>
                            <TextField
                                id="password"
                                label="Contraseña *"
                                type="password"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("password", {
                                    required: "Este campo es requerido",
                                    minLength: {
                                        value: 8,
                                        message: "La contraseña debe tener al menos 8 caracteres"
                                    },
                                    validate: {
                                        hasUpperCase: (value) =>
                                            /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula",
                                        hasLowerCase: (value) =>
                                            /[a-z]/.test(value) || "La contraseña debe contener al menos una letra minúscula",
                                        hasNumber: (value) =>
                                            /[0-9]/.test(value) || "La contraseña debe contener al menos un número",
                                    }
                                })}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : "Ingrese Contraseña"}
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