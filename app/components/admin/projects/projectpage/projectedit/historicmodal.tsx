"use client"

import React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { historicModalProps } from '@/app/lib/dtos/project';
import { recordNewHistoricProject } from '@/app/services/projects/projects.service';
import TextField from '@mui/material/TextField';

export default function HistoricModal({ open, handleClose, id, name, setValueFeedback }: historicModalProps) {
    const { handleSubmit, register, formState: { errors }, reset } = useForm<{ name: string }>();
    const router = useRouter();
    const historicmutation = useMutation({
        mutationFn: () => recordNewHistoricProject(id),
        onSuccess: () => {
            router.push("/admin/projects"); 
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        }
    });
    const onSubmit = () => {
        historicmutation.mutate();
    };
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    const handleExit = () => {
        reset();
        handleClose();
    }
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
                            ¿Registrar {name} en el record historico?
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className='flex flex-col w-full pt-4 gap-4'>
                            <div className='text-gray-700 font-medium text-xl mb-2'>
                                Esto eliminará el proyecto  y lo registrará en el historico, ¿Esta seguro?
                            </div>
                            <TextField
                                id="name"
                                label="Nombre de Proyecto"
                                type="text"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                {...register("name", {
                                    required: "Este campo es requerido",
                                    validate: value => value === name || 'El nombre no coincide con el proyecto'
                                })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : ''}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-row m-3'>
                            <div className='flex flex-row justify-center gap-4'>
                                <Button variant="contained"  color="error" disableElevation endIcon={<CloseIcon />} onClick={handleExit}>CANCELAR</Button>
                                <Button variant="contained"  color="success" disableElevation endIcon={historicmutation.isPending ? <CircularProgress color="warning" size={26}/> : <HistoryIcon />} type="submit" disabled={historicmutation.isPending}>PASAR A HISTÓRICO</Button>
                            </div>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
    );
};