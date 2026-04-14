import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt";

// Safely initialize Prisma with the Pooler & SSL
const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Check if the password matches the hashed password in the DB
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                // NEW: The Verification Lockdown
                if (!user.emailVerified) {
                    throw new Error("Please verify your email before logging in.");
                }

                // Return the user object to be saved in the session
                return {
                    id: user.id,
                    email: user.email,
                    isNewUser: user.isNewUser,
                    selectedDomains: user.selectedDomains
                };
            }
        })
    ],
    callbacks: {
        // This attaches the user's domains to their active session token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isNewUser = (user as any).isNewUser;
                token.selectedDomains = (user as any).selectedDomains;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).isNewUser = token.isNewUser;
                (session.user as any).selectedDomains = token.selectedDomains;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', // We will build this custom page next!
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };