"use client"

import { fetchTaskById } from "@/app/services/projects/projects.service";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@tanstack/react-query";
import EditTaskForm from "./taskedit/taskedit-form";
import TaskObservationTable from "./taskobservation/observationtable";
import { useForm } from "react-hook-form";
import FeedbackSnackbar from "@/app/components/feedback";

export default function TaskPage({ task_id, project_id, current_id }: { task_id: number, project_id: number, current_id: number }) {
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
        <div className="flex flex-col w-full h-full">
            <div className="flex h-full pr-2 gap-4 md:gap-2 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col md:flex-row w-full h-full gap-4">
                    <div className="flex flex-grow md:w-[48%]">
                        <EditTaskForm
                            id={task_id}
                            project_id={project_id}
                            setValueFeedback={setValueFeedback}
                        />
                    </div>
                    <div className="flex flex-grow md:w-[48%]">
                        <TaskObservationTable
                            project_id={project_id}
                            task_id={task_id}
                            current_id={current_id}
                            setValueFeedback={setValueFeedback}
                        />
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