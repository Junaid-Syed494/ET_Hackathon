import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Safely initialize Prisma
const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // 2. Hash the password & generate a secure random token
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomBytes(32).toString('hex');

        // 3. Save the unverified user to the database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verifyToken: verifyToken,
                // emailVerified is left null by default based on our schema
            }
        });

        // 4. Fire the Email using Nodemailer (Bulletproof Config)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for port 465, prevents network interception
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // This prevents local Indian ISP/Campus routers from failing the SSL check
            tls: {
                rejectUnauthorized: false
            }
        });

        const verificationLink = `http://localhost:3000/api/auth/verify?token=${verifyToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your account - IndicIntel Terminal",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Welcome to the Terminal</h2>
                    <p>You requested an invite. To activate your feed and select your intelligence domains, please verify your email address by clicking the link below.</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify My Email</a>
                    <p style="margin-top: 30px; font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Registration successful. Please check your email to verify." }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}