'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [renovations, setRenovations] = useState([]);

  // Pagination and expansion
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [newsPage, setNewsPage] = useState(1);
  const newsPerPage = 5;

  const [propertyPage, setPropertyPage] = useState(1);
  const propertiesPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      const newsData = await fetch('/api/news').then(res => res.json());
      const propertyData = await fetch('/api/properties').then(res => res.json());
      const renovationData = await fetch('/api/renovations').then(res => res.json());

      setNews(newsData);
      setProperties(propertyData);
      setRenovations(renovationData);
    };

    fetchData();
  }, []);

  const paginatedNews = news.slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  );

  const paginatedProperties = properties.slice(
    (propertyPage - 1) * propertiesPerPage,
    propertyPage * propertiesPerPage
  );

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
      <header
        className="bg-gradient p-5 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #0d6efd, #6610f2)' }}
      >
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
        <section id="news-section" className="mb-5">
          <h2 className="mb-4">📰 Latest News</h2>
          <div className="d-flex flex-column gap-4">
            {paginatedNews.map(n => {
              const isExpanded = expandedNewsId === n.id;
              const content = isExpanded
                ? n.content
                : n.content.slice(0, 200);

              return (
                <Card key={n.id} className="shadow-sm">
                  <Card.Body className="d-flex">
                    <img
                      src={n.image}
                      alt={n.title}
                      style={{
                        width: '150px',
                        height: 'auto',
                        objectFit: 'cover',
                        marginRight: '1rem',
                        borderRadius: '5px'
                      }}
                    />
                    <div>
                      <Card.Title>{n.title}</Card.Title>
                      <Card.Text>
                        {content}
                        {n.content.length > 200 && (
                          <>
                            {!isExpanded ? '...' : ''}
                            <br />
                            <Button
                              variant="link"
                              className="p-0 mt-2"
                              onClick={() =>
                                setExpandedNewsId(isExpanded ? null : n.id)
                              }
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </Button>
                          </>
                        )}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          {/* News Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="secondary"
              className="me-2"
              disabled={newsPage === 1}
              onClick={() => {
                setNewsPage(prev => prev - 1);
                document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={newsPage * newsPerPage >= news.length}
              onClick={() => {
                setNewsPage(prev => prev + 1);
                document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next
            </Button>
          </div>
        </section>

        {/* Property Listings */}
        <section id="property-section" className="mb-5">
          <h2 className="mb-4">🏡 Properties for Sale</h2>
          <Row className="g-4">
            {paginatedProperties.map(p => (
              <Col md={4} key={p.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={p.images?.[0]?.image_path || '/placeholder.jpg'}
                    alt={p.title || 'Property image'}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{p.title}</Card.Title>
                    <Card.Text>
                      {(p.description?.substring(0, 100) ?? '')}...
                      <br />
                      <strong>📍 Location:</strong> {p.location}
                      <br />
                      <strong>💰 Price:</strong> {p.price ? `$${p.price.toLocaleString()}` : 'N/A'}
                    </Card.Text>
                    <Link href={`/property/${p.id}`} passHref>
                      <Button as="a" variant="primary" className="mt-2">
                        View Details
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Property Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="secondary"
              className="me-2"
              disabled={propertyPage === 1}
              onClick={() => {
                setPropertyPage(prev => prev - 1);
                document.getElementById('property-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={propertyPage * propertiesPerPage >= properties.length}
              onClick={() => {
                setPropertyPage(prev => prev + 1);
                document.getElementById('property-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next
            </Button>
          </div>
        </section>

        {/* Renovation Services */}
        <section className="mb-5">
          <h2 className="mb-4">🛠️ Renovation Services</h2>
          <Row xs={1} md={2} className="g-4">
            {renovations.map(r => (
              <Col key={r.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={r.image}
                    alt={r.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{r.title}</Card.Title>
                    <Card.Text>
                      {r.description?.length > 150
                        ? r.description.substring(0, 150) + '...'
                        : r.description}
                    </Card.Text>
                    <Link href={`/renovation/${r.id}`} passHref>
                      <Button as="a" variant="outline-primary">
                        View Details
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* Footer */}
      <footer className="bg-light text-dark text-center py-4 border-top">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Dream Homes & Renovations. All rights reserved.
        </p>
      </footer>
    </>
  );
}