import HistoricTable from "@/app/components/guest/historic/table";
import { auth } from "@/app/lib/auth";
import { getHistoricProjectStatuses } from "@/app/lib/queries/historicprojectstatus";
import { getHistoricProjectTypes } from "@/app/lib/queries/historicprojecttype";
import { getHistoricScholarshipTypes } from "@/app/lib/queries/historicscholarshiptype";
import { getHistoricUserCareers } from "@/app/lib/queries/historicusercareer";
import { redirect } from "next/navigation";

export default async function HistoricoInvitados() {
    const session = await auth();
    if (!session?.user) redirect("/");

    const laboratory_id = session?.user?.laboratory_id as number;
    const historicussercareers = await getHistoricUserCareers();
    const historicscholarships = await getHistoricScholarshipTypes();
    const historicprojecttypes = await getHistoricProjectTypes();
    const historicprojectstatus = await getHistoricProjectStatuses();

    return (
        <main className="flex flex-col w-full h-full px-4 md:px-6 md:py-6">
            <div className="flex flex-col items-center justify-center text-3xl text-gray-700 text-center font-bold h-[10%]">
                <p>
                    Historico de Proyectos
                </p>
            </div>
            <div className="flex flex-col items-center justify-center h-[90%]">
                <HistoricTable
                    laboratory_id={laboratory_id}
                    historicusercareers={historicussercareers}
                    historicscholarships={historicscholarships}
                    historicprojecttypes={historicprojecttypes}
                    historicprojectstatus={historicprojectstatus}
                />
            </div>
        </main>
    );
};
