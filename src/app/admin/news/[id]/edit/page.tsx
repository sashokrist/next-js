'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Button, Form, Spinner } from 'react-bootstrap';

export default function EditNewsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/news/${id}`)
            .then(res => res.json())
            .then(data => {
                reset(data);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onSubmit = async (data: any) => {
        const res = await fetch(`/api/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.error || 'Failed to update news');
            return;
        }

        router.push('/admin/news');
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status" />
            </Container>
        );
    }

    return (
        <Container>
            <h1>Edit News</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control {...register('title')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control {...register('image')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={5} {...register('content')} required />
                </Form.Group>
                <Button type="submit">Update</Button>
            </Form>
        </Container>
    );
}