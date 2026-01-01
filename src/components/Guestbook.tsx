'use client';

import { useState, useRef } from 'react';
import { addGuestbookEntry, GuestbookEntry } from '@/lib/data';
import { Send, Loader2, MessageSquare, User } from 'lucide-react';
import styles from './Guestbook.module.css';

// Client component for the form
function GuestbookForm({ onEntryAdded }: { onEntryAdded: (entry: GuestbookEntry) => void }) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data, error } = await addGuestbookEntry(name, message);
            if (error) throw error;

            if (data && data.length > 0) {
                // Convert Supabase response to GuestbookEntry
                onEntryAdded(data[0] as unknown as GuestbookEntry);
                setName('');
                setMessage('');
            }
        } catch (err) {
            console.error('Failed to add entry:', err);
            alert('Kunde inte spara inlägget. Försök igen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h4 className={styles.formTitle}>Lämna en hälsning</h4>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Ditt namn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                    disabled={isSubmitting}
                />
            </div>
            <div className={styles.inputGroup}>
                <textarea
                    placeholder="Ditt meddelande..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={3}
                    className={styles.textarea}
                    disabled={isSubmitting}
                />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Skicka
            </button>
        </form>
    );
}

// Main component handling state
export default function Guestbook({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
    const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);

    const handleNewEntry = (entry: GuestbookEntry) => {
        setEntries([entry, ...entries]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className="h3">Gästbok</h3>
                <p className="p opacity-80">Hälsningar från besökare och vänner.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.formSection}>
                    <GuestbookForm onEntryAdded={handleNewEntry} />
                </div>

                <div className={styles.listSection}>
                    {entries.length === 0 ? (
                        <p className={styles.emptyState}>Inga hälsningar än. Bli den första!</p>
                    ) : (
                        <div className={styles.entriesList}>
                            {entries.map((entry) => (
                                <div key={entry.id} className={styles.entryParams}>
                                    <div className={styles.entryHeader}>
                                        <div className={styles.avatar}>
                                            <User size={16} />
                                        </div>
                                        <span className={styles.author}>{entry.name}</span>
                                        <span className={styles.date}>
                                            {new Date(entry.created_at).toLocaleDateString('sv-SE', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className={styles.message}>{entry.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
