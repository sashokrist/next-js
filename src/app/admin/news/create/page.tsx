'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Container, Form, Button } from 'react-bootstrap';

export default function CreateNewsPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('image', data.image[0]); // image is a FileList

        const res = await fetch('/api/news', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            router.push('/admin/news');
        } else {
            alert('Failed to create news');
        }
    };

    return (
        <Container className="py-5">
            <h1>Create News</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control {...register('title')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5} {...register('description')} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" {...register('image')} accept="image/*" required />
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}
