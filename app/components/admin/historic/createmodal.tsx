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
import { CircularProgress, Divider, MenuItem } from '@mui/material';
import { createFormData, createModalProps, newHistoricProjectData } from '@/app/lib/dtos/historicproject';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createTableData } from '@/app/services/historic/historic.service';
import '@/app/components/globals.css';

export default function CreateHistoricProjectModal({ open, handleClose, historicusercareers, historicscholarships, historicprojecttypes, historicprojectstatus, laboratory_id, setValueFeedback  }: createModalProps) {
    const { watch, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<createFormData>({
        defaultValues: {
            year: 0,
            projectstatus: 0,
            projecttype: 0,
            scholars: [],
        },
    });
    const mutation = useMutation({
        mutationFn: (data: newHistoricProjectData) => createTableData(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Proyecto histórico creado correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                handleClose();
                reset();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            handleClose();
            reset();
        }
    });
    //year
    const añoInicio = 2008;
    const añoFinal = new Date().getFullYear() - 1;
    const años = Array.from({ length: añoFinal - añoInicio + 1 }, (_, index) => añoInicio + index);
    //scholars
    const scholars =  watch("scholars");
    const handleScholarChange = ( index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { name, value } = event.target;
        const newScholars = [...scholars];
        type ScholarField = 'name' | 'email' | 'dni' | 'file' | 'phone' | 'careerlevel' | 'historicusercareer_id' | 'historicscholarshiptype_id';
        const fieldName = name as ScholarField;
        if (fieldName === 'careerlevel' || fieldName === 'historicusercareer_id' || fieldName === 'historicscholarshiptype_id') {
        newScholars[index][fieldName] = parseInt(value, 10) as any;
        } else {
        newScholars[index][fieldName] = value;
        };
        setValue("scholars", newScholars);
    };
    const handleAddScholar = () => {
        setValue("scholars", [
            ...scholars,
            {
                name: '',
                email: '',
                dni: '',
                file: '',
                phone: '',
                careerlevel: undefined,
                historicusercareer_id: undefined,
                historicscholarshiptype_id: undefined,
            },
        ]);
    };
    const handleRemoveScholar = (index: number) => {
        const newScholars = scholars.filter((_, i) => i !== index);
        setValue("scholars", newScholars);
    };
    const onSubmit: SubmitHandler<createFormData> = (data) => {
        mutation.mutate({ 
            name: data.name,
            description: data.description,
            year: data.year,
            projectstatus_id: data.projectstatus,
            projecttype_id: data.projecttype,
            laboratory_id: laboratory_id,
            scholars: data.scholars
        });
    };
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    const handleExit = () => {
        handleClose();
        reset();
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
                className:"custom-scrollbar",
                elevation: 0,
                style: { width: '600px', maxWidth: 'none', overflowY: 'auto' }
            }} 
        >
            <div className='flex flex-col m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Añadir Historico de Proyecto
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
                                    id="projecttype" 
                                    label="Tipo *" 
                                    type="text" 
                                    variant="outlined" 
                                    color="warning" 
                                    select 
                                    fullWidth  
                                    value={watch("projecttype")}
                                    {...register("projecttype", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.projecttype}
                                    helperText={errors.projecttype ? errors.projecttype.message : "Seleccionar Tipo de Proyecto"}
                                >
                                    {historicprojecttypes.map(type => (
                                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className='flex w-full md:w-3/6'>
                                <TextField 
                                    id="projectstatus" 
                                    label="Estado *" 
                                    type="text" 
                                    variant="outlined" 
                                    color="warning" 
                                    select 
                                    fullWidth 
                                    value={watch("projectstatus")}
                                    {...register("projectstatus", { required: "Este campo es requerido", validate: value => value !== 0 || "Este campo es requerido" })}
                                    error={!!errors.projectstatus}
                                    helperText={errors.projectstatus ? errors.projectstatus.message : "Seleccionar Estado de Proyecto"}
                                > 
                                    {historicprojectstatus.map(status => (
                                        <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
                        <Divider className="w-full"></Divider>
                        <div className='flex flex-row w-full'>
                            <div className='text-gray-700 items-center font-medium text-xl md:text-2xl mb-2'>
                                Becarios
                            </div>
                            <div className='flex grow'/>
                            <Button variant="contained" color="warning" disableElevation onClick={handleAddScholar}>Añadir Becario</Button>
                        </div>
                        <Divider className="w-full"></Divider>
                        {scholars.map((scholar, index) => (
                            <div key={index} className='flex flex-col w-full md:gap-4'>
                                <div className='flex w-full mb-4 md:mb-0'>
                                    <TextField 
                                        id="name" 
                                        label="Nombre y Apellido *"
                                        type="text" 
                                        variant="outlined" 
                                        color="warning" 
                                        value={scholar.name} 
                                        fullWidth 
                                        {...register(`scholars.${index}.name`, {
                                            required: "Este campo es requerido",
                                            onChange: (event) => handleScholarChange(index, event),
                                        })}
                                        error={!!errors.scholars?.[index]?.name}
                                        helperText={errors.scholars?.[index]?.name ? errors.scholars[index].name.message : "Ingrese Nombre y Apellido de Becario"}
                                    />
                                </div>    
                                <div className='flex w-full mb-4 md:mb-0'>
                                    <TextField 
                                        id="email"
                                        label="Email" 
                                        type="email" 
                                        variant="outlined"
                                        color="warning" 
                                        value={scholar.email}
                                        fullWidth
                                        {...register(`scholars.${index}.email`, {
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Ingrese un email válido"
                                            },
                                            onChange: (event) => handleScholarChange(index, event),
                                        })}
                                        error={!!errors.scholars?.[index]?.email}
                                        helperText={errors.scholars?.[index]?.email ? errors.scholars[index].email.message : "Ingrese Email de Becario"}
                                    />
                                </div>
                                <div className='md:flex md:gap-4 w-full'>   
                                    <div className='flex w-full mb-4 md:mb-0'>
                                        <TextField 
                                            id="dni" 
                                            label="DNI" 
                                            helperText="Ingrese DNI de Becario" 
                                            type="text" 
                                            variant="outlined" 
                                            color="warning" 
                                            value={scholar.dni} 
                                            fullWidth
                                            {...register(`scholars.${index}.dni`, {
                                                onChange: (event) => handleScholarChange(index, event),
                                            })}
                                        />
                                    </div> 
                                    <div className='flex w-full mb-4 md:mb-0'>
                                        <TextField 
                                            id="file" 
                                            label="Legajo"
                                            helperText="Ingrese Legajo de Becario" 
                                            type="text" 
                                            variant="outlined" 
                                            color="warning" 
                                            value={scholar.file} 
                                            fullWidth
                                            {...register(`scholars.${index}.file`, {
                                                onChange: (event) => handleScholarChange(index, event),
                                            })}
                                        />
                                    </div> 
                                </div>
                                <div className='flex w-full mb-4 md:mb-0'>
                                    <TextField 
                                        id="phone" 
                                        label="Teléfono"
                                        helperText="Ingrese Teléfono de Becario" 
                                        type="text" 
                                        variant="outlined" 
                                        color="warning" 
                                        value={scholar.phone} 
                                        fullWidth
                                        {...register(`scholars.${index}.phone`, {
                                            onChange: (event) => handleScholarChange(index, event),
                                        })}
                                    />
                                </div>
                                <div className='md:flex md:gap-4 w-full mb-4 md:mb-0'>
                                    <div className='flex w-full mb-4 md:mb-0 md:w-4/5'>
                                        <TextField 
                                            id="historicusercareer_id" 
                                            label="Carrera *" 
                                            type="text" 
                                            variant="outlined" 
                                            color="warning" 
                                            select 
                                            fullWidth
                                            value={scholar.historicusercareer_id} 
                                            {...register(`scholars.${index}.historicusercareer_id`, { 
                                                required: "Este campo es requerido", 
                                                onChange: (event) => handleScholarChange(index, event),
                                                validate: value => value !== 0 || "Este campo es requerido" 
                                            })}
                                            error={!!errors.scholars?.[index]?.historicusercareer_id}
                                            helperText={errors.scholars?.[index]?.historicusercareer_id ? errors.scholars[index].historicusercareer_id.message : "Seleccionar Carrera"}
                                        >
                                            {historicusercareers.map(usercareer => (
                                                <MenuItem key={usercareer.id} value={usercareer.id}>{usercareer.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className='flex w-full md:w-2/6'>
                                        <TextField 
                                            id="careerlevel"
                                            label="Año"
                                            helperText="Año de Cursado" 
                                            type="text" 
                                            variant="outlined" 
                                            color="warning"
                                            select 
                                            fullWidth 
                                            value={scholar.careerlevel} 
                                            {...register(`scholars.${index}.careerlevel`, { 
                                                onChange: (event) => handleScholarChange(index, event),
                                            })}
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
                                        id="historicscholarshiptype_id" 
                                        label="Beca *"
                                        type="text" 
                                        variant="outlined"
                                        color="warning" 
                                        select 
                                        fullWidth 
                                        value={scholar.historicscholarshiptype_id} 
                                        {...register(`scholars.${index}.historicscholarshiptype_id`, { 
                                            required: "Este campo es requerido", 
                                            onChange: (event) => handleScholarChange(index, event),
                                            validate: value => value !== 0 || "Este campo es requerido" 
                                        })}
                                        error={!!errors.scholars?.[index]?.historicscholarshiptype_id}
                                        helperText={errors.scholars?.[index]?.historicscholarshiptype_id ? errors.scholars[index].historicscholarshiptype_id.message : "Selecciona la Beca Correspondiente"}
                                    >
                                        {historicscholarships.map(scholarship => (
                                            <MenuItem key={scholarship.id} value={scholarship.id}>{scholarship.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div className='flex flex-row justify-end items-end md:mt-0 md:mb-0 mt-2 mb-2'>
                                    <div className='flex flex-row gap-4'>
                                        <Button variant="contained" color="error" disableElevation onClick={() => handleRemoveScholar(index)}>Eliminar Becario</Button>
                                    </div>
                                </div>
                                <Divider className="w-full"></Divider>
                            </div>
                        ))}
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