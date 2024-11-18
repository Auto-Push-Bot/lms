import UserTabs from "@/app/components/admin/usermanagement/usertabs";
import { auth } from "@/app/lib/auth";
import { getScholarshipTypes } from "@/app/lib/queries/scholarshiptype";
import { getUserCareers } from "@/app/lib/queries/usercareer";
import { redirect } from "next/navigation";

export default async function ABMusuarios() {
    const session = await auth();
    if (!session?.user) redirect("/");
    const laboratory_id = session?.user?.laboratory_id as number;
    const usercareers = await getUserCareers(); 
    const scholarships = await getScholarshipTypes();   
    return (
        <main className="flex flex-col w-full h-full">
            <UserTabs 
                usercareers={usercareers}
                scholarships={scholarships}
                laboratory_id={laboratory_id}
            />       
        </main>
    );
};