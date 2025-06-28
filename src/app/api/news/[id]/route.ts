// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const id = Number(context.params.id);

        const item = await prisma.news.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    try {
        const id = Number(context.params.id);
        const body = await req.json(); // 👈 Parse JSON instead of formData

        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updated = await prisma.news.update({
            where: { id },
            data: {
                title,
                content: content.slice(0, 255),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    try {
        const id = Number(context.params.id);
        const formData = await req.formData();

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updated = await prisma.news.update({
            where: { id },
            data: {
                title,
                content: content.slice(0, 255), // Adjust length if needed
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}