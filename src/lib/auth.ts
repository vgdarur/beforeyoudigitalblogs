import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";

const ADMIN_EMAILS = [
    'vgdarur@gmail.com',
    'anirudh.enigma@gmail.com',
    'pruthvi.ks49@gmail.com',
    'Pruthvi.ks49@gmail.com',
    'admin@example.com',
    'admin@beforeyoudigitalblogs.com'
];

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login', // unified login page
    },
    providers: [
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                allowDangerousEmailAccountLinking: true,
            })
        ] : []),
        ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
            FacebookProvider({
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            })
        ] : []),
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const emailInput = credentials.email.trim().toLowerCase();
                const passInput = credentials.password;

                const masterAdminEmail = (process.env.ADMIN_EMAIL || "vgdarur@gmail.com").toLowerCase();
                const masterAdminPass = process.env.ADMIN_PASSWORD;

                // 1. Direct Master Admin Check (Bypasses remote DB so quota or network issues never lock out admin)
                const isMasterEmail = emailInput === masterAdminEmail || ADMIN_EMAILS.some(e => e.toLowerCase() === emailInput);
                const isMasterPass = Boolean(masterAdminPass && passInput === masterAdminPass);

                if (isMasterEmail && isMasterPass) {
                    return {
                        id: "admin-master",
                        email: emailInput,
                        name: "Administrator",
                        role: "ADMIN"
                    };
                }

                // 2. Safe Database Fallback Check (Wrapped in try/catch to protect against Neon quota error)
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: emailInput }
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    // Check for bcrypt hashed password vs plaintext
                    let isValid = false;
                    if (user.password.startsWith('$2')) {
                        isValid = await bcrypt.compare(passInput, user.password);
                    } else {
                        isValid = passInput === user.password;
                    }

                    if (!isValid) {
                        return null;
                    }

                    // Map legacy SUPERADMIN role to ADMIN
                    const sessionRole = (user.role === 'SUPERADMIN' || isMasterEmail) ? 'ADMIN' : user.role;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: sessionRole
                    };
                } catch (dbError) {
                    console.warn("Database lookup failed during credentials authentication (quota or network):", dbError);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role || 'USER';
                token.id = user.id;
                
                const userEmail = (user.email || '').toLowerCase();
                if (userEmail && ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail)) {
                    token.role = 'ADMIN';
                    // Synchronize with database asynchronously if accessible
                    if (user.id && user.id !== 'admin-master') {
                        prisma.user.update({
                            where: { id: user.id },
                            data: { role: 'ADMIN' }
                        }).catch(() => {});
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    }
};
