import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button, Container, Table } from 'react-bootstrap';

export default async function PropertiesAdminPage() {
    const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <Container>
            <h1>Manage Properties</h1>
            <Link href="/admin/properties/create"><Button className="mb-3">Add Property</Button></Link>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {properties.map(p => (
                    <tr key={p.id}>
                        <td>{p.title}</td>
                        <td>{p.location}</td>
                        <td>${p.price.toLocaleString()}</td>
                        <td>
                            <Link href={`/admin/properties/${p.id}/edit`}>
                                <Button size="sm">Edit</Button>
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}
