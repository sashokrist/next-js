// ✅ Set Node.js runtime at the very top
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const news = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6,
        });

        return NextResponse.json(news);
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const titleRaw = formData.get('title');
        const contentRaw = formData.get('content');
        const fileRaw = formData.get('image');

        if (
            typeof titleRaw !== 'string' ||
            typeof contentRaw !== 'string' ||
            !(fileRaw instanceof File)
        ) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        // ✅ Optional: truncate long input to match DB constraints
        const title = titleRaw.slice(0, 255);
        const content = contentRaw.slice(0, 10000); // adjust if needed

        // ✅ Prepare upload directory
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // ✅ Save file
        const buffer = Buffer.from(await fileRaw.arrayBuffer());
        const fileName = `${Date.now()}-${fileRaw.name}`;
        const filePath = path.join(uploadsDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;

        // ✅ Create the news entry
        const news = await prisma.news.create({
            data: {
                title,
                content,
                image: imageUrl,
            },
        });

        return NextResponse.json({ success: true, news }, { status: 201 });
    } catch (error) {
        console.error('Failed to create news:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}