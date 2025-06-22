import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button, Container } from 'react-bootstrap';

export default async function NewsAdminPage() {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <Container>
            <h1>Manage News</h1>
            <Link href="/admin/news/create"><Button className="mb-3">Add News</Button></Link>
            <ul>
                {news.map(n => (
                    <li key={n.id}>
                        {n.title} - <Link href={`/admin/news/${n.id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </Container>
    );
}
