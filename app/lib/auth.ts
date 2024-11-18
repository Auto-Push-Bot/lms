import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./queries/user";
import bcrypt from 'bcryptjs';
import { user } from "./dtos/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        credentials({
            async authorize(credentials) {
                if ( credentials === null ) return null;
                try {
                    const user = await getUserByEmail(credentials?.email as string) as user;
                    if (user) {
                        const hashedPassword = user.password;
        
                        const isMatch = await bcrypt.compare(
                        credentials.password as string,
                        hashedPassword
                        );
                        if (isMatch) {            
                            return user;
                        } else {
                            throw new Error("Contraseña incorrecta");
                        }
                    } else {
                        throw new Error("Usuario no encontrado");
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error("Error desconocido, la cagaste");                        
                    }
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user as unknown as user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as user;
            }
            return session;
        }
    }
})