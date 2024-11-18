import ProjectTable from "@/app/components/scholar/projects/table";
import { auth } from "@/app/lib/auth";
import { getProjectStatuses } from "@/app/lib/queries/projectstatus";
import { getProjectTypes } from "@/app/lib/queries/projecttype";
import { redirect } from "next/navigation";

export default async function Proyectos() {
    const session = await auth();
    if (!session?.user) redirect("/");
    const laboratory_id = session?.user?.laboratory_id as number;
    const projecttypes = await getProjectTypes();
    const projectstatuses = await getProjectStatuses();
    const current_id = session?.user?.id;
    const current_id_number = Number(current_id);
    return (
        <main className="flex flex-col w-full h-full px-4 md:px-6 md:py-6">
            <div className="flex flex-col items-center justify-center text-3xl text-gray-700 text-center font-bold h-[10%]">
                <p>
                    Proyectos
                </p>
            </div>
            <div className="flex flex-col items-center justify-center h-[90%]">
                <ProjectTable
                    laboratory_id={laboratory_id}
                    projecttypes={projecttypes}
                    projectstatuses={projectstatuses}
                    current_id={current_id_number}
                />
            </div>
        </main>
    );
};