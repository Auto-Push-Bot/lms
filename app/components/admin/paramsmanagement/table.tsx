"use client"

import React, { useCallback, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CreateModal from "./createmodal";
import TablePagination from '@mui/material/TablePagination';
import EditModal from "./editmodal";
import { useQuery } from "@tanstack/react-query";
import { fetchTableData } from "@/app/services/admin/paramsmanagement/abm.service";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import Skeleton from "@mui/material/Skeleton";
import { ABMTableProps } from "@/app/lib/dtos/abm";
import '@/app/components/globals.css';

export default function ABMTable({ table, setValueFeedback }: ABMTableProps) {
    const { watch, setValue } = useForm({
        defaultValues: {
            //pagination
            page: 0,
            rowsPerPage: 10,
            //filters
            search: "",
            //modals
            modalOpenCreate: false,
            modalOpenEdit: false,
            //selected row
            selectedRowId: 0,
            selectedRowName: ""
        }
    });
    //filters
        //search
    const search = watch("search");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSearch = useCallback(debounce((searchTerm: string) => {
        setValue("search", searchTerm);
    }, 500), []);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(event.target.value);
    };
    //pagination
    const page = watch("page");
    const rowsPerPage = watch("rowsPerPage");
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setValue("page", newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue("rowsPerPage", parseInt(event.target.value, 10));
        setValue("page", 0);
    };
    //fetch
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['tableData', search, page, rowsPerPage],
        queryFn: () => fetchTableData({ search, table, page, rowsPerPage }),
        refetchOnWindowFocus: false
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    //modales
        //create
    const modalOpenCreate = watch("modalOpenCreate");
    const handleOpenCreateModal = () => setValue("modalOpenCreate", true);
    const handleCloseCreateModal = () => {
        setValue("modalOpenCreate", false);
        refetch();
    };
        //selected row
    const selectedRowId = watch("selectedRowId");
    const selectedRowName = watch("selectedRowName");
        //edit
    const modalOpenEdit = watch("modalOpenEdit");
    const handleOpenEditModal = (id: number, name: string) => {
        setValue("selectedRowId", id);
        setValue("selectedRowName", name);
        setValue("modalOpenEdit", true);
    };
    const handleCloseEditModal = () => {
        setValue("modalOpenEdit", false);
        refetch();
    };
    return (
        <main className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-row justify-center text-gray-700">
                <form className="flex items-center justify-start md:w-2/6">
                    <TextField 
                        id="search"
                        label="Buscar por Nombre"
                        type="search"
                        variant="outlined"
                        color="warning"
                        fullWidth
                        onChange={handleSearchChange}
                    />
                </form>
                <div className="flex grow" />
                <Button
                    variant="contained"
                    size="large"
                    color="success"
                    disableElevation
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                >
                    AÑADIR
                </Button>
            </div>
            <div className="flex flex-grow custom-scrollbar overflow-y-auto">
                <TableContainer>
                    <Table stickyHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center" width="40%">
                                    <div className="text-gray-700 font-medium md:font-bold text-lg">
                                        Nombre
                                    </div>
                                </TableCell>
                                <TableCell align="left" width="40%">
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    <div className="mr-5 text-gray-700 font-medium md:font-bold text-lg">
                                        Acciones
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        {isLoading ? (
                            <TableBody>
                                {Array.from({ length: rowsPerPage }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center" size="small" width="40%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={300} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" size="small" width="40%">
                                        </TableCell>
                                        <TableCell align="center" size="small" width="20%">
                                            <div className="flex items-center mr-2 justify-center">
                                                <Skeleton variant="circular" width={25} height={25} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {data && data.items && data.items.length > 0 ? (
                                    data.items.map((row: any) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center" size="small" width="40%">
                                                <div className="text-gray-700 font-medium text-lg">
                                                    {row.name}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center" size="small" width="40%">
                                            </TableCell>
                                            <TableCell align="center" size="small" width="20%">
                                                <div className="flex flex-row justify-center mr-5 items-center text-gray-700">
                                                    <IconButton color="inherit" onClick={() => handleOpenEditModal(row.id, row.name)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" />
                                    </TableRow>
                                )}
                                {data && data.items && Array.from({ length: rowsPerPage - data.items.length }).map((_, index) => (
                                    <TableRow key={`empty-row-${index}`}>
                                        <TableCell colSpan={3} />
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </div>
            <div className="flex justify-end items-end overflow-x-hide">
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component="div"
                    count={data?.totalItems || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
            </div>
            <EditModal
                open={modalOpenEdit}
                handleClose={handleCloseEditModal}
                table={table}
                id={selectedRowId!}        
                name={selectedRowName!}
                setValueFeedback={setValueFeedback}
            />
            <CreateModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
                table={table}
                setValueFeedback={setValueFeedback}
            />
        </main>
    );
};