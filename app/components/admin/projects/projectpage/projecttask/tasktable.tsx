"use client"

import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from "@tanstack/react-query";
import Masonry from "@mui/lab/Masonry";
import { Chip, Skeleton } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Gray800Tooltip from "../../utils";
import { deleteTaskData, projectTaskFormData, projectTaskTableProps } from "@/app/lib/dtos/task";
import { deleteTask, fetchProjectTasks } from "@/app/services/projects/projects.service";
import CreateTaskModal from "./createprojecttaskmodal";
import { useRouter } from "next/navigation";
import InfoIcon from '@mui/icons-material/Info';

export default function ProjectTaskTable({ id, setValueFeedback }: projectTaskTableProps) {
    const { watch, setValue, getValues, reset } = useForm<projectTaskFormData>({
        defaultValues: {
            tasks: [],
            loadMoreDisabled: false,
            //modals
            modalOpenCreate: false,
            //page
            page: 1
        }
    });
    //fetch tasks
    const loadMoreDisabled = watch("loadMoreDisabled");
    const tasks = watch("tasks");
    const page = watch("page");
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['fetchProjectTasks', id, page],
        queryFn: () => fetchProjectTasks(id, page),
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando tareas, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    useEffect(() => {
        if (data) {
            const existingTasks = getValues("tasks") || [];
            if (page === 1) {
                setValue("tasks", data.tasks);
            } else {
                setValue("tasks", [...existingTasks, ...data.tasks]);
            };
        };
    }, [data, page, setValue, getValues]);
    useEffect(() => {
        if (data) {
            const currentTasks = getValues("tasks") || [];
            setValue("loadMoreDisabled", currentTasks.length == data.totalTasks);
        };
    }, [tasks, setValue, data]);
    const handleLoadMore = () => setValue("page", page + 1);
    //modales
    //create
    const modalOpenCreate = watch("modalOpenCreate");
    const handleOpenCreateModal = () => setValue("modalOpenCreate", true);
    const handleCloseCreateModal = () => {
        setValue("page", 1);
        reset();
        refetch();
    };
    //delete
    const mutation = useMutation({
        mutationFn: (data: deleteTaskData) => deleteTask(data),
        onSuccess: (result, variables) => {
            if (result && result.success) {
                const existingTasks = getValues("tasks");
                const updatedTasks = existingTasks.filter(task => task.id !== variables.id);
                setValue("tasks", updatedTasks);
                setValueFeedback("feedbackMessage", `Tarea eliminada correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        }
    });
    const handleDelete = (id: number) => {
        mutation.mutate({
            id: id
        })
    };
    //router init
    const router = useRouter();
    const handleCalendarClick = () => {
        router.push(`/admin/projects/${id}/calendar`);
    };
    const handleCardClick = (task_id: number) => {
        router.push(`/admin/projects/${id}/${task_id}`);
    };
    return (
        <div className="flex flex-col w-full h-full gap-4">
            <div className="flex flex-row gap-2 md:gap-4">
                <div className='flex text-gray-700 items-center font-bold text-xl md:text-2xl md:mb-2'>
                    Tareas
                </div>
                <div className="flex grow" />
                <div className="flex flex-row justify-end mr-2 gap-2 w-full">
                    <div className="flex">
                        <Button variant="outlined" color="inherit" disableElevation fullWidth endIcon={<CalendarMonthIcon />} onClick={handleCalendarClick} disabled={isLoading || isError}>CALENDARIO</Button>
                    </div>
                    <div className="flex">
                        <Button variant="contained" color="success" disableElevation fullWidth endIcon={<AddIcon />} onClick={handleOpenCreateModal} disabled={isLoading || isError}>AÑADIR</Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-grow h-[20rem] overflow-y-auto custom-scrollbar">
                {isLoading || isError ?
                    (
                        <div className="flex flex-col gap-2 w-full h-full mr-2">
                            <Skeleton variant="rectangular" width="100%" height="100%" className="rounded" />
                        </div>
                    ) : (
                        <Masonry columns={{xs: 1, md: 2}} spacing={1}>
                            {tasks && tasks.length > 0 ? (
                                tasks.map((row: any) => (
                                    <React.Fragment key={row.id}>
                                        <Card className="shadow-none border border-gray-400">
                                            <CardContent>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center justify-center">
                                                        <div className="flex text-gray-700 font-medium md:font-bold text-[15px]">
                                                            {row.name}
                                                        </div>
                                                        <div className="flex flex-grow" />
                                                        <div className="flex flex-row items-center justify-center">
                                                            <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <IconButton>
                                                                <InfoIcon color="inherit" onClick={() => handleCardClick(row.id)} />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-center gap-6">
                                                        <div className="flex text-gray-700 font-medium text-[15px] gap-1">
                                                            <strong>Inicio: </strong>{new Date(row.start).toLocaleDateString('es-AR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="flex grow" />
                                                        <div className="flex text-gray-700 font-medium md:font-bold text-[15px]">
                                                            <Chip
                                                                label={row.taskstatusname}
                                                                color={
                                                                    row.taskstatusname === "Pendiente"
                                                                        ? "error"
                                                                        : row.taskstatusname === "En Progreso"
                                                                            ? "warning"
                                                                            : "success"
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-center gap-2">
                                                        <div className="flex text-gray-700 font-medium text-[15px] gap-1">
                                                            <strong>Final: </strong>{new Date(row.end).toLocaleDateString('es-AR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow text-gray-700 font-medium text-[15px] break-words">
                                                        {row.description}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="flex h-1"></div>
                            )}
                        </Masonry>
                    )
                }
            </div>
            <div className="flex justify-end items-end overflow-x-hide">
                <div className="flex grow" />
                <div className="flex text-gray-800 mr-2">
                    <Gray800Tooltip title={loadMoreDisabled ? "No hay más tareas!" : ""} arrow>
                        <span>
                            <Button variant="outlined" color="inherit" disableElevation endIcon={<AddIcon />} onClick={handleLoadMore} disabled={loadMoreDisabled || isLoading || isError}>CARGAR MÁS TAREAS</Button>
                        </span>
                    </Gray800Tooltip>
                </div>
            </div>
            <CreateTaskModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
                project_id={id}
                setValueFeedback={setValueFeedback}
            />
        </div>
    );
};