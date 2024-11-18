"use client"

import Divider from "@mui/material/Divider";
import ProjectScholarTable from "./projectscholar/scholartable";
import ProjectObservationTable from "./projectobservation/observationtable";
import ProjectTaskTable from "./projecttask/tasktable";
import { useForm } from "react-hook-form";
import FeedbackSnackbar from "@/app/components/feedback";
import ProjectInfoForm from "./projectedit/projectinfo";

interface pageProps {
    id: number
    current_id: number
};

export default function ScholarProjectPage({ id, current_id }: pageProps) {
    //feedback
    const { watch: watchFeedback, setValue: setValueFeedback } = useForm({
        defaultValues: {
            feedbackOpen: false,
            feedbackSeverity: "error" as "success" | "error",
            feedbackMessage: "",
        }
    });
    const feedbackOpen = watchFeedback("feedbackOpen");
    const feedbackSeverity = watchFeedback("feedbackSeverity");
    const feedbackMessage = watchFeedback("feedbackMessage");
    const handleFeedbackClose = () => {
        setValueFeedback("feedbackOpen", false);
    };
    return (
        <div className="flex w-full h-full">
            <div className="flex w-full h-full overflow-y-auto custom-scrollbar">
                <div className="flex flex-col w-full h-[200%] md:h-[150%] pr-2 gap-4 md:gap-2">
                    <div className="flex flex-col md:flex-row w-full h-[100%] md:h-[50%] gap-4">
                        <div className="flex flex-grow md:w-[50%] h-full">
                            <ProjectInfoForm
                                id={id}
                                setValueFeedback={setValueFeedback}
                            />
                        </div>
                        <div className="block md:hidden">
                            <Divider className="w-full mb-4"></Divider>
                        </div>
                        <div className="flex flex-grow md:w-[50%] h-full">
                            <ProjectScholarTable
                                id={id}
                                setValueFeedback={setValueFeedback}
                            />
                        </div>
                    </div>
                    <Divider className="flex w-full"></Divider>
                    <div className="flex flex-col md:flex-row w-full h-[50%] gap-4">
                        <div className="flex flex-grow">
                            <ProjectObservationTable
                                id={id}
                                current_id={current_id}
                                setValueFeedback={setValueFeedback}
                            />
                        </div>
                    </div>
                    <Divider className="flex w-full"></Divider>
                    <div className="flex flex-col md:flex-row w-full h-[50%] gap-4">
                        <div className="flex flex-grow">
                            <ProjectTaskTable
                                id={id}
                                current_id={current_id}
                                setValueFeedback={setValueFeedback}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackSnackbar
                open={feedbackOpen}
                onClose={handleFeedbackClose}
                severity={feedbackSeverity}
                message={feedbackMessage}
            />
        </div>
    );
};