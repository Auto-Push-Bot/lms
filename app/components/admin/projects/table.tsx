"use client"

import React, { useCallback, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import TablePagination from '@mui/material/TablePagination';
import debounce from "lodash.debounce";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Masonry from '@mui/lab/Masonry';
import { ButtonGroup, Card, CardActionArea, CardContent, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import '@/app/components/globals.css';
import { fetchTableProjectsData, projectFormData, projectsTableProps } from "@/app/lib/dtos/project";
import { fetchTableData } from "@/app/services/projects/projects.service";
import { CircularProgressWithLabel, MasonrySkeleton } from "./utils";
import CreateProjectModal from "./createmodal";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteProjectModal from "./deletemodal";
import FeedbackSnackbar from "../../feedback";

export default function ABMProjectTable({ usercareers, scholarships, projecttypes, projectstatuses, laboratory_id }: projectsTableProps) {
    const { watch, setValue, getValues } = useForm<projectFormData>({
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
            scholarSearch: "",
            normalScholarSearch: "",
            showScholarSearchForm: false,
            scholarshipTypeFilter: 0,
            showScholarshipTypeFilter: false,
            userCareerFilter: 0,
            showUserCareerFilter: false,
            //pagination
            page: 0,
            rowsPerPage: 6,
            //selected row
            selectedRowId: 0,
            selectedRowName: "",
            //modals
            modalOpenCreate: false,
            modalOpenDelete: false,
        }
    });
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    //router init
    const router = useRouter();
    //filters
    const filterAnchor = watch("filterAnchor") as any;
    const filterMenuOpen = Boolean(filterAnchor);
    const activeFilters = watch("activeFilters") as { [key: string]: any };
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
        setValue("scholarSearch", "");
        setValue("normalScholarSearch", "");
        setValue("scholarshipTypeFilter", 0);
        setValue("userCareerFilter", 0);
        //reset default filter show
        setValue("showProjectSearchForm", true);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
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
    const projecttype_id = watch("projectTypeFilter") as number;
    const showProjectTypeFilter = watch("showProjectTypeFilter") as boolean;
    const handleProjectTypeFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", true);
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
    const getProjectTypeNameById = (id: number) => {
        const projecttype = projecttypes.find(sch => sch.id === id);
        return projecttype ? projecttype.name : 'Desconocida';
    };
    //projecttype filter
    const projectstatus_id = watch("projectStatusFilter") as number;
    const showProjectStatusFilter = watch("showProjectStatusFilter") as boolean;
    const handleProjectStatusFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", true);
        setValue("showProjectTypeFilter", false);
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
    const getProjectStatusNameById = (id: number) => {
        const projectstatus = projectstatuses.find(sch => sch.id === id);
        return projectstatus ? projectstatus.name : 'Desconocida';
    };
    //scholar search
    const scholarSearch = watch("scholarSearch") as string;
    const normalScholarSearch = watch("normalScholarSearch") as string;
    const showScholarSearchForm = watch("showScholarSearchForm") as boolean;
    const handleScholarSearchFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
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
    const scholarshiptype_id = watch("scholarshipTypeFilter") as number;
    const showScholarshipTypeFilter = watch("showScholarshipTypeFilter") as boolean;
    const handleScholarshipTypeFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
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
    const getScholarshipNameById = (id: number) => {
        const scholarship = scholarships.find(sch => sch.id === id);
        return scholarship ? scholarship.name : 'Desconocida';
    };
    //usercareer filter
    const usercareer_id = watch("userCareerFilter") as number;
    const showUserCareerFilter = watch("showUserCareerFilter") as boolean;
    const handleUserCareerFilterSelect = () => {
        setValue("showProjectSearchForm", false);
        setValue("showProjectStatusFilter", false);
        setValue("showProjectTypeFilter", false);
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
    const getUserCareerNameById = (id: number) => {
        const career = usercareers.find(sch => sch.id === id);
        return career ? career.name : 'Desconocida';
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
        projectstatus_id: projectstatus_id,
        projecttype_id: projecttype_id,
        scholarSearch: scholarSearch,
        usercareer_id: usercareer_id,
        scholarshiptype_id: scholarshiptype_id,
        laboratory_id: laboratory_id,
        page: page,
        rowsPerPage: rowsPerPage,
    } as fetchTableProjectsData;
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['tableData', projectSearch, projectstatus_id, projecttype_id, scholarSearch, usercareer_id, scholarshiptype_id, page, rowsPerPage],
        queryFn: () => fetchTableData(params),
        refetchOnWindowFocus: false
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
    }, [isError])
    //card click
    const handleCardClick = (id: number) => {
        router.push(`/admin/projects/${id}`);
    };
    //modals
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
    };
    const handleCloseDeleteModal = () => {
        setValue("modalOpenDelete", false);
        refetch();
    };
    //feedback
    const feedbackOpen = watchFeedback("feedbackOpen");
    const feedbackSeverity = watchFeedback("feedbackSeverity");
    const feedbackMessage = watchFeedback("feedbackMessage");
    const handleFeedbackClose = () => {
        setValueFeedback("feedbackOpen", false);
    };
    return (
        <main className="flex flex-col gap-2 w-full h-full">
            <div className="flex flex-col md:flex-row justify-center text-gray-700">
                <div className="flex flex-row gap-2 h-14">
                    <ButtonGroup variant="outlined" color="inherit">
                        <Button
                            variant="outlined"
                            color="inherit"
                            disableElevation
                            endIcon={<FilterAltIcon />}
                            onClick={handleFilterClick}
                        >
                            Filtros
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            disableElevation
                            onClick={handleClearFilters}
                        >
                            <FilterAltOffIcon />
                        </Button>
                    </ButtonGroup>
                    <div className="flex grow" />
                    <div className="flex block md:hidden">
                        <Button
                            variant="contained"
                            color="success"
                            disableElevation
                            endIcon={<AddIcon />}
                            onClick={handleOpenCreateModal}
                        >
                            Añadir
                        </Button>
                    </div>
                </div>
                <Menu
                    anchorEl={filterAnchor}
                    open={filterMenuOpen}
                    onClose={handleFilterClose}
                >
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
                            value={scholarshiptype_id}
                            onChange={handleScholarshipTypeFilterChange}
                        >
                            {scholarships.map(scholarshipprop => (
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
                            value={usercareer_id}
                            onChange={handleUserCareerFilterChange}
                        >
                            {usercareers.map(usercareerprop => (
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
                            value={projectstatus_id}
                            onChange={handleProjectStatusFilterChange}
                        >
                            {projectstatuses.map(projectstatusprop => (
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
                            value={projecttype_id}
                            onChange={handleProjectTypeFilterChange}
                        >
                            {projecttypes.map(projecttypeprop => (
                                <MenuItem key={projecttypeprop.id} value={projecttypeprop.id}>{projecttypeprop.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                </form>
                <div className="flex grow" />
                <div className="md:flex hidden md:block">
                    <Button
                        variant="contained"
                        color="success"
                        disableElevation
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateModal}
                    >
                        Añadir
                    </Button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => (
                    value && (
                        <span key={key} className="border border-gray-700 p-2 rounded text-xs md:text-sm">
                            {key === "projectsearch" && `Nombre de Proyecto: ${value}`}
                            {key === "scholarsearch" && `Nombre de Becario: ${value}`}
                            {key === "scholarship" && `Beca: ${getScholarshipNameById(value as number)}`}
                            {key === "career" && `Carrera: ${getUserCareerNameById(value as number)}`}
                            {key === "projectstatus" && `Estado de Proyecto: ${getProjectStatusNameById(value as number)}`}
                            {key === "projecttype" && `Tipo de Proyecto: ${getProjectTypeNameById(value as number)}`}
                        </span>
                    )
                ))}
            </div>
            <div className="flex flex-grow custom-scrollbar overflow-y-auto">
                <TableContainer>
                    <Table stickyHeader>
                        {isLoading ? (
                            <TableBody>
                                <TableRow>
                                    <MasonrySkeleton />
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <Masonry columns={{ xs: 1, md: 3 }} spacing={1}>
                                        {data && data.projects && data.projects.length > 0 ? (
                                            data.projects.map((row: any) => {
                                                let projectprogress;
                                                if (row.projecttaskcount && row.completedprojecttaskcount && row.projecttaskcount > 0) {
                                                    projectprogress = (row.completedprojecttaskcount / row.projecttaskcount) * 100;
                                                } else {
                                                    projectprogress = 0;
                                                };
                                                return (
                                                    <React.Fragment key={row.id}>
                                                        <Card className="flex flex-col shadow-none border border-gray-400">
                                                            <CardActionArea onClick={() => handleCardClick(row.id)}>
                                                                <CardContent>
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="flex flex-row items-center">
                                                                            <div className="flex text-gray-700 font-medium md:font-bold text-[17px] md:text-lg">
                                                                                {row.name}
                                                                            </div>
                                                                            <div className="flex flex-grow" />
                                                                            <CircularProgressWithLabel value={projectprogress} color="warning" />
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    handleOpenDeleteModal(row.id, row.name);
                                                                                }}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className="flex flex-row gap-6">
                                                                            <div className="flex gap-1 text-gray-700 font-medium text-[15px] md:text-lg">
                                                                                <strong>Tipo: </strong>{row.projecttypename}
                                                                            </div>
                                                                            <div className="flex gap-1 text-gray-700 font-medium text-[15px] md:text-lg">
                                                                                <strong>Estado: </strong>{row.projectstatusname}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-grow text-gray-700 font-medium text-[15px] md:text-lg">
                                                                            {row.description}
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </Card>
                                                    </React.Fragment>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" />
                                            </TableRow>
                                        )}
                                    </Masonry>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </div>
            <div className="flex justify-end items-end overflow-x-hide">
                <TablePagination
                    rowsPerPageOptions={[3, 6, 12, 18, 24]}
                    component="div"
                    count={data?.totalProjects || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Tarjetas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
            </div>
            <DeleteProjectModal
                open={modalOpenDelete}
                handleClose={handleCloseDeleteModal}
                id={selectedRowId!}
                name={selectedRowName!}
                setValueFeedback={setValueFeedback}
            />
            <CreateProjectModal
                open={modalOpenCreate}
                handleClose={handleCloseCreateModal}
                projecttypes={projecttypes}
                projectstatuses={projectstatuses}
                laboratory_id={laboratory_id}
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