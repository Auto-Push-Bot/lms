"use client"

import { chatMenuProps, fetchChatUsersData, chatFormData, readMessagesData, fetchMessagesData, newMessageQuery, deleteMessageData } from "@/app/lib/dtos/message";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import React from "react";
import { useEffect } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs from 'dayjs';
import Badge from "@mui/material/Badge";
import { deleteMessage, fetchChatMessages, fetchChatUsers, sendMessage, setMessagesAsRead } from "@/app/services/messages/chat.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import Skeleton from "@mui/material/Skeleton";
import '@/app/components/globals.css';
import FeedbackSnackbar from "../../feedback";
import Gray800Tooltip from "../../admin/projects/utils";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import convertToLinks from "../../converttohtml";

export default function ChatScholar({ laboratory_id, current_id, usertype_id }: chatMenuProps) {
    const { register, watch, setValue, getValues, handleSubmit, formState: { errors } } = useForm<chatFormData>({
        defaultValues: {
            users: [],
            tabValue: 0,
            message: '',
            messages: [],
            loadMoreDisabled: false,
            page: 1
        }
    });
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    const current_id_number = Number(current_id);
    //fetch tab users
    const admins = watch("users")
    const params = {
        laboratory_id: laboratory_id,
        usertype_id: usertype_id,
        current_id: current_id_number,
    } as fetchChatUsersData;
    const { data: usersQuery, isLoading, isError: usersError } = useQuery({
        queryKey: ['getChatUsers'],
        queryFn: () => fetchChatUsers(params),
    });
    useEffect(() => {
        if (usersError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando los becarios, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [usersError])
    useEffect(() => {
        if (usersQuery) {
            setValue("users", usersQuery);
        }
    }, [usersQuery, setValue]);
    //tab change
    const tabValue = watch("tabValue");
    const readmessages = useMutation({
        mutationFn: (data: readMessagesData) => setMessagesAsRead(data),
    })
    const handleTabChange = async (event: React.SyntheticEvent, newTabValue: number) => {
        setValue("tabValue", newTabValue);
        readmessages.mutate({
            sender_id: newTabValue,
            receiver_id: current_id_number
        })
    };
    //fetch messages
    const loadMoreDisabled = watch("loadMoreDisabled");
    const messages = watch("messages");
    const page = watch("page");
    const params2 = {
        sender_id: current_id_number,
        receiver_id: tabValue,
        page: page
    } as fetchMessagesData;
    const { data: messagesQuery, refetch, isError: messagesError } = useQuery({
        queryKey: ['getChatMessages', tabValue, page],
        queryFn: () => fetchChatMessages(params2),
        refetchInterval: 5000,
    });
    useEffect(() => {
        if (messagesError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando los mensajes, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [messagesError])
    useEffect(() => {
        if (messagesQuery) {
            const existingMessages = getValues("messages") || [];
            if (page === 1) {
                setValue("messages", messagesQuery.messages);
            } else {
                setValue("messages", [...existingMessages, ...messagesQuery.messages]);
            };
        };
    }, [messagesQuery, page, setValue, getValues]);
    useEffect(() => {
        if (messagesQuery) {
            const currentMessages = getValues("messages") || [];
            setValue("loadMoreDisabled", currentMessages.length == messagesQuery.totalMessages);
        };
    }, [messages, setValue, messagesQuery]);
    const handleLoadMore = () => setValue("page", page + 1);
    //post message
    const sendmessage = useMutation({
        mutationFn: (data: newMessageQuery) => sendMessage(data),
        onSuccess: () => {
            setValue("message", '');
            refetch();
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `No se ha podido enviar el mensaje, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        }
    });
    const onSubmit: SubmitHandler<chatFormData> = (data) => {
        sendmessage.mutate({
            content: data.message,
            sender_id: current_id_number,
            receiver_id: tabValue,
        });
    };
    //feedback
    const feedbackOpen = watchFeedback("feedbackOpen");
    const feedbackSeverity = watchFeedback("feedbackSeverity");
    const feedbackMessage = watchFeedback("feedbackMessage");
    const handleFeedbackClose = () => {
        setValueFeedback("feedbackOpen", false);
    };
    //delete
    const mutation = useMutation({
        mutationFn: (data: deleteMessageData) => deleteMessage(data),
        onSuccess: (result, variables) => {
            if (result && result.success) {
                const existingMessages = getValues("messages");
                const updatedMessages = existingMessages.filter(message => message.id !== variables.id);
                setValue("messages", updatedMessages);
                setValueFeedback("feedbackMessage", `Mensaje eliminado correctamente`);
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
    return (
        <main className="flex flex-col h-screen w-full">
            <div className="flex h-[10%] bg-gray-700 border-b-4 border-orange-500 md:border-transparent text-white items-center justify-center">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons="auto"
                    className="h-16 md:h-20 items-center"
                >
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Tab
                                key={index}
                                label={<Skeleton variant="rectangular" width={200} height={30} />}
                                value={index}
                            />
                        ))
                    ) : (
                        admins.map(admin => (
                            <Tab
                                key={admin.id}
                                label={<Badge badgeContent={admin.unreadCount}
                                    color="warning">{admin.name}</Badge>}
                                value={admin.id}
                            />
                        ))
                    )}
                </Tabs>
            </div>
            {admins.map(admincontent => (
                tabValue === admincontent.id && (
                    <div key={admincontent.id} className="flex h-[90%] w-full">
                        <div className="flex flex-col w-full h-full p-4 md:p-6 gap-4 items-center">
                            <div className="flex text-gray-800 w-full justify-center items-center">
                                <Gray800Tooltip title={loadMoreDisabled ? "No hay más Mensajes!" : ""} arrow>
                                    <span className="w-full md:w-5/6">
                                        <Button variant="outlined" color="inherit" fullWidth disableElevation endIcon={<AddIcon />} onClick={handleLoadMore} disabled={loadMoreDisabled || isLoading}>CARGAR MÁS MENSAJES</Button>
                                    </span>
                                </Gray800Tooltip>
                            </div>
                            <div className="flex-grow flex-col w-full md:w-5/6 overflow-y-auto custom-scrollbar rounded border border-gray-400 justify-end">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-row w-full ${msg.sender_id === current_id_number ? 'pr-4 justify-end' : 'pl-4 justify-start'} mt-4 mb-4`}>
                                        <div className={`relative flex flex-col gap-2 p-2 rounded-t-lg max-w-[50%] brake-words ${msg.sender_id === current_id_number ? 'border border-gray-600 rounded-bl-lg text-gray-800' : 'border border-orange-500 rounded-br-lg text-gray-800'}`}>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: convertToLinks(msg.content) }}
                                            />
                                            <div className="flex flex-row w-full items-center justify-between gap-12">
                                                <span className="text-xs text-gray-600">
                                                    {dayjs(msg.timestamp).format('DD/MM/YYYY HH:mm')}
                                                </span>
                                                <IconButton
                                                    color="error"
                                                    className={`h-[1px] w-[1px] ${msg.sender_id === current_id_number ? '' : 'hidden'}`}
                                                    onClick={() => handleDelete(msg.id)}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form className="flex w-full md:w-5/6" onSubmit={handleSubmit(onSubmit)}>
                                <TextField
                                    label="Mensaje"
                                    id="message"
                                    type="text"
                                    variant="outlined"
                                    color="warning"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    {...register("message", {
                                        required: "Escribe un Mensaje",
                                        maxLength: {
                                            value: 255,
                                            message: "Máximo 255 caracteres"
                                        },
                                    })}
                                    error={!!errors.message}
                                    helperText={errors.message ? errors.message.message : ""}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end"><IconButton color="success" type="submit"><KeyboardArrowRightIcon /></IconButton></InputAdornment>
                                        ),
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(onSubmit)();
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                )
            ))}
            <FeedbackSnackbar
                open={feedbackOpen}
                onClose={handleFeedbackClose}
                severity={feedbackSeverity}
                message={feedbackMessage}
            />
        </main>
    );
};