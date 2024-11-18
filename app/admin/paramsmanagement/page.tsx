import ABMTabs from "@/app/components/admin/paramsmanagement/abmtabs";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";


export default async function ABMinicio() {
    const session = await auth();
    if (!session?.user) redirect("/");
    return (
        <main className="flex flex-col w-full h-full">
            <ABMTabs />       
        </main>
    );
};