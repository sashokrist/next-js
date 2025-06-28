import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const item = await prisma.news.findUnique({
        where: { id: Number(id) },
    });

    return NextResponse.json(item);
}