'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Table, Navbar, Nav } from 'react-bootstrap';

export default function PropertiesAdminPage() {
    const [properties, setProperties] = useState([]);

    const loadProperties = async () => {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const deleteProperty = async (id: number) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        const res = await fetch(`/api/properties/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setProperties(properties.filter((p) => p.id !== id));
        } else {
            alert('Failed to delete property');
        }
    };

    return (
        <>
            {/* ✅ Admin Navigation Bar */}
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
                <h1>Manage Properties</h1>
                <Link href="/admin/properties/create">
                    <Button className="mb-3">Add Property</Button>
                </Link>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {properties.map((p: any) => (
                        <tr key={p.id}>
                            <td>
                                {p.images?.[0]?.image_path && (
                                    <img
                                        src={p.images[0].image_path}
                                        alt={p.title}
                                        width="100"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </td>
                            <td>{p.title}</td>
                            <td>{p.location}</td>
                            <td>${p.price.toLocaleString()}</td>
                            <td>
                                <Link href={`/admin/properties/${p.id}/edit`}>
                                    <Button size="sm" className="me-2">Edit</Button>
                                </Link>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => deleteProperty(p.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}