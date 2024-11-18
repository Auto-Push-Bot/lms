"use client"

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import FeedbackSnackbar from '../feedback';
import { changePassword } from '@/app/services/recovery/recovery.service';

export default function ChangePasswordForm({ token }: { token: string }) {
    const { reset, register, handleSubmit, getValues, formState: { errors }, setValue } = useForm<{ password: string, confirmPassword: string }>({
    });
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    const router = useRouter();
    //change passwword
    const registerUser = useMutation({
        mutationFn: (data: { password: string, token: string }) => changePassword(data),
        onSuccess:  () => {
            router.push("/login?recovery=true");
        },
        onError: (error) => {
            setValueFeedback("feedbackMessage", `El link para recuperar contraseña ya no es válido, intenta nuevamente.`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            reset();
        },
    });
    const onSubmit: SubmitHandler<{ password: string, confirmPassword: string }> = (data) => {
        registerUser.mutate({
            password: data.password,
            token: token,
        });
    };
    const feedbackOpen = watchFeedback("feedbackOpen");
    const feedbackSeverity = watchFeedback("feedbackSeverity");
    const feedbackMessage = watchFeedback("feedbackMessage");
    const handleFeedbackClose = () => {
        setValueFeedback("feedbackOpen", false);
    };
    return (
        <div className="flex flex-col w-64 md:w-2/5 gap-12">
            <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
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
                            CAMBIAR CONTRASEÑA
                    </Button>
                </div>
            </form>
            <FeedbackSnackbar
                open={feedbackOpen}
                onClose={handleFeedbackClose}
                severity={feedbackSeverity}
                message={feedbackMessage}
            />
        </div>
    );
};