'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateNewsPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const res = await fetch('/api/news', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            router.push('/admin/news');
        } else {
            alert('Failed to create news');
        }
    };

    return (
        <div className="container mt-4">
            <h1>Add News</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" name="title" className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea name="content" className="form-control" rows={5} required></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" name="image" className="form-control" accept="image/*" required />
                </div>

                {error && <div className="text-danger mb-3">{error}</div>}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}