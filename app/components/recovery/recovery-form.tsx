"use client"

import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { recoveryEmail } from "@/app/services/recovery/recovery.service";
import FeedbackSnackbar from "../feedback";

interface APIErrors {
    email?: string;
}

export default function RecoveryForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<{ email: string }>();
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    const router = useRouter();
    const [apiError, setApiError] = useState<APIErrors>({});
    const mutation = useMutation({
        mutationFn: (data: { email: string }) => recoveryEmail(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Email enviado correctamente, revisa tu bandeja de entrada`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                setApiError({});
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                    reset()
                };
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            reset();
        }
    })
    const onSubmit: SubmitHandler<{ email: string }> = (data) => {
        mutation.mutate({
            email: data.email.toLowerCase(),
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
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                    <TextField
                        id="email"
                        label="Email"
                        type="text"
                        className="!text-orange-500"
                        variant="outlined"
                        color="warning"
                        fullWidth
                        {...register("email", {
                            pattern:
                            {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Ingrese su email"
                            }
                        })}
                        error={!!errors.email || !!apiError.email}
                        helperText={errors.email ? errors.email.message : apiError.email ? apiError.email : "Ingrese su Email"}
                    />
                </div>
                <div className="flex flex-row w-full justify-between gap-6">
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        disableElevation
                        fullWidth
                        onClick={() => router.push("/login")}
                        disabled={mutation.isPending}
                    >
                        CANCELAR
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        color="warning"
                        disableElevation
                        endIcon={mutation.isPending ? <CircularProgress color="warning" size={26} /> : <LoginIcon />}
                        fullWidth
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        ENVIAR CORREO
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