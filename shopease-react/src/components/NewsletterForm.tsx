import React, { useState } from 'react';
import { postNewsletterSubscription } from '../services/useBackend';

const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postNewsletterSubscription(email)
            .then((response) => {
                setSuccessMessage(response.message || 'Subscription successful!');
            })
            .catch((error) => {
                setSuccessMessage(`Subscription failed: ${error.message}`);
            });
        setEmail('');
    };

    return (
        <section className="newsletter">
            <div className="newsletter-content">
                <h2>Subscribe to Our Newsletter</h2>
                <p>Get updates on new products, special offers, and more.</p>
                <form id="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        id="newsletter-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Subscribe</button>
                </form>
                {successMessage && <div id="newsletter-success">{successMessage}</div>}
            </div>
        </section>
    );
};

export default NewsletterForm;