import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const renovations = await prisma.renovation.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(renovations);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch renovations' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File;

        if (!file || !title || !description) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(uploadPath, buffer);

        const imagePath = `/uploads/${filename}`;

        const renovation = await prisma.renovation.create({
            data: {
                title,
                description,
                image: imagePath,
            },
        });

        return NextResponse.json({ success: true, renovation });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
