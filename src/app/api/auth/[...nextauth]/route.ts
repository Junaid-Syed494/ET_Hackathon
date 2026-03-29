import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize Prisma with the V7 Postgres Adapter
const connectionString = "postgresql://postgres:ET_Intelligence@2026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export const authOptions: NextAuthOptions = {
    // This tells NextAuth to use our custom login page instead of the default one
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                // 1. Check if the user already exists in our database
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                // 2. HACKATHON TRICK: Auto-Register if they don't exist!
                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            password: hashedPassword,
                            isNewUser: true, // Flags them to go to the Onboarding questionnaire
                        }
                    });
                    return newUser;
                }

                // 3. If they DO exist, verify their password
                const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return existingUser;
            }
        })
    ],
    callbacks: {
        // This attaches the user's database info to their secure web token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.persona = (user as any).persona;
                token.isNewUser = (user as any).isNewUser;
            }
            return token;
        },
        // This passes the token data to the frontend so our UI can read it
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).persona = token.persona;
                (session.user as any).isNewUser = token.isNewUser;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };