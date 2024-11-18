"use client"

import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import { projectObservationFormData, projectObservationTableProps } from "@/app/lib/dtos/observation";
import React, { useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { fetchScholarProjectObservations, readAllObservations } from "@/app/services/projects/projects.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import Masonry from "@mui/lab/Masonry";
import { Chip, Skeleton } from "@mui/material";
import convertToLinks from "@/app/components/converttohtml";
import Gray800Tooltip from "@/app/components/admin/projects/utils";

export default function ProjectObservationTable({ id, current_id, setValueFeedback }: projectObservationTableProps) {
    const { watch, setValue, getValues, reset } = useForm<projectObservationFormData>({
        defaultValues: {
            observations: [],
            loadMoreDisabled: false,
            //page
            page: 1
        }
    });
    //fetch observations
    const loadMoreDisabled = watch("loadMoreDisabled");
    const observations = watch("observations");
    const page = watch("page");
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['fetchProjectObservations', id, page],
        queryFn: () => fetchScholarProjectObservations(id, page, current_id),
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando observaciones, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    useEffect(() => {
        if (data) {
            const existingObservations = getValues("observations") || [];
            if (page === 1) {
                setValue("observations", data.observations);
            } else {
                setValue("observations", [...existingObservations, ...data.observations]);
            };
        };
    }, [data, page, setValue, getValues]);
    useEffect(() => {
        if (data) {
            const currentObservations = getValues("observations") || [];
            setValue("loadMoreDisabled", currentObservations.length == data.totalObservations);
        };
    }, [observations, setValue, data]);
    const handleLoadMore = () => setValue("page", page + 1);
    //read
    const mutation = useMutation({
        mutationFn: () => readAllObservations(current_id, id),
        onSuccess: () => {
            refetch();
        },
    });
    const handleReadAll = () => mutation.mutate();
    return (
        <div className="flex flex-col w-full h-full gap-4">
            <div className="flex flex-row gap-4">
                <div className='flex text-gray-700 items-center justify-center font-bold text-xl md:text-2xl mb-2'>
                    Observaciones
                </div>
                <div className="flex grow" />
            </div>
            <div className="flex flex-grow h-[20rem] overflow-y-auto custom-scrollbar">
                {isLoading || isError ?
                    (
                        <div className="flex flex-col gap-2 w-full h-full mr-2">
                            <Skeleton variant="rectangular" width="100%" height="100%" className="rounded" />
                        </div>
                    ) : (
                        <Masonry columns={{ xs: 1, md: 2 }} spacing={1}>
                            {observations && observations.length > 0 ? (
                                observations.map((row: any) => (
                                    <React.Fragment key={row.id}>
                                        <Card className={`shadow-none border ${row.is_read ? "border-gray-400" : "border-orange-400"}`}>
                                            <CardContent>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-row items-center justify-center gap-1">
                                                        <div className="flex text-gray-700 font-medium md:font-bold text-[15px]">
                                                            {row.author_name}
                                                        </div>
                                                        <div className="flex text-gray-700 font-medium md:font-bold text-[15px]">
                                                            el  {new Date(row.created_at).toLocaleDateString('es-AR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="flex flex-grow" />
                                                        {!row.is_read && <Chip color="error" label="Nuevo" />}
                                                    </div>
                                                    <div
                                                        className="flex-grow text-gray-700 font-medium text-[15px] break-words"
                                                        dangerouslySetInnerHTML={{ __html: convertToLinks(row.content) }}
                                                    />
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
                <div className="flex grow hidden md:block" />
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-[50%] text-gray-800 mr-2">
                    <Button variant="contained" className="!bg-gray-700 hover:!bg-gray-600" onClick={handleReadAll} fullWidth disableElevation disabled={mutation.isPending}>MARCAR TODAS COMO LEIDAS</Button>
                    <Gray800Tooltip title={loadMoreDisabled ? "No hay más observaciones!" : ""} arrow>
                        <span className="w-full">
                            <Button variant="outlined" color="inherit" fullWidth disableElevation endIcon={<AddIcon />} onClick={handleLoadMore} disabled={loadMoreDisabled || isLoading || isError}>CARGAR MÁS OBSERVACIONES</Button>
                        </span>
                    </Gray800Tooltip>
                </div>
            </div>
        </div>
    );
};