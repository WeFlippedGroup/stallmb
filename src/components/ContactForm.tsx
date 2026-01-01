'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                let msg = 'Något gick fel.';
                if (data.error) {
                    if (typeof data.error === 'string') msg = data.error;
                    else if (typeof data.error === 'object') {
                        msg = (data.error as any).message || JSON.stringify(data.error);
                    }
                }
                throw new Error(msg);
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.formCard}>
            <h3 className="h3" style={{ marginBottom: '1rem' }}>Skicka ett meddelande</h3>
            <p className="p" style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                Fyll i formuläret nedan för att komma i kontakt med oss direkt.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Namn</label>
                    <input
                        type="text"
                        id="name"
                        required
                        className={styles.input}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={status === 'loading'}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>E-post</label>
                    <input
                        type="email"
                        id="email"
                        required
                        className={styles.input}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={status === 'loading'}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Meddelande</label>
                    <textarea
                        id="message"
                        required
                        rows={5}
                        className={styles.textarea}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={status === 'loading'}
                    />
                </div>

                {status === 'error' && (
                    <div className={`${styles.alert} ${styles.alertError}`}>
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className={`${styles.alert} ${styles.alertSuccess}`}>
                        <CheckCircle size={18} />
                        <span>Tack! Ditt meddelande har skickats.</span>
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={status === 'loading' || status === 'success'}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> Skickar...
                        </>
                    ) : (
                        <>
                            Skicka <Send size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
