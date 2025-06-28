'use client';
// app/property/[id]/page.tsx

import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';

export default async function PropertyDetail({ params }: { params: { id: string } }) {
    const property = await prisma.property.findUnique({
        where: { id: parseInt(params.id) },
        include: { images: true },
    });

    if (!property) return notFound();

    return (
        <Container className="py-5">
            <h1 className="mb-3">{property.title}</h1>
            <p><strong>📍 Location:</strong> {property.location}</p>
            <p><strong>💰 Price:</strong> ${property.price.toLocaleString()}</p>
            <p>{property.description}</p>

            {/* Image Grid */}
            {property.images.length > 0 && (
                <Row className="g-3 mb-4">
                    {property.images.map((img, idx) => (
                        <Col key={idx} xs={12} sm={6} md={4}>
                            <Image
                                src={img.image_path}
                                alt={`Property image ${idx + 1}`}
                                thumbnail
                                style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <Card>
                <Card.Body>
                    <h5>Contact us for more information</h5>
                    <p>Email: <a href="mailto:info@dreamhomes.com">info@dreamhomes.com</a></p>
                </Card.Body>
            </Card>
        </Container>
    );
}