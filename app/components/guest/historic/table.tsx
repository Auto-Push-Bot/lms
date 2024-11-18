"use client"

import React, { useCallback } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import TablePagination from '@mui/material/TablePagination';
import debounce from "lodash.debounce";
import { fetchHistoricProjectData, historicFormData, historicTableProps } from "@/app/lib/dtos/historicproject";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { Divider, ButtonGroup, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { fetchTableData } from "@/app/services/historic/historic.service";
import '@/app/components/globals.css';

export default function HistoricTable({ historicusercareers, historicscholarships, historicprojecttypes, historicprojectstatus, laboratory_id }: historicTableProps ) {
    const { watch, setValue, getValues } = useForm<historicFormData>({
        defaultValues: {
            //filters
            filterAnchor: null,
            activeFilters: {},
            projectSearch: "",
            normalProjectSearch: "",
            showProjectSearchForm: true,
            projectTypeFilter: 0,
            showProjectTypeFilter: false,
            projectStatusFilter: 0,
            showProjectStatusFilter: false,
            yearFilter: 0,
            showYearFilter: false,
            scholarSearch: "",
            normalScholarSearch: "",
            showScholarSearchForm: false,
            scholarshipTypeFilter: 0,
            showScholarshipTypeFilter: false,
            userCareerFilter: 0,
            showUserCareerFilter: false,
            //pagination
            page: 0,
            rowsPerPage: 10,
            //expanded row
            expandedRowId: null,
            //sort by column
            sortDirection: "ASC",
            sortColumn: "hp.name"
        }
    });
    //filters
    const filterAnchor = watch("filterAnchor") as any;
    const filterMenuOpen = Boolean(filterAnchor);
    const activeFilters = watch("activeFilters") as { [key: string ]: any };
    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setValue("filterAnchor", event.currentTarget);
    };
    const handleFilterClose = () => {
        setValue("filterAnchor", null);
    };
    const handleClearFilters = () => {
            //reset values
        setValue("projectSearch", "");
        setValue("normalProjectSearch", "");
        setValue("projectStatusFilter", 0);
        setValue("projectTypeFilter", 0);
        setValue("yearFilter", 0);
        setValue("scholarSearch", "");
        setValue("normalScholarSearch", "");
        setValue("scholarshipTypeFilter", 0);
        setValue("userCareerFilter", 0);
            //reset default filter show
        setValue("showProjectSearchForm", true);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);
            //reset active filters and close
        setValue("activeFilters", {});
        handleFilterClose();
    };
        //project search
    const projectSearch = watch("projectSearch") as string;
    const normalProjectSearch = watch("normalProjectSearch") as string;
    const showProjectSearchForm = watch("showProjectSearchForm") as boolean;
    const handleProjectSearchFilterSelect = () => {
        setValue("showProjectSearchForm", true);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);
        handleFilterClose();
    };
    const handleProjectSearchFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue("normalProjectSearch", event.target.value);
        handleProjectSearch(event.target.value);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            projectsearch: event.target.value,
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleProjectSearch = useCallback(debounce((searchTerm: string) => {
        setValue("projectSearch", searchTerm);
    }, 500), []);
        //projecttype filter
    const historicprojecttype_id = watch("projectTypeFilter") as number;
    const showProjectTypeFilter = watch("showProjectTypeFilter") as boolean;
    const handleProjectTypeFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", true);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);;
        handleFilterClose();
    };
    const handleProjectTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const projecttypevalue = Number(event.target.value);
        setValue("projectTypeFilter", projecttypevalue);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            projecttype: event.target.value,
        });
    };
    const getHistoricProjectTypeNameById = (id: number) => {
        const projecttype = historicprojecttypes.find(sch => sch.id === id);
        return projecttype ? projecttype.name : 'Desconocida';
    };
        //projecttype filter
    const historicprojectstatus_id = watch("projectStatusFilter") as number;
    const showProjectStatusFilter = watch("showProjectStatusFilter") as boolean;
    const handleProjectStatusFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", true);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);;
        handleFilterClose();
    };
    const handleProjectStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const projectstatusvalue = Number(event.target.value);
        setValue("projectStatusFilter", projectstatusvalue);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            projectstatus: event.target.value,
        });
    };
    const getHistoricProjectStatusNameById = (id: number) => {
        const projectstatus = historicprojectstatus.find(sch => sch.id === id);
        return projectstatus ? projectstatus.name : 'Desconocida';
    };
        //year filter
    const añoInicio = 2008;
    const añoFinal = new Date().getFullYear() - 1;
    const años = Array.from({ length: añoFinal - añoInicio + 1 }, (_, index) => añoInicio + index);
    const yearFilter = watch("yearFilter") as number;
    const showYearFilter = watch("showYearFilter") as boolean;
    const handleYearFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", true);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);
        handleFilterClose();
    };
    const handleYearFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const yearvalue = Number(event.target.value);
        setValue("yearFilter", yearvalue);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            year: event.target.value,
        });
    };
        //scholar search
    const scholarSearch = watch("scholarSearch") as string;
    const normalScholarSearch = watch("normalScholarSearch") as string;
    const showScholarSearchForm = watch("showScholarSearchForm") as boolean;
    const handleScholarSearchFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", true);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", false);
        handleFilterClose();
    };
    const handleScholarSearchFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue("normalScholarSearch", event.target.value);
        handleScholarSearch(event.target.value);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            scholarsearch: event.target.value,
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleScholarSearch = useCallback(debounce((searchTerm: string) => {
        setValue("scholarSearch", searchTerm);
    }, 500), []);
        //scholarshiptype filter
    const historicscholarshiptype_id = watch("scholarshipTypeFilter") as number;
    const showScholarshipTypeFilter = watch("showScholarshipTypeFilter") as boolean;
    const handleScholarshipTypeFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", true);
        setValue("showUserCareerFilter", false);;
        handleFilterClose();
    };
    const handleScholarshipTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const scholarshiptypevalue = Number(event.target.value);
        setValue("scholarshipTypeFilter", scholarshiptypevalue);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            scholarship: event.target.value,
        });
    };
    const getHistoricScholarshipNameById = (id: number) => {
        const scholarship = historicscholarships.find(sch => sch.id === id);
        return scholarship ? scholarship.name : 'Desconocida';
    };
        //usercareer filter
    const historicusercareer_id = watch("userCareerFilter") as number;
    const showUserCareerFilter = watch("showUserCareerFilter") as boolean;
    const handleUserCareerFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
        setValue("showYearFilter", false);
        setValue("showScholarSearchForm", false);
        setValue("showScholarshipTypeFilter", false);
        setValue("showUserCareerFilter", true);
        handleFilterClose();
    };
    const handleUserCareerFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const usercareervalue = Number(event.target.value)
        setValue("userCareerFilter", usercareervalue);
        const currentFilters = getValues("activeFilters");
        setValue("activeFilters", {
            ...currentFilters,
            career: event.target.value,
        });
    };
    const getHistoricUserCareerNameById = (id: number) => {
        const career = historicusercareers.find(sch => sch.id === id);
        return career ? career.name : 'Desconocida';
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
    const rowsPerPage = watch("rowsPerPage")
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setValue("page", newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue("rowsPerPage", parseInt(event.target.value, 10));
        setValue("page", 0);
    };
    //fetch
    const params = {
        projectSearch: projectSearch,
        historicprojectstatus_id: historicprojectstatus_id,
        historicprojecttype_id: historicprojecttype_id,
        year: yearFilter,
        scholarSearch: scholarSearch,
        historicusercareer_id: historicusercareer_id,
        historicscholarshiptype_id: historicscholarshiptype_id,
        laboratory_id: laboratory_id,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        page: page,
        rowsPerPage: rowsPerPage,
    } as fetchHistoricProjectData;
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['tableData', projectSearch, historicprojectstatus_id, historicprojecttype_id, yearFilter, scholarSearch, historicusercareer_id, historicscholarshiptype_id, sortColumn, sortDirection, page, rowsPerPage],
        queryFn: () => fetchTableData(params),
        refetchOnWindowFocus: false
    });
    //expanded row
    const expandedRowId = watch("expandedRowId");
    const toggleRowExpansion = (id: number) => {
        setValue("expandedRowId", expandedRowId === id ? null : id);
    };
    //modals
        //create
    const modalOpenCreate = watch("modalOpenCreate");
    const handleOpenCreateModal = () => setValue("modalOpenCreate", true);
    const handleCloseCreateModal = () => {
        setValue("modalOpenCreate", false);
        refetch();
    };
    return (
        <main className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-col md:flex-row justify-center text-gray-700">
                <div className="flex flex-row gap-2 h-14">
                    <ButtonGroup variant="outlined" color="inherit" className="w-full">
                        <Button 
                            variant="outlined" 
                            color="inherit"
                            disableElevation
                            className="!w-full md:!w-auto"
                            endIcon={<FilterAltIcon />}
                            onClick={handleFilterClick} 
                        >
                            Filtros
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error"
                            disableElevation 
                            className="!w-full md:!w-auto"
                            onClick={handleClearFilters}
                        >
                            <FilterAltOffIcon/>
                        </Button>
                    </ButtonGroup>
                    <div className="flex grow"/>
                </div>
                <Menu
                    anchorEl={filterAnchor}
                    open={filterMenuOpen}
                    onClose={handleFilterClose}
                >
                    <MenuItem onClick={handleYearFilterSelect}>Filtrar por Año</MenuItem>
                    <MenuItem onClick={handleProjectSearchFilterSelect}>Buscar por Nombre de Proyecto</MenuItem>
                    <MenuItem onClick={handleProjectStatusFilterSelect}>Filtrar por Estado de Proyecto</MenuItem>
                    <MenuItem onClick={handleProjectTypeFilterSelect}>Filtrar por Tipo de Proyecto</MenuItem>
                    <MenuItem onClick={handleScholarSearchFilterSelect}>Buscar por Nombre de Becario</MenuItem>
                    <MenuItem onClick={handleScholarshipTypeFilterSelect}>Filtrar por Beca</MenuItem>
                    <MenuItem onClick={handleUserCareerFilterSelect}>Filtrar por Carrera</MenuItem>
                </Menu>
                <form className="flex items-center justify-start mt-4 md:mt-0 md:w-2/6">
                    {showProjectSearchForm && (
                        <TextField 
                            id="projectsearch"
                            name="projectsearch"
                            label="Buscar por Nombre de Proyecto"
                            type="search"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            value={normalProjectSearch}
                            onChange={handleProjectSearchFilterChange}
                        />
                    )}
                    {showScholarSearchForm && (
                        <TextField 
                            id="scholarsearch"
                            name="scholarsearch"
                            label="Buscar por Nombre de Becario"
                            type="search"
                            variant="outlined"
                            color="warning"
                            fullWidth
                            value={normalScholarSearch}
                            onChange={handleScholarSearchFilterChange}
                        />
                    )}
                    {showScholarshipTypeFilter && (
                        <TextField 
                            id="scholarship" 
                            name="scholarship" 
                            label="Filtrar por Beca" 
                            type="text" 
                            variant="outlined" 
                            color="warning"
                            select 
                            fullWidth 
                            value={historicscholarshiptype_id} 
                            onChange={handleScholarshipTypeFilterChange}
                        > 
                            {historicscholarships.map(scholarshipprop => (
                                <MenuItem key={scholarshipprop.id} value={scholarshipprop.id}>{scholarshipprop.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                    {showUserCareerFilter && (
                        <TextField 
                            id="career" 
                            name="career" 
                            label="Filtrar por Carrera"
                            type="text"
                            variant="outlined"
                            color="warning"
                            select 
                            fullWidth
                            value={historicusercareer_id} 
                            onChange={handleUserCareerFilterChange}
                        >
                            {historicusercareers.map(usercareerprop => (
                                <MenuItem key={usercareerprop.id} value={usercareerprop.id}>{usercareerprop.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                    {showProjectStatusFilter && (
                        <TextField 
                        id="projectstatus" 
                        name="projectstatus" 
                        label="Filtrar por Estado de Proyecto"
                        type="text"
                        variant="outlined"
                        color="warning"
                        select 
                        fullWidth
                        value={historicprojectstatus_id} 
                        onChange={handleProjectStatusFilterChange}
                    >
                        {historicprojectstatus.map(projectstatusprop => (
                            <MenuItem key={projectstatusprop.id} value={projectstatusprop.id}>{projectstatusprop.name}</MenuItem>
                        ))}
                    </TextField>
                    )}
                    {showProjectTypeFilter && (
                        <TextField 
                        id="projecttype" 
                        name="projecttype" 
                        label="Filtrar por Tipo de Proyecto"
                        type="text"
                        variant="outlined"
                        color="warning"
                        select 
                        fullWidth
                        value={historicprojecttype_id} 
                        onChange={handleProjectTypeFilterChange}
                    >
                        {historicprojecttypes.map(projecttypeprop => (
                            <MenuItem key={projecttypeprop.id} value={projecttypeprop.id}>{projecttypeprop.name}</MenuItem>
                        ))}
                    </TextField>
                    )}
                    {showYearFilter && (
                        <TextField 
                        id="projecttype" 
                        name="projecttype" 
                        label="Filtrar por Año"
                        type="text"
                        variant="outlined"
                        color="warning"
                        select 
                        fullWidth
                        value={yearFilter} 
                        onChange={handleYearFilterChange}
                    >
                        {años.map((año) => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </TextField>
                    )}
                </form>
                <div className="flex grow" />
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => (
                    value && (
                        <span key={key} className="border border-gray-700 p-2 rounded text-xs md:text-sm">
                            {key === "projectsearch" && `Nombre de Proyecto: ${value}`}
                            {key === "scholarsearch" && `Nombre de Becario: ${value}`}
                            {key === "scholarship" && `Beca: ${getHistoricScholarshipNameById(value as number)}`}
                            {key === "career" && `Carrera: ${getHistoricUserCareerNameById(value as number)}`}
                            {key === "projectstatus" && `Estado de Proyecto: ${getHistoricProjectStatusNameById(value as number)}`}
                            {key === "projecttype" && `Tipo de Proyecto: ${getHistoricProjectTypeNameById(value as number)}`}
                            {key === "year" && `Año: ${value}`}
                        </span>
                    )
                ))}
            </div>
            <div className="flex flex-grow custom-scrollbar overflow-y-auto">
                <TableContainer>
                    <Table stickyHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left"
                                    onClick={() => handleSort('hp.name')}
                                    style={{ cursor: 'pointer' }}
                                    width="40%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'hp.name' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Nombre
                                    </div>
                                </TableCell>
                                <TableCell align="center"
                                    onClick={() => handleSort('hp.historicprojecttype_id')}
                                    style={{ cursor: 'pointer' }}
                                    width="20%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'hp.historicprojecttype_id' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Tipo
                                    </div>
                                </TableCell>
                                <TableCell align="center"
                                    onClick={() => handleSort('hp.historicprojectstatus_id')}
                                    style={{ cursor: 'pointer' }}
                                    width="20%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'hp.historicprojectstatus_id' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Estado
                                    </div>
                                </TableCell>
                                <TableCell align="right"
                                    onClick={() => handleSort('hp.year')}
                                    style={{ cursor: 'pointer' }}
                                    width="20%"
                                >
                                    <div className={`text-gray-700 font-medium md:font-bold text-[17px] md:text-lg ${sortColumn === 'hp.year' ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`}>
                                        Año
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
                                        <TableCell align="center" size="small" width="20%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={200} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" size="small" width="20%">
                                            <div className="flex items-center justify-center">
                                                <Skeleton variant="text" width={200} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="right" size="small" width="20%">
                                            <div className="flex items-center justify-end">
                                            <Skeleton variant="text" width={100} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {data && data.projects && data.projects.length > 0 ? (
                                    data.projects.map((row: any) => (
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
                                                        {row.historicprojecttypename}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" size="small">
                                                    <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                        {row.historicprojectstatusname}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right" size="small">
                                                    <div className="text-gray-700 font-medium text-[15px] md:text-lg">
                                                        {row.year}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRowId === row.id && (
                                                <TableRow className="bg-gradient-to-r from-transparent to-transparent via-gray-100">
                                                    <TableCell colSpan={4}>
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex gap-1 text-gray-700 font-medium md:text-[17px]">
                                                                <strong>Descripción: </strong>{row.description}
                                                            </div>
                                                            {Array.isArray(row.historicscholars) && row.historicscholars.length > 0 ? (
                                                                row.historicscholars.map((scholar: any) => (
                                                                    <React.Fragment key={scholar.id}>
                                                                        <Divider className="w-full mt-4"></Divider>
                                                                        <div className="flex gap-1 text-gray-700 font-medium md:text-[17px] mt-4">
                                                                            <strong>Beca: </strong>{scholar.historicscholarshiptypename}
                                                                        </div>
                                                                        <div className="flex gap-1 text-gray-700 font-medium md:text-[17px] mt-4">
                                                                            <strong>Becario: </strong>{scholar.name}
                                                                        </div>
                                                                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>DNI: </strong>{scholar.dni}
                                                                            </div>
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>Legajo: </strong>{scholar.file}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>Carrera: </strong>{scholar.historicusercareername}
                                                                            </div>
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>Año de Cursado: </strong>{scholar.careerlevel}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>Email: </strong>{scholar.email}
                                                                            </div>
                                                                            <div className="flex gap-1 md:w-3/6 text-gray-700 font-medium md:text-[17px]">
                                                                                <strong>Telefono: </strong>{scholar.phone}
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))
                                                            ) : (
                                                                <div>
                                                                    <Divider className="w-full mt-4"></Divider>
                                                                    <div className="flex gap-1 text-gray-700 font-medium md:text-[17px] mt-4">
                                                                        No hay becarios asociados al proyecto.
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" />
                                    </TableRow>
                                )}
                                {Array.from({ length: rowsPerPage - (data?.projects?.length || 0) }).map((_, index) => (
                                    <TableRow key={`empty-row-${index}`}>
                                        <TableCell colSpan={4} />
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
                    count={data?.totalProjects || 0}
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