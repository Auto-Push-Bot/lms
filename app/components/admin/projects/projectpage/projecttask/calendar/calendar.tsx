"use client"

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteTask, editCalendarTask, fetchCalendarTasks } from '@/app/services/projects/projects.service';
import { deleteTaskData, dragTaskData, projectTaskCalendarFormData } from '@/app/lib/dtos/task';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import InfoIcon from '@mui/icons-material/Info';
import CreateTaskModal from '../createprojecttaskmodal';
import FeedbackSnackbar from '@/app/components/feedback';

interface pageProps {
    id: number
};

export default function ProjectCalendar({ id }: pageProps) {
    const { watch, setValue } = useForm<projectTaskCalendarFormData>({
        defaultValues: {
            events: [],
            start_date: null,
            end_date: null,
            modalOpenCreate: false,
        }
    });
    //feedback
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    const feedbackOpen = watchFeedback("feedbackOpen");
    const feedbackSeverity = watchFeedback("feedbackSeverity");
    const feedbackMessage = watchFeedback("feedbackMessage");
    const handleFeedbackClose = () => {
        setValueFeedback("feedbackOpen", false);
    };
    //dates init
    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const newStartDate = new Date(startOfMonth);
        newStartDate.setDate(newStartDate.getDate() - 7);
        const newEndDate = new Date(endOfMonth);
        newEndDate.setDate(newEndDate.getDate() + 7);
        setValue("start_date", newStartDate);
        setValue("end_date", newEndDate);
    }, [setValue]);
    //fetch tasks
    const start_date = watch("start_date");
    const end_date = watch("end_date");
    const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
        setValue("start_date", dateInfo.start);
        setValue("end_date", dateInfo.end);
    };
    const { data, refetch } = useQuery({
        queryKey: ['fetchProjectTasks', id, start_date, end_date],
        queryFn: () => {
            if (start_date) {
                return fetchCalendarTasks(id, start_date, end_date!);
            }
            return Promise.resolve([]);
        },
        refetchOnWindowFocus: false,
        enabled: !!start_date && !!end_date,
    });
    //format events
    const events = watch("events");
    useEffect(() => {
        if (data) {
            const formattedEvents = data.map(task => ({
                id: task.id.toString(),
                title: task.title,
                start: new Date(task.start),
                end: new Date(task.end),
                extendedProps: {
                    description: task.description,
                    taskstatusname: task.taskstatusname,
                    created_at: task.created_at
                },
                allDay: true
            }));
            setValue("events", formattedEvents);
        }
    }, [data, setValue]);
    //delete
    const mutation = useMutation({
        mutationFn: (data: deleteTaskData) => deleteTask(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Tarea eliminada correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                refetch();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            refetch();
        }
    });
    const handleDelete = (id: string) => {
        mutation.mutate({
            id: Number(id)
        })
    };
    //handle event drag
    const mutationUpdateDate = useMutation({
        mutationFn: (data: dragTaskData) => editCalendarTask(data),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Tarea editada correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                refetch();
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            refetch();
        }
    });
    const handleEventDrop = (info: any) => {
        const { event } = info;
        mutationUpdateDate.mutate({
            id: Number(event.id),
            start: event.start,
            end: event.end
        });
    };
    const handleEventResize = (info: any) => {
        const { event } = info;
        mutationUpdateDate.mutate({
            id: Number(event.id),
            start: event.start,
            end: event.end
        });
    };
    //modales
    //create
    const start_date_new = watch("start_date_new");
    const modalOpenCreate = watch("modalOpenCreate");
    const handleOpenCreateModal = (start_date: Date) => {
        setValue("start_date_new", start_date);
        setValue("modalOpenCreate", true);
    };
    const handleCloseCreateModal = () => {
        setValue("modalOpenCreate", false);
        refetch();
    };
    //buttons
    const [headerToolbar, setHeaderToolbar] = useState({
        left: 'title',
        center: '',
        right: 'prev,next today'
    });
    //router init
    const router = useRouter();
    //card click
    const handleCardClick = (task_id: string) => {
        const taskIdNumber = Number(task_id);
        router.push(`/admin/projects/${id}/${taskIdNumber}`);
    };
    //change header responsive
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setHeaderToolbar({
                    left: 'title',
                    center: '',
                    right: 'prev,next'
                });
            } else {
                setHeaderToolbar({
                    left: 'title',
                    center: '',
                    right: 'prev,next dayGridMonth,dayGridWeek today'
                });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <main className="flex flex-col w-full h-full">
            <div className="flex flex-col h-full text-gray-700 overflow-y-auto custom-scrollbar">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    editable={true}
                    selectable={true}
                    selectAllow={(selectInfo) => {
                        const diffInMilliseconds = selectInfo.end.getTime() - selectInfo.start.getTime();
                        const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
                        return diffInDays <= 1;
                    }}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    dateClick={(SelectInfo) => { handleOpenCreateModal(SelectInfo.date) }}
                    initialView="dayGridMonth"
                    locale="esLocale"
                    headerToolbar={headerToolbar}
                    titleFormat={{
                        year: 'numeric',
                        month: 'long',
                    }}
                    buttonText={{
                        today: 'Hoy',
                        dayGridMonth: 'Mes',
                        dayGridWeek: 'Semana'
                    }}
                    height="100%"
                    datesSet={handleDatesSet}
                    events={events}
                    eventClassNames="bg-white border-gray-800 rounded p-4"
                    eventContent={eventInfo => (
                        <div className="flex flex-col h-full max-h-[150px] gap-2 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center text-gray-700 font-medium md:font-bold text-[15px] break-words whitespace-pre-line mr-2">
                                {eventInfo.event.title}
                            </div>
                            <div className="flex items-center text-gray-700 font-medium text-[15px] break-words whitespace-pre-line mr-2">
                                {eventInfo.event.extendedProps.description}
                            </div>
                            <div className="flex items-center text-gray-700 font-medium md:font-bold text-[15px] gap-1 mr-2">
                                <Chip
                                    label={eventInfo.event.extendedProps.taskstatusname}
                                    color={
                                        eventInfo.event.extendedProps.taskstatusname === "Pendiente"
                                            ? "error"
                                            : eventInfo.event.extendedProps.taskstatusname === "En Progreso"
                                                ? "warning"
                                                : "success"
                                    }
                                />
                                <IconButton color="error" onClick={() => handleDelete(eventInfo.event.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton>
                                    <InfoIcon color="inherit" onClick={() => handleCardClick(eventInfo.event.id)} />
                                </IconButton>
                            </div>
                        </div>
                    )}
                />
            </div>
            <CreateTaskModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
                project_id={id}
                start_date_new={start_date_new}
                setValueFeedback={setValueFeedback}
            />
            <FeedbackSnackbar
                open={feedbackOpen}
                onClose={handleFeedbackClose}
                severity={feedbackSeverity}
                message={feedbackMessage}
            />
        </main>
    );
};