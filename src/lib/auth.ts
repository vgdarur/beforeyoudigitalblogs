import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login', // unified login page
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    return null;
                }

                // Check for bcrypt hashed password vs plaintext
                let isValid = false;
                if (user.password.startsWith('$2')) {
                    isValid = await bcrypt.compare(credentials.password, user.password);
                } else {
                    isValid = credentials.password === user.password;
                }

                if (!isValid) {
                    return null;
                }

                // Map legacy SUPERADMIN role to ADMIN
                const sessionRole = user.role === 'SUPERADMIN' ? 'ADMIN' : user.role;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: sessionRole
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role || 'USER';
                token.id = user.id;
                
                if (user.email === 'vgdarur@gmail.com') {
                    token.role = 'ADMIN';
                    // Synchronize with database asynchronously
                    if (user.id) {
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
