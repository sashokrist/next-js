'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';

type Renovation = {
    id: number;
    title: string;
    image: string;
    description: string;
};

export default function RenovationsAdminPage() {
    const [renovations, setRenovations] = useState<Renovation[]>([]);

    useEffect(() => {
        fetch('/api/renovations')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(setRenovations)
            .catch(err => console.error(err));
    }, []);


    return (
        <Container className="py-4">
            <h1>Renovation Services</h1>
            <div className="mb-3">
                <Link href="/admin/renovations/create">
                    <Button variant="success">+ Add Renovation</Button>
                </Link>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {renovations.map(r => (
                    <tr key={r.id}>
                        <td>
                            <img src={r.image} alt={r.title} width="100" />
                        </td>
                        <td>{r.title}</td>
                        <td>{r.description.substring(0, 80)}...</td>
                        <td>
                            <Link href={`/admin/renovations/${r.id}/edit`}>
                                <Button variant="primary" size="sm">Edit</Button>
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}
