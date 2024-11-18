import { auth } from "@/app/lib/auth";
import { getSupplyStatuses } from "@/app/lib/queries/supplystatus";
import { getSupplyTypes } from "@/app/lib/queries/supplytype";
import { redirect } from "next/navigation";
import ABMInventoryTable from "@/app/components/admin/inventory/table";

export default async function Inventario() {
    const session = await auth();
    if (!session?.user) redirect("/");
    const laboratory_id = session?.user?.laboratory_id as number;
    const supplytypes = await getSupplyTypes();
    const supplystatus = await getSupplyStatuses();
    return (
        <main className="flex flex-col w-full h-full px-4 md:px-6 md:py-6">
            <div className="flex flex-col items-center justify-center text-3xl text-gray-700 text-center font-bold h-[10%]">
                <p>
                    Inventario
                </p>
            </div>
            <div className="flex flex-col items-center justify-center h-[90%]">
                <ABMInventoryTable 
                    laboratory_id={laboratory_id} 
                    supplystatuses={supplystatus} 
                    supplytypes={supplytypes}
                />
            </div>
        </main>
    );
};