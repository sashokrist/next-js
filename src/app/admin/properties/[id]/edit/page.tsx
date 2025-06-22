'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Button, Form, Spinner } from 'react-bootstrap';

export default function EditPropertyPage() {
    const { id } = useParams();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/properties/${id}`)
            .then(res => res.json())
            .then(data => {
                reset(data);
                setLoading(false);
            });
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        await fetch(`/api/properties/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        router.push('/admin/properties');
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Container>
            <h1>Edit Property</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control {...register('title')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control {...register('location')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" step="0.01" {...register('price')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control {...register('image')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={4} {...register('description')} required />
                </Form.Group>
                <Button type="submit">Update</Button>
            </Form>
        </Container>
    );
}