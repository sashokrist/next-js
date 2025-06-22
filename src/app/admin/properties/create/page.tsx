'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Container, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

export default function CreatePropertyPage() {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('location', data.location);
        formData.append('price', data.price);
        formData.append('description', data.description);
        if (data.image[0]) {
            formData.append('image', data.image[0]); // get the first file
        }

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                router.push('/admin/properties');
            } else {
                const error = await res.json();
                alert('Failed to create property: ' + error.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create property');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <h1>Add Property</h1>
            <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" accept="image/*" {...register('image')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={4} {...register('description')} required />
                </Form.Group>
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Save'}
                </Button>
            </Form>
        </Container>
    );
}
