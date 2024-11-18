"use client"

import { projectScholarFormData, projectScholarTableProps } from "@/app/lib/dtos/scholar";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from "react-hook-form";
import { IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddScholarModal from "./addscholarmodal";
import RemoveScholarModal from "./removescholarmodal";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectScholarsByProjectId } from "@/app/services/projects/projects.service";

export default function ProjectScholarTable({ id, setValueFeedback }: projectScholarTableProps) {
    const { watch, setValue } = useForm<projectScholarFormData>({
        defaultValues: {
            //modals
            modalOpenCreate: false,
            modalOpenDelete: false,
            //selected row
            selectedRowId: '',
            selectedRowName: "",
            //expanded row
            expandedRowId: null,
        }
    });
    //fetch project data
    const { data: projectScholarsData, isLoading: projectScholarsDataLoading, refetch: projectScholarsDataRefetch, isError } = useQuery({
        queryKey: ['fetchProjectScholarsByProjectId', id],
        queryFn: () => fetchProjectScholarsByProjectId(id),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
    const [scholarIds, setScholarIds] = useState<number[]>([]);
    useEffect(() => {
        if (projectScholarsData && projectScholarsData.scholars && !projectScholarsDataLoading && !isError) {
            setScholarIds(projectScholarsData.scholars.map(scholar => scholar.id));
        } else {
            setScholarIds([]);
        };
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando los becarios asignados, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [projectScholarsData, isError, projectScholarsDataLoading])
    //expanded row
    const expandedRowId = watch("expandedRowId");
    const toggleRowExpansion = (id: number) => {
        setValue("expandedRowId", expandedRowId === id ? null : id);
    };
    //modales
    //create
    const modalOpenCreate = watch("modalOpenCreate");
    const handleOpenCreateModal = () => setValue("modalOpenCreate", true);
    const handleCloseCreateModal = () => {
        setValue("modalOpenCreate", false);
        projectScholarsDataRefetch();
    };
    //selected row
    const selectedRowId = watch("selectedRowId");
    const selectedRowName = watch("selectedRowName");
    //delete
    const modalOpenDelete = watch("modalOpenDelete");
    const handleOpenDeleteModal = (id: number, name: string) => {
        setValue("selectedRowId", id);
        setValue("selectedRowName", name);
        setValue("modalOpenDelete", true);
    };
    const handleCloseDeleteModal = () => {
        setValue("modalOpenDelete", false);
        projectScholarsDataRefetch();
    };
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row gap-4">
                <div className='flex text-gray-700 items-center justify-center font-bold text-xl md:text-2xl mb-2'>
                    Becarios Asignados
                </div>
                <div className="flex grow" />
                <div className="flex mr-2">
                    <Button variant="contained" color="success" disableElevation endIcon={<AddIcon />} onClick={handleOpenCreateModal} disabled={projectScholarsDataLoading || isError}>AÑADIR</Button>
                </div>
            </div>
            {projectScholarsDataLoading || isError ? (
                <div className='flex flex-grow w-full h-full gap-4 py-2 pr-2'>
                    <Skeleton variant="rectangular" height="100%" width="100%" className="rounded" />
                </div>
            ) : (
                <div className="flex flex-grow h-[20rem] w-full overflow-y-auto custom-scrollbar pr-2">
                    <TableContainer>
                        <Table stickyHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        align="left"
                                        width="40%"
                                    >
                                        <div className="text-gray-700 font-medium md:font-bold text-[17px] md:text-lg">
                                            Nombre
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        width="30%"
                                    >
                                        <div className="text-gray-700 font-medium md:font-bold text-[17px] md:text-lg">
                                            Legajo
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        width="30%"
                                    >
                                        <div className="mr-4 text-gray-700 font-medium md:font-bold text-[17px] md:text-lg">
                                            Acciones
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                {projectScholarsData && projectScholarsData.scholars && projectScholarsData.scholars.length > 0 ? (
                                    projectScholarsData.scholars.map(row => (
                                        <React.Fragment key={row.id}>
                                            <TableRow
                                                onClick={() => toggleRowExpansion(row.id)}
                                                className={`cursor-pointer ${expandedRowId === row.id ? 'bg-gradient-to-r from-transparent to-transparent via-gray-100' : ''}`}
                                            >
                                                <TableCell align="left" size="small" width="40%">
                                                    <div className="text-gray-700 font-medium text-[15px] md:text-[17px]">
                                                        {row.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" size="small" width="30%">
                                                    <div className="text-gray-700 font-medium text-[15px] md:text-[17px]">
                                                        {row.file}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right" size="small" width="30%">
                                                    <div className="flex flex-row justify-end gap-5 text-gray-700 mr-8">
                                                        <IconButton color="error" onClick={() => handleOpenDeleteModal(row.id, row.name)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRowId === row.id && (
                                                <TableRow className="bg-gradient-to-r from-transparent to-transparent via-gray-100">
                                                    <TableCell colSpan={3} size="small">
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex gap-1 text-gray-700 font-medium md:text-[17px]">
                                                                <strong>Email: </strong>{row.email}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <div className="text-gray-700 font-medium text-[15px] md:text-[17px]">
                                                No hay becarios asignados
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            {projectScholarsData && !isError &&
                <AddScholarModal
                    open={modalOpenCreate}
                    handleClose={handleCloseCreateModal}
                    laboratory_id={projectScholarsData.laboratory_id}
                    project_id={id}
                    scholar_ids={scholarIds}
                    setValueFeedback={setValueFeedback}
                />
            }
            <RemoveScholarModal
                open={modalOpenDelete}
                handleClose={handleCloseDeleteModal}
                project_id={id}
                scholar_id={selectedRowId as number}
                scholarname={selectedRowName}
                setValueFeedback={setValueFeedback}
            />
        </div>
    );
};