"use client"

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAdminData, registerFormData } from '@/app/lib/dtos/user';
import { createAdmin, fetchLaboratories } from '@/app/services/register/register.service';
import { laboratory } from '@/app/lib/dtos/laboratory';
import { CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateLaboratoryModal from './lab/createmodal';

interface APIErrors {
    email?: string,
    name?: string,
};

export default function RegisterForm() {
    const { watch, register, handleSubmit, getValues, formState: { errors }, setValue } = useForm<registerFormData>({
    });
    const router = useRouter();
    const [apiError, setApiError] = useState<APIErrors>({});
    //create user
    const registerUser = useMutation({
        mutationFn: (data: createAdminData) => createAdmin(data),
        onSuccess:  (result) => {
            if (result && result.success) {
                router.push(`/register/lab?userid=${result.user_id}`);
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                };
            };
        },
        onError: () => {
        },
    });
    const onSubmit: SubmitHandler<registerFormData> = (data) => {
        registerUser.mutate({
            name: data.name,
            password: data.password,
            email: data.email.toLowerCase(),
        });
    };
    return (
        <div className="flex flex-col w-64 md:w-2/5 gap-12">
            <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <div className="mb-4 ">
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
                    <div className="mb-4">
                        <TextField 
                            id="email" 
                            label="Email *" 
                            type="text" 
                            variant="outlined" 
                            color="warning" 
                            fullWidth 
                            {...register("email", { 
                                required: "Este campo es requerido",
                                pattern: 
                                    {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Ingrese un email válido"
                                },
                                validate: (value) =>
                                    value.endsWith("@docentes.frm.utn.edu.ar") || "Debe usar su correo institucional (@docentes.frm.utn.edu.ar)"
                            })}
                            error={!!errors.email || !!apiError.email}
                            helperText={errors.email ? errors.email.message : apiError.email ? apiError.email : "Ingrese Email"}
                        />
                    </div>
                    <div className="mb-6">
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
                    <div className="mb-6">
                        <TextField 
                            id="confirmPassword" 
                            label="Confirmar Contraseña *" 
                            type="password" 
                            variant="outlined" 
                            color="warning" 
                            fullWidth 
                            {...register("confirmPassword", { 
                                required: "Este campo es requerido",
                                validate: (value) => value === getValues("password") || "Las contraseñas no coinciden" 
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword ? errors.confirmPassword.message : "Confirme Contraseña"}
                        />
                    </div>
                    <Button 
                        variant="contained" 
                        size="large" 
                        color="warning" 
                        disableElevation 
                        endIcon={registerUser.isPending ? <CircularProgress color="warning" size={26}/> : <KeyboardArrowRightIcon />} 
                        fullWidth 
                        type="submit"
                        disabled={registerUser.isPending}
                        >
                            CONTINUAR
                    </Button>
                </div>
            </form>
        </div>
    );
};