import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const location = formData.get('location') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const file = formData.get('image') as File;

        if (!file || !title || !location || !description || isNaN(price)) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(uploadPath, buffer);

        const imagePath = `/uploads/${filename}`;

        const prisma = (await import('@/lib/prisma')).default;
        const property = await prisma.property.create({
            data: {
                title,
                location,
                price,
                description,
                image: imagePath,
            },
        });

        return NextResponse.json({ success: true, property });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
