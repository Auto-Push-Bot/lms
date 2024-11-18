import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from '@tanstack/react-query';
import { deactivateTableData } from '@/app/services/admin/usermanagement/scholar.service';
import { useForm } from 'react-hook-form';
import { deleteModalProps } from '@/app/lib/dtos/scholar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface APIError {
    message?: string,
};

export default function DeleteScholarModal({ open, handleClose, id, name, setValueFeedback }: deleteModalProps) {
    const { handleSubmit } = useForm();
    const [apiError, setApiError] = useState<APIError>({});
    const mutation = useMutation({
        mutationFn: () => deactivateTableData(id),
        onSuccess: (result) => {
            if (result && result.success) {
                setValueFeedback("feedbackMessage", `Invitado eliminado correctamente`);
                setValueFeedback("feedbackSeverity", 'success');
                setValueFeedback("feedbackOpen", true);
                handleClose();
            } else if (result) {
                if (result.apiError) {
                    setApiError(result.apiError);
                };
            };
        },
        onError: () => {
            setValueFeedback("feedbackMessage", `Se ha encontrado un error, por favor, intentalo nuevamente`);
            setValueFeedback("feedbackSeverity", 'error');
            setValueFeedback("feedbackOpen", true);
            handleClose();
        }
    });
    const onSubmit = () => {
        mutation.mutate();
    };
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
                    component: 'form',
                    onSubmit: handleSubmit(onSubmit),
                    onClick: handleDialogClick,
                    elevation: 0,
                    style: { width: '600px', maxWidth: 'none' }
                }} 
            >
                <div className='flex flex-col m-2'>
                    <DialogTitle>
                        <div className='text-gray-700 items-center font-medium text-2xl md:text-3xl mb-2'>
                            ¿Desactivar la cuenta de {name}?
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className='flex flex-col w-full pt-4 gap-4'>
                            <div className='text-gray-700 font-medium text-xl mb-2'>
                                Esto inhabilitará la cuenta del becario, ¿Esta seguro?
                            </div>
                            {apiError.message && <Alert severity="error" sx={{ fontSize: '1.05rem' }}>{apiError.message}</Alert>}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-row m-3'>
                            <div className='flex flex-row justify-center gap-4'>
                                <Button variant="contained"  color="error" disableElevation endIcon={<CloseIcon />} onClick={handleClose}>CANCELAR</Button>
                                <Button variant="contained"  color="success" disableElevation endIcon={mutation.isPending ? <CircularProgress color="warning" size={26}/> : <DeleteForeverIcon />} type="submit" disabled={mutation.isPending}>DESHABILITAR</Button>
                            </div>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
    );
};