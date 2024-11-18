"use client"

import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import { gradeHistoryModalProps } from '@/app/lib/dtos/project';
import SaveIcon from '@mui/icons-material/Save';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchGrades, gradeProject } from '@/app/services/projects/projects.service';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gradeProjectData, gradeProjectFormData } from '@/app/lib/dtos/grade';

export default function GradeModal({ open, handleClose, id, setValueFeedback }: gradeHistoryModalProps) {
    const { watch, register, handleSubmit, reset, formState: { errors } } = useForm<gradeProjectFormData>({
        defaultValues: {
            grade_id: 0
        },
    });
    //fetch
    const { data, isLoading, isError } = useQuery({
        queryKey: ['fetchGrades'],
        queryFn: () => fetchGrades(),
        refetchOnWindowFocus: false
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    //mutation
    const mutation = useMutation({
        mutationFn: (data: gradeProjectData) => gradeProject(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Proyecto calificado correctamente`);
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
    const onSubmit: SubmitHandler<gradeProjectFormData> = (data) => {
        mutation.mutate({
            grade_id: data.grade_id,
            project_id: id 
        });
    };
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
            <div className='flex flex-col h-full m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Calificar Proyecto
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full pt-4 gap-4'>
                        <TextField
                            id="grade_id"
                            label="Calificación *"
                            type="text"
                            variant="outlined"
                            color="warning"
                            select
                            fullWidth
                            value={watch("grade_id")}
                            {...register("grade_id", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                            error={!!errors.grade_id}
                            helperText={errors.grade_id ? errors.grade_id.message : "Selecciona la Calificación"}
                            disabled={isLoading}
                        >
                            <MenuItem value={0}></MenuItem>
                            {data && data.map(data => (
                                <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row m-3'>
                        <div className='flex flex-row justify-center gap-4'>
                            <Button variant="contained" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleClose}>CANCELAR</Button>
                            <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26} /> : <SaveIcon />} type="submit" disabled={mutation.isPending || isLoading}>GUARDAR</Button>
                        </div>
                    </div>
                </DialogActions>
            </div >
        </Dialog >
    );
};