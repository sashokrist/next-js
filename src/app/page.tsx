'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function HomePage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });
  const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });
  const renovations = await prisma.renovation.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });

  return (
      <>
        {/* Admin Navigation */}
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
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

        {/* Hero Banner */}
        <header className="bg-gradient p-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #0d6efd, #6610f2)' }}>
          <h1 className="display-4 fw-bold">Dream Homes & Renovations</h1>
          <p className="lead">We help you find or transform your perfect space.</p>
        </header>

        <Container className="py-5">
          {/* About Section */}
          <section className="mb-5 text-center bg-dark text-white py-4 rounded">
            <h2 className="fw-semibold">About Us</h2>
            <p className="fs-5">
              We are a full-service agency providing real estate and renovation services. Whether you're buying a new property or updating your current one, we have you covered.
            </p>
          </section>

          {/* News Section */}
          <section className="mb-5">
            <h2 className="mb-4">📰 Latest News</h2>
            <Row className="g-4">
              {news.map(n => {
                const words = n.content.split(' ');
                const preview = words.slice(0, 15).join(' ');
                const showReadMore = words.length > 15;

                return (
                    <Col md={4} key={n.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={n.image} alt={n.title} height={200} style={{ objectFit: 'cover' }} />
                        <Card.Body>
                          <Card.Title>{n.title}</Card.Title>
                          <Card.Text>
                            {preview}
                            {showReadMore && (
                                <>
                                  ...{' '}
                                  <Link href={`/news/${n.id}`}>
                                    <Button variant="link" className="p-0 align-baseline">Read more</Button>
                                  </Link>
                                </>
                            )}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                );
              })}
            </Row>
          </section>

          {/* Property Listings */}
          <section className="mb-5">
            <h2 className="mb-4">🏡 Properties for Sale</h2>
            <Row className="g-4">
              {properties.map(p => (
                  <Col md={4} key={p.id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img variant="top" src={p.image} alt={p.title} height={200} style={{ objectFit: 'cover' }} />
                      <Card.Body>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Text>
                          {p.description.substring(0, 100)}...
                          <br />
                          <strong>📍 Location:</strong> {p.location}<br />
                          <strong>💰 Price:</strong> ${p.price.toLocaleString()}
                        </Card.Text>
                        <Link href={`/property/${p.id}`}>
                          <Button variant="primary" className="mt-2">View Details</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
              ))}
            </Row>
          </section>

          {/* Renovation Services */}
          <section className="mb-5">
            <h2 className="mb-4">🛠️ Renovation Services</h2>
            <Row className="g-4">
              {renovations.map(r => (
                  <Col md={4} key={r.id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img variant="top" src={r.image} alt={r.title} height={200} style={{ objectFit: 'cover' }} />
                      <Card.Body>
                        <Card.Title>{r.title}</Card.Title>
                        <Card.Text>{r.description.substring(0, 100)}...</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
              ))}
            </Row>
          </section>
        </Container>

        {/* Footer */}
        <footer className="bg-light text-dark text-center py-4 border-top">
          <p className="mb-0">&copy; {new Date().getFullYear()} Dream Homes & Renovations. All rights reserved.</p>
        </footer>
      </>
  );
}
