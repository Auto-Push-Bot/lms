import { getUserByEmail, verifyUserEmail } from "@/app/lib/queries/user";
import { getStatusActive } from "@/app/lib/queries/userstatus";
import { deleteVerificationToken, getVerificationTokenByToken } from "@/app/lib/queries/validationtoken";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try{
        const url = new URL(request.url);
        const token = url.searchParams.get('token') as string;
        if (!token) {
            return new Response("No se encontro el Token", { status: 400 });
        }
        const databaseToken = await getVerificationTokenByToken(token);
        if (!databaseToken) {
            return new Response("No se encontro el Token", { status: 400 });
        }
        if (databaseToken.expires_at < new Date()){
            return new Response("Token expirado", { status: 400 });
        }
        const user = await getUserByEmail(databaseToken.email);
        if (user?.emailVerified) {
            return new Response("Email ya verificado")
        } else {
            const status = await getStatusActive();
            await verifyUserEmail(databaseToken.email, status);
        }
        await deleteVerificationToken(databaseToken.email);
        return NextResponse.redirect(new URL("/login?verified=true", request.url));
    } catch (error) {
        console.error("Error manejando GET:", error);
        return new NextResponse("Error manejando GET", { status: 500 });
    }; 
};