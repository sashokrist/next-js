import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File;

        if (!file || !title || !description) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public/uploads', fileName);

        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;

        await prisma.news.create({
            data: { title, content: description, image: imageUrl },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to create news:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
