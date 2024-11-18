"use client"

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save';
import { editFormData, editFormProps, editTaskData } from "@/app/lib/dtos/task";
import { editProjectTask, fetchTaskById, fetchTaskSelectData } from "@/app/services/projects/projects.service";
import Skeleton from "@mui/material/Skeleton";

export default function EditTaskForm({ id, project_id, setValueFeedback }: editFormProps) {
    const { register, watch, handleSubmit, reset, formState: { errors }, setError, setValue, clearErrors } = useForm<editFormData>({
        defaultValues: {
            name: "",
            description: "",
            taskstatus_id: '',
            start: null,
            end: null
        },
    });
    //fetch select data
    const { data: selectData, isLoading: selectDataLoading } = useQuery({
        queryKey: ['fetchTaskSelectData'],
        queryFn: () => fetchTaskSelectData(),
        refetchOnWindowFocus: false
    });
    //fetch task data
    const { data: taskData, isLoading: taskDataLoading, refetch: taskDataRefetch, isError } = useQuery({
        queryKey: ['fetchProjectForEditById', id, project_id],
        queryFn: () => fetchTaskById(id, project_id),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
    useEffect(() => {
        if (taskData && selectData && !taskDataLoading && !selectDataLoading) {
            reset({
                name: taskData.name,
                description: taskData.description,
                taskstatus_id: taskData.taskstatus_id,
                start: dayjs(taskData.start),
                end: dayjs(taskData.end),
            });
        };
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [taskData, selectData, taskDataLoading, selectDataLoading, isError, reset]);
    const { data: selectdata, isLoading } = useQuery({
        queryKey: ['fetchSelectData'],
        queryFn: () => fetchTaskSelectData(),
        refetchOnWindowFocus: false
    });
    //mutation
    const mutation = useMutation({
        mutationFn: (data: editTaskData) => editProjectTask(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Tarea editada correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                taskDataRefetch();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            taskDataRefetch();
        }
    });
    const onSubmit: SubmitHandler<editFormData> = (data) => {
        mutation.mutate({
            name: data.name,
            description: data.description,
            start: data.start,
            end: data.end,
            id: id,
            taskstatus_id: data.taskstatus_id as number
            //el estado creo que solo lo cambiaria el alumno pero esta por verse
        });
    };
    const taskStatusId = watch("taskstatus_id");
    const taskStatusName = selectdata && selectdata.taskstatuses?.find((type) => type.id === taskStatusId)?.name || "Estado no disponible";
    return (
        <form className="flex flex-col w-full h-full gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-4">
                <div className='flex text-gray-700 items-center justify-center font-bold text-xl md:text-2xl mb-2'>
                    Información
                </div>
                <div className="flex grow" />
                <div className="flex mr-2">
                    <Button variant="contained" color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26} /> : <SaveIcon />} type="submit" disabled={mutation.isPending || taskDataLoading || isError}>GUARDAR</Button>
                </div>
            </div>
            {taskDataLoading ? (
                <div className='flex flex-col flex-grow w-full h-full gap-4 py-2 pr-2'>
                    <Skeleton variant="rectangular" height="100%" width="100%" className="rounded" />
                </div>
            ) : (
                <div className='flex flex-col flex-grow w-full h-full gap-4 py-2 pr-2 overflow-y-auto custom-scrollbar'>
                    <div className='flex w-full'>
                        <TextField
                            id="name"
                            label={errors.name ? errors.name.message : "Nombre de Tarea"}
                            type="text"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            value={watch("name")}
                            {...register("name", { required: "Este campo es requerido" })}
                            error={!!errors.name}
                        />
                    </div>
                    <div className='flex w-full'>
                        <TextField
                            id="description"
                            label={errors.description ? errors.description.message : "Descripción de Tarea"}
                            type="text"
                            variant="outlined"
                            color="warning"
                            multiline
                            rows={4}
                            fullWidth
                            value={watch("description")}
                            {...register("description", {
                                required: "Este campo es requerido",
                                maxLength: {
                                    value: 255,
                                    message: "Máximo 255 caracteres"
                                },
                            })}
                            error={!!errors.description}
                        />
                    </div>
                    <div className='flex w-full'>
                        <TextField
                            id="taskstatus_id"
                            label="Estado de Tarea"
                            type="text"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            value={taskStatusName}
                            InputProps={{
                                readOnly: true,
                                style: { userSelect: "none", pointerEvents: "none" } // No seleccionable
                            }}
                        />
                    </div>
                    <div className='md:flex md:gap-4 w-full'>
                        <div className='flex w-full mb-4 md:mb-0 md:w-3/6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Fecha de Inicio *"
                                    value={watch('start')}
                                    onChange={(newValue) => {
                                        if (!newValue) {
                                            setError('start', {
                                                type: 'manual',
                                                message: 'Este campo es requerido',
                                            });
                                        } else {
                                            clearErrors('start');
                                            const endValue = watch('end');
                                            if (endValue && newValue.isAfter(endValue)) {
                                                setError('start', {
                                                    type: 'manual',
                                                    message: 'Combinación de fechas no valida',
                                                });
                                            } else {
                                                clearErrors('start');
                                            }
                                        }
                                        setValue('start', newValue, { shouldValidate: true });
                                    }}
                                    slotProps={{
                                        textField: {
                                            id: "start",
                                            helperText: errors.start ? errors.start.message : 'Ingrese Fecha de Inicio',
                                            error: !!errors.start,
                                            fullWidth: true,
                                            variant: "outlined",
                                            color: "warning"
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='flex w-full md:w-3/6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Fecha de Fin *"
                                    value={watch('end')}
                                    onChange={(newValue) => {
                                        if (!newValue) {
                                            setError('end', {
                                                type: 'manual',
                                                message: 'Este campo es requerido',
                                            });
                                        } else {
                                            clearErrors('end');
                                            const startValue = watch('start');
                                            if (startValue && newValue.isBefore(startValue)) {
                                                setError('end', {
                                                    type: 'manual',
                                                    message: 'Combinación de fechas no valida',
                                                });
                                            } else {
                                                clearErrors('end');
                                            }
                                        }
                                        setValue('end', newValue, { shouldValidate: true });
                                    }}
                                    slotProps={{
                                        textField: {
                                            id: "end",
                                            helperText: errors.end ? errors.end.message : 'Ingrese Fecha de Fin',
                                            error: !!errors.end,
                                            fullWidth: true,
                                            variant: "outlined",
                                            color: "warning"
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};