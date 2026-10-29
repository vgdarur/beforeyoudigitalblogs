import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json({ error: 'ADMIN_PASSWORD environment variable is not configured' }, { status: 400 });
        }

        // Check if admin already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Admin already exists. Delete this route.' });
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await prisma.user.create({
            data: {
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            }
        });

        return NextResponse.json({
            message: 'First admin created successfully!',
            email: newAdmin.email
        });

    } catch (error) {
        console.error('Setup failed:', error);
        return NextResponse.json({ error: 'Failed to create initial admin' }, { status: 500 });
    }
}
