"use client"

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarTasks, fetchScholarCalendarTasks } from '@/app/services/projects/projects.service';
import { projectTaskCalendarFormData } from '@/app/lib/dtos/task';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import InfoIcon from '@mui/icons-material/Info';
import FeedbackSnackbar from '@/app/components/feedback';
import { Badge } from '@mui/material';

interface pageProps {
    id: number,
    current_id: number,
};

export default function ScholarProjectCalendar({ id, current_id }: pageProps) {
    const { watch, setValue } = useForm<projectTaskCalendarFormData>({
        defaultValues: {
            events: [],
            start_date: null,
            end_date: null,
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
        queryKey: ['fetchScholarProjectTasks', id, start_date, end_date],
        queryFn: () => {
            if (start_date) {
                return fetchScholarCalendarTasks(id, start_date, end_date!, current_id);
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
                    created_at: task.created_at,
                    newobservations: task.newobservations
                },
                allDay: true
            }));
            setValue("events", formattedEvents);
        }
    }, [data, setValue]);
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
        router.push(`/scholar/projects/${id}/${taskIdNumber}`);
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
                    plugins={[dayGridPlugin]}
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
                            <div className="flex items-center text-gray-700 font-medium md:font-bold text-[15px] gap-6 mr-2">
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
                                {eventInfo.event.extendedProps.newobservations > 0 && <Badge color="error" badgeContent={eventInfo.event.extendedProps.newobservations}/>}
                                <IconButton>
                                    <InfoIcon color="inherit" onClick={() => handleCardClick(eventInfo.event.id)} />
                                </IconButton>
                            </div>
                        </div>
                    )}
                />
            </div>
            <FeedbackSnackbar
                open={feedbackOpen}
                onClose={handleFeedbackClose}
                severity={feedbackSeverity}
                message={feedbackMessage}
            />
        </main>
    );
};