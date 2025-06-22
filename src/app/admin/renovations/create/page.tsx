'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Container, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

export default function CreateRenovationPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.image[0]) {
            formData.append('image', data.image[0]);
        }

        try {
            const res = await fetch('/api/renovations', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                router.push('/admin/renovations');
            } else {
                const error = await res.json();
                alert('Failed to create renovation: ' + error.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create renovation');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <h1>Add Renovation</h1>
            <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control {...register('title')} required />
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
