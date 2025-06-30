import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(property);
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);
  const data = await req.json();

  await prisma.property.update({
    where: { id },
    data,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);
  try {
    await prisma.property.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
