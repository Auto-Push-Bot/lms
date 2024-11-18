"use client"

import React, { useCallback } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import TablePagination from '@mui/material/TablePagination';
import debounce from "lodash.debounce";
import { fetchSupplyData, guestInventoryTableProps, inventoryFormData } from "@/app/lib/dtos/supply";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import { fetchTableData } from "@/app/services/inventory/inventory.service";
import '@/app/components/globals.css';

export default function GuestInventoryTable({ laboratory_id }: guestInventoryTableProps ) {
    const { watch, setValue } = useForm<inventoryFormData>({
        defaultValues: {
            //pagination
            page: 0,
            rowsPerPage: 10,
            //filters
            search: "",
            //expanded row
            expandedRowId: null,
            //sort by column
            sortDirection: "ASC",
            sortColumn: "s.name"
        }
    });
    //filters
        //search
    const search = watch("search");
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
    const params = {
        laboratory_id: laboratory_id,
        name: search,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        page: page, 
        rowsPerPage: rowsPerPage
    } as fetchSupplyData;
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['tableData', search, sortColumn, sortDirection, page, rowsPerPage ],
        queryFn: () => fetchTableData(params),
        refetchOnWindowFocus: false
    });
    //expanded row
    const expandedRowId = watch("expandedRowId");
    const toggleRowExpansion = (id: number) => {
        setValue("expandedRowId", expandedRowId === id ? null : id);
    };
    return (
        <main className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-row justify-center text-gray-700">
                <form className="flex items-center justify-start w-full md:w-2/6">
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
            </div>
            <div className="flex flex-grow custom-scrollbar overflow-y-auto">
                <TableContainer>
                    <Table stickyHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell 
                                    align="left" 
                                    onClick={() => handleSort('s.name')}
                                    style={{ cursor: 'pointer' }}
                                    width="30%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 's.name' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Nombre
                                    </div>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    onClick={() => handleSort('s.supplytype_id')}
                                    style={{ cursor: 'pointer' }}
                                    width="15%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 's.supplytype_id' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Tipo
                                    </div>
                                </TableCell>
                                <TableCell 
                                    align="center"
                                    onClick={() => handleSort('s.year')}
                                    style={{ cursor: 'pointer' }}
                                    width="15%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 's.year' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Año
                                    </div>
                                </TableCell>
                                <TableCell 
                                    align="center"
                                    onClick={() => handleSort('s.supplystatus_id')}
                                    style={{ cursor: 'pointer' }}
                                    width="15%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 's.supplystatus_id' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Estado
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        {isLoading ? (
                            <TableBody>
                                {Array.from({ length: rowsPerPage }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left" size="small" width="30%">
                                            <div className="flex items-center justify-start">
                                                <Skeleton variant="text" width={300} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" size="small" width="15%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={150} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" size="small" width="15%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={100} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" size="small" width="15%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={150} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {data && data.supplies && data.supplies.length > 0 ? (
                                    data.supplies.map((row: any) => (
                                        <React.Fragment key={row.id}>
                                                <TableRow 
                                                    onClick={() => toggleRowExpansion(row.id)}
                                                    className={`cursor-pointer ${expandedRowId === row.id ? 'bg-gradient-to-r from-transparent to-transparent via-gray-100' : ''}`}
                                                >
                                                    <TableCell align="left" size="small">
                                                        <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                            {row.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center" size="small">
                                                        <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                            {row.supplytype}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center" size="small">
                                                        <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                            {row.year}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center" size="small">
                                                        <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                            {row.supplystatus}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedRowId === row.id && (
                                                    <TableRow className="bg-gradient-to-r from-transparent to-transparent via-gray-100">
                                                        <TableCell colSpan={5}>
                                                            <div className="flex flex-col w-full">
                                                                <div className="flex gap-1 text-gray-700 font-medium md:text-[17px]">
                                                                        <strong>Descripción: </strong>{row.description}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" />
                                    </TableRow> 
                                )}         
                                {Array.from({ length: rowsPerPage - (data?.supplies?.length || 0) }).map((_, index) => (
                                    <TableRow key={`empty-row-${index}`}>
                                        <TableCell colSpan={5} />
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
                    count={data?.totalSupplies || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
            </div>
        </main>
    );
};