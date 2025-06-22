import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container } from 'react-bootstrap';

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const news = await prisma.news.findUnique({
        where: { id: Number(params.id) },
    });

    if (!news) return notFound();

    return (
        <Container className="py-5">
            <h1 className="mb-4">{news.title}</h1>
            <img src={news.image} alt={news.title} className="img-fluid rounded mb-4" />
            <p className="fs-5">{news.content}</p>
        </Container>
    );
}
