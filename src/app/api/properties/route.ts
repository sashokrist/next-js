import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ Create a new property with image uploads
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const title = formData.get('title') as string;
        const location = formData.get('location') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const images = formData.getAll('images[]') as File[];

        if (!title || !location || !description || isNaN(price) || images.length === 0) {
            return NextResponse.json({ error: 'Missing fields or no images uploaded' }, { status: 400 });
        }

        const selectedImages = images.slice(0, 6);
        const savedImagePaths: string[] = [];

        for (const file of selectedImages) {
            if (!file || typeof file.name !== 'string') continue;

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

            await writeFile(uploadPath, buffer);
            savedImagePaths.push(`/uploads/${filename}`);
        }

        const property = await prisma.property.create({
            data: { title, location, price, description },
        });

        for (const imagePath of savedImagePaths) {
            await prisma.propertyImage.create({
                data: { property_id: property.id, image_path: imagePath },
            });
        }

        return NextResponse.json({ success: true, property, images: savedImagePaths });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ✅ Get all properties with their images (for admin table thumbnails)
export async function GET() {
    const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            images: true, // Include image array per property
        },
    });

    return NextResponse.json(properties);
}
