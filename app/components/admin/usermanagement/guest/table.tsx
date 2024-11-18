"use client"

import React, { useCallback, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import TablePagination from '@mui/material/TablePagination';
import debounce from "lodash.debounce";
import CreateGuestModal from "./createmodal";
import DeleteGuestModal from "./deletemodal";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import { fetchTableData } from "@/app/services/admin/usermanagement/guest.service";
import { guestFormData, guestTableProps } from "@/app/lib/dtos/guest";
import '@/app/components/globals.css';
import Chip from "@mui/material/Chip";

export default function ABMGuestTable({ laboratory_id, setValueFeedback }: guestTableProps ) {
    const { watch, setValue } = useForm<guestFormData>({
        defaultValues: {
            //filters
            search: "",
            //pagination
            page: 0,
            rowsPerPage: 10,
            //modals
            modalOpenCreate: false,
            modalOpenDelete: false,
            //selected row
            selectedRowId: 0,
            selectedRowName: "",
            //expanded row
            expandedRowId: null,
            //sort by column
            sortDirection: 'ASC',
            sortColumn: "u.name"
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
    //sort by column
    const sortDirection = watch("sortDirection");
    const sortColumn = watch("sortColumn");
    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'ASC' ? 'DESC' : 'ASC';
        setValue("sortColumn", column);
        setValue("sortDirection", newDirection);
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
        queryKey: ['tableData', search, sortColumn, sortDirection, page, rowsPerPage ],
        queryFn: () => fetchTableData({ search, laboratory_id, sortColumn, sortDirection, page, rowsPerPage }),
        refetchOnWindowFocus: false
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    //expanded row
    const expandedRowId = watch("expandedRowId");
    const toggleRowExpansion = (id: number) => {
        setValue("expandedRowId", expandedRowId === id ? null : id);
    }
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
        //delete
    const modalOpenDelete = watch("modalOpenDelete");
    const handleOpenDeleteModal = (id: number, name: string) => {
        setValue("selectedRowId", id);
        setValue("selectedRowName", name);
        setValue("modalOpenDelete", true);
    }
    const handleCloseDeleteModal = () => {
        setValue("modalOpenDelete", false);
        refetch();
    }
    return (
        <main className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-row justify-center text-gray-700">
                <form className="flex items-center justify-start md:w-2/6">
                    <TextField 
                        id="search"
                        name="search"
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
                                <TableCell align="left"
                                    onClick={() => handleSort('u.name')}
                                    style={{ cursor: 'pointer' }}
                                    width="40%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'u.name' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Nombre
                                    </div>
                                </TableCell>
                                <TableCell align="center"
                                    onClick={() => handleSort('u.userstatus_id')}
                                    style={{ cursor: 'pointer' }}
                                    width="30%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'u.userstatus_id' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Estado
                                    </div>
                                </TableCell>
                                <TableCell align="right"
                                    width="30%"
                                >
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
                                        <TableCell align="left" size="small" width="40%">
                                            <div className="flex items-center justify-start">
                                                <Skeleton variant="text" width={300} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" size="small" width="30%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={200} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="right" size="small" width="30%">
                                            <div className="flex items-center mr-12 justify-end">
                                                <Skeleton variant="circular" width={25} height={25} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {data && data.guests && data.guests.length > 0 ? (
                                    data.guests.map((row: any) => (
                                        <React.Fragment key={row.id}>
                                            <TableRow 
                                                onClick={() => toggleRowExpansion(row.id)}
                                                className={`cursor-pointer ${expandedRowId === row.id ? 'bg-gradient-to-r from-transparent to-transparent via-gray-100' : ''}`}
                                            >
                                                <TableCell align="left" size="small" width="40%">
                                                    <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                        {row.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" size="small" width="30%">
                                                    <div className="flex text-gray-700 font-medium md:font-bold text-[15px] items-center justify-center">
                                                        <Chip 
                                                            label={row.userstatus} 
                                                            color={
                                                                row.userstatus === "Expirado"
                                                                ? "error"
                                                                : row.userstatus === "Pendiente"
                                                                ? "warning"
                                                                : "success"
                                                            } 
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right" size="small" width="30%">
                                                    <div className="flex flex-row justify-end mr-10 items-center text-gray-700">
                                                        <IconButton color="error" onClick={() => handleOpenDeleteModal(row.id, row.name)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRowId === row.id && (
                                                <TableRow className="bg-gradient-to-r from-transparent to-transparent via-gray-100">
                                                    <TableCell colSpan={3}>
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex flex-col md:flex-row gap-4">
                                                                <div className="text-gray-700 font-medium md:text-[17px]">
                                                                    <strong>Email: </strong>{row.email}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                                                <div className="text-gray-700 w-3/6 font-medium md:text-[17px]">
                                                                    <strong>Valido Desde: </strong>
                                                                    {new Date(row.created_at).toLocaleDateString('es-AR', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </div>
                                                                <div className="text-gray-700 w-3/6 font-medium md:text-[17px]">
                                                                    <strong>Valido Hasta: </strong>
                                                                    {new Date(row.expires_at).toLocaleDateString('es-AR', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" />
                                    </TableRow>
                                )}
                                {Array.from({ length: rowsPerPage - (data?.guests?.length || 0) }).map((_, index) => (
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
                    count={data?.totalGuests || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
            </div>
            <CreateGuestModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
                laboratory_id={laboratory_id}
                setValueFeedback={setValueFeedback}
            />
            <DeleteGuestModal
                open={modalOpenDelete}
                handleClose={handleCloseDeleteModal}
                id={selectedRowId!}
                name={selectedRowName!}
                setValueFeedback={setValueFeedback}
            />
        </main>
    );
};