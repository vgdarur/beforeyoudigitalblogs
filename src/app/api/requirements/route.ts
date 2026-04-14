import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';

// Define the absolute path to the REQUIREMENTS.md file in the project root
const reqFilePath = path.join(process.cwd(), 'REQUIREMENTS.md');

export async function GET() {
    const session = await getServerSession();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        if (fs.existsSync(reqFilePath)) {
            const content = fs.readFileSync(reqFilePath, 'utf8');
            return NextResponse.json({ content });
        }
        return NextResponse.json({ content: '# Project Requirements\n\nNo requirements tracked yet.' });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to read requirements.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { content } = body;
        
        fs.writeFileSync(reqFilePath, content, 'utf8');
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to save requirements.' }, { status: 500 });
    }
}
