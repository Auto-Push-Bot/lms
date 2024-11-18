import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import GuestInventoryTable from "@/app/components/guest/inventory/table";

export default async function InventarioInvitados() {
    const session = await auth();
    if (!session?.user) redirect("/");
    
    const laboratory_id = session?.user?.laboratory_id as number;

    return (
        <main className="flex flex-col w-full h-full px-4 md:px-6 md:py-6">
            <div className="flex flex-col items-center justify-center text-3xl text-gray-700 text-center font-bold h-[10%]">
                <p>
                    Inventario
                </p>
            </div>
            <div className="flex flex-col items-center justify-center h-[90%]">
                <GuestInventoryTable 
                    laboratory_id={laboratory_id} 
                />
            </div>
        </main>
    );
};