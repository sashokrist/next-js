'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Container, Table, Navbar, Nav } from 'react-bootstrap';

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
        <>
            {/* ✅ Admin Navigation */}
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top mb-4">
                <Container>
                    <Navbar.Brand href="/">🏠 Dream Homes CMS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="admin-navbar" />
                    <Navbar.Collapse id="admin-navbar">
                        <Nav className="me-auto">
                            <Nav.Link href="/admin/news">Manage News</Nav.Link>
                            <Nav.Link href="/admin/properties">Manage Properties</Nav.Link>
                            <Nav.Link href="/admin/renovations">Manage Renovations</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <h1>Manage Renovations</h1>
                <Link href="/admin/renovations/create">
                    <Button className="mb-3">Add Renovation</Button>
                </Link>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renovations.map(r => (
                        <tr key={r.id}>
                            <td>
                                <img src={r.image} alt={r.title} width="100" style={{ objectFit: 'cover' }} />
                            </td>
                            <td>{r.title}</td>
                            <td>{r.description.substring(0, 100)}...</td>
                            <td>
                                <Link href={`/admin/renovations/${r.id}/edit`}>
                                    <Button size="sm" className="me-2">Edit</Button>
                                </Link>
                                {/* Optional Delete button placeholder */}
                                {/* <Button size="sm" variant="danger">Delete</Button> */}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}