// src/components/NewsCard.tsx
import Card from 'react-bootstrap/Card';

export default function NewsCard({ title, content }) {
    const words = content.split(' ');
    const preview = words.slice(0, 15).join(' ');
    const showReadMore = words.length > 15;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {preview}
                    {showReadMore && '...'}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}