'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  images: { image_path: string }[];
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-5 text-center">
        <h2>Property Not Found</h2>
        <Link href="/" passHref>
          <Button as="a" variant="secondary" className="mt-3">← Back to Home</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Img
          variant="top"
          src={property.images?.[0]?.image_path || '/placeholder.jpg'}
          alt={property.title}
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{property.title}</Card.Title>
          <Card.Text>
            <strong>📍 Location:</strong> {property.location}<br />
            <strong>💰 Price:</strong> {property.price ? `$${property.price.toLocaleString()}` : 'N/A'}<br /><br />
            {property.description}
          </Card.Text>
          <Link href="/" passHref>
            <Button as="a" variant="secondary" className="mt-3">← Back to Home</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}
