'use client';

import { Container, Card } from 'react-bootstrap';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = await prisma.property.findUnique({
        where: { id: Number(params.id) },
    });

    if (!property) return notFound();

    return (
        <Container className="py-5">
            <Card className="shadow-lg">
                <Card.Img
                    variant="top"
                    src={property.image}
                    alt={property.title}
                    height={400}
                    style={{ objectFit: 'cover' }}
                />
                <Card.Body>
                    <Card.Title className="mb-3">{property.title}</Card.Title>
                    <Card.Text>
                        <strong>📍 Location:</strong> {property.location}
                        <br />
                        <strong>💰 Price:</strong> ${property.price.toLocaleString()}
                    </Card.Text>
                    <p className="mt-3">{property.description}</p>
                </Card.Body>
            </Card>
        </Container>
    );
}