import TaskPage from '@/app/components/admin/projects/projectpage/projecttask/taskpage/taskpage';
import { auth } from '@/app/lib/auth';
import { getProjectName } from '@/app/lib/queries/project';
import { getTaskName } from '@/app/lib/queries/task';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Link from "next/link";
import { redirect } from 'next/navigation';

export default async function TareaDetalle({ params }: { params : { id: number, task_id: number } }) {
    const projectname = await getProjectName(params.id);
    const taskname = await getTaskName(params.task_id);
    const session = await auth();
    if (!session?.user) redirect("/");
    const current_id_string = session?.user?.id; 
    const current_id_number = Number(current_id_string);
    return (
        <main className="flex flex-col w-full h-full">
            <div className="flex flex-row h-20 h-[10%] bg-gray-700 md:bg-gradient-to-l md:from-gray-800 md:to-gray-700 border-b-4 border-orange-500 md:border-transparent md:hover:bg-gradient-to-r md:hover:from-orange-500 md:hover:to-gray-800 text-white items-center">
                <Link href={`/admin/projects/${params.id}`} className="flex flex-row w-[25%]">
                    <KeyboardArrowLeftIcon className="ml-4"/>
                    <p className="ml-2">
                        ATRAS
                    </p>
                </Link>
                <div className="flex flex-grow items-center justify-end text-xl md:text-2xl text-white text-right font-semibold mr-4 md:mr-10">
                    <p>
                        {projectname} - {taskname} 
                    </p>
                </div>
            </div>
            <div className="flex flex-col w-full px-4 py-4 md:px-6 md:py-6 h-[90%]">
                <TaskPage 
                    task_id={params.task_id}
                    project_id={params.id}
                    current_id={current_id_number}
                />
            </div>
        </main>
    );
};