import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";
import { user } from "./dtos/user";

declare module "next-auth" {
    interface Session {
        user: user;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: user;
    }
}