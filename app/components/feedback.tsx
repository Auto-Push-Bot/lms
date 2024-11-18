import Alert from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
};

export default function FeedbackSnackbar({ open, onClose, severity, message }: { open: boolean, onClose: () => void, severity: "success" | "error", message: string }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            TransitionComponent={SlideTransition}
            onClose={onClose}
            anchorOrigin={{ 
                vertical: 'bottom', 
                horizontal: isMobile ? 'center' : 'right'
            }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};