'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Navbar, Nav, Table } from 'react-bootstrap';

export default function NewsAdminPage() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const newsData = await fetch('/api/news').then(res => res.json());
            setNews(newsData);
        };
        fetchData();
    }, []);

    return (
        <>
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
                <h1>Manage News</h1>
                <Link href="/admin/news/create">
                    <Button className="mb-3">Add News</Button>
                </Link>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {news.map((n) => (
                        <tr key={n.id}>
                            <td>
                                {n.image && (
                                    <img
                                        src={n.image}
                                        alt={n.title}
                                        width="100"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </td>
                            <td>{n.title}</td>
                            <td>{new Date(n.createdAt).toLocaleString()}</td>
                            <td>
                                <Link href={`/admin/news/${n.id}/edit`}>
                                    <Button size="sm" className="me-2">Edit</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
