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
import { addLabData, labFormData } from '@/app/lib/dtos/user';
import { addLab, fetchLaboratories } from '@/app/services/register/register.service';
import { laboratory } from '@/app/lib/dtos/laboratory';
import { Alert, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateLaboratoryModal from './createmodal';

interface APIErrors {
    other?: string,
};

export default function LabForm({ userid }: { userid: number }) {
    const { watch, register, handleSubmit, getValues, formState: { errors }, setValue } = useForm<labFormData>({
        defaultValues: {
            laboratory_id: '',
            modalOpenCreate: false,
        }
    });
    const router = useRouter();
     //fetch labs
    const { data: laboratories, isLoading, refetch } = useQuery({
        queryKey: ['fetchLaboratories'],
        queryFn: () => fetchLaboratories(),
        refetchOnWindowFocus: false
    });
    const [apiError, setApiError] = useState<APIErrors>({});
    //create user
    const registerUser = useMutation({
        mutationFn: (data: addLabData) => addLab(data),
        onSuccess:  (result) => {
            if (result && result.success) {
                router.push(`/login`);
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                };
            };
        },
        onError: () => {
        },
    });
    const onSubmit: SubmitHandler<labFormData> = (data) => {
        registerUser.mutate({
            laboratory_id: data.laboratory_id as number,
            user_id: userid,
        });
    };
    //modales
        //create
        const modalOpenCreate = watch("modalOpenCreate");
        const handleOpenCreateModal = () => setValue("modalOpenCreate", true);
        const handleCloseCreateModal = () => {
            setValue("modalOpenCreate", false);
            refetch();
        };
    return (
        <div className="flex flex-col w-64 md:w-2/5 gap-12">
            <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <div className="flex flex-row mb-4 gap-2">
                        <div className='flex w-[90%]'>
                            <TextField 
                                id="laboratory_id" 
                                label="Laboratorio *" 
                                type="text" 
                                variant="outlined" 
                                color="warning" 
                                select 
                                fullWidth 
                                value={watch("laboratory_id")}
                                {...register("laboratory_id", { required: "Este campo es requerido", validate: value => value !== '' || "Este campo es requerido" })}
                                error={!!errors.laboratory_id}
                                helperText={errors.laboratory_id ? errors.laboratory_id.message : isLoading ? "Cargando Laboratorios" : "Seleccionar Laboratorio"}
                                disabled={isLoading}
                            >
                                {isLoading && <MenuItem value=''></MenuItem>}
                                {laboratories && laboratories.length > 0 && laboratories.map((Laboratory: laboratory) => (
                                    <MenuItem key={Laboratory.id} value={Laboratory.id}>{Laboratory.name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className='flex mb-5 w-[10%] items-center justify-center'>
                            <IconButton color="warning" onClick={() => handleOpenCreateModal()}>
                                <AddIcon />
                            </IconButton>
                        </div>
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
                            REGISTRARSE
                    </Button>
                </div>
            </form>
            {apiError.other && <Alert severity="error">{apiError.other}</Alert>}
            <CreateLaboratoryModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
            />
        </div>
    );
};