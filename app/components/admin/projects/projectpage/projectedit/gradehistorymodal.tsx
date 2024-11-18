"use client"

import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import { gradeHistoryModalProps } from '@/app/lib/dtos/project';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectGrades } from '@/app/services/projects/projects.service';

export default function GradeHistoricModal({ open, handleClose, id, setValueFeedback }: gradeHistoryModalProps) {
    //fetch
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['tableData', id],
        queryFn: () => fetchProjectGrades(id),
        refetchOnWindowFocus: false
    });
    useEffect(() => {
        if (isError) {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error recuperando la información, por favor, recarga la página`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
        };
        if (open) {
            refetch();
        };
    }, [isError, open])
    const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            maxWidth={false}
            fullWidth
            PaperProps={{
                onClick: handleDialogClick,
                elevation: 0,
                style: { width: '600px', maxWidth: 'none' }
            }}
        >
            <div className='flex flex-col h-full m-2'>
                <DialogTitle>
                    <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                        Historial de Calificaciones
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col w-full h-full pt-4 gap-4 overflow-y-auto custom-scrollbar'>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" width="50%">
                                            <div className="text-gray-700 font-medium md:font-bold text-lg">
                                                Fecha
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" width="50%">
                                            <div className="text-gray-700 font-medium md:font-bold text-lg">
                                                Calificación
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                {isLoading ? (
                                    <TableBody>
                                        {Array.from({ length: 12 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center" size="small" width="50%">
                                                    <div className="flex items-center justify-center">
                                                        <Skeleton variant="text" width={200} />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" size="small" width="50%">
                                                    <div className="flex items-center mr-2 justify-center">
                                                        <Skeleton variant="text" width={200} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {data && data.length > 0 ? (
                                            data.map((row: any) => (
                                                <TableRow key={row.id}>
                                                    <TableCell align="center" size="small" width="50%">
                                                        <div className="text-gray-700 font-medium text-lg">
                                                            {new Date(row.date).toLocaleDateString('es-AR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center" size="small" width="50%">
                                                        <div className="text-gray-700 font-medium text-lg">
                                                            {row.name}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell align="center" size="small" colSpan={2}>
                                                    <div className="text-gray-700 font-medium text-lg">
                                                        Este proyecto aun no ha sido calificado
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row m-3'>
                        <div className='flex flex-row justify-center gap-4'>
                            <Button variant="contained" color="error" disableElevation endIcon={<CloseIcon />} onClick={handleClose}>CERRAR</Button>
                        </div>
                    </div>
                </DialogActions>
            </div >
        </Dialog >
    );
};