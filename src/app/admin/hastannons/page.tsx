'use client';

import { useEffect, useState } from 'react';
import { listHorses } from '@/actions/horses';
import { Horse } from '@/components/HorseCard';
import ShareForm from './ShareForm';
import { Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function HastannonsPage() {
    const [horses, setHorses] = useState<Horse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);

    const fetchHorses = async () => {
        setLoading(true);
        // We primarily want to share horses that are for sale or stallions
        // But for simplicity let's show all and let user filter/choose? 
        // Or filter by category 'sale', 'stallion' etc.
        // Let's fetch all for now to be safe as data might be messy.
        const { horses: rows, error } = await listHorses();
        if (error) console.error(error);
        setHorses(rows);
        setLoading(false);
    };

    useEffect(() => {
        fetchHorses();
    }, []);

    const handleSuccess = (url: string) => {
        setSuccessUrl(url);
        setSelectedHorse(null); // Close modal
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dela till Hastannons.se</h1>
                <Link href="/admin" className={styles.backLink}>Tillbaka till översikt</Link>
            </div>

            {successUrl && (
                <div className={styles.successBanner}>
                    <p>Annonsen har publicerats!</p>
                    <a href={successUrl} target="_blank" rel="noopener noreferrer" className={styles.successLink}>
                        Visa annons <ExternalLink size={16} />
                    </a>
                    <button onClick={() => setSuccessUrl(null)} className={styles.closeBanner}>Stäng</button>
                </div>
            )}

            {loading ? (
                <div className={styles.loading}>Laddar hästar...</div>
            ) : (
                <div className={styles.grid}>
                    {horses.map((horse) => (
                        <div key={horse.id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                {horse.image_url ? (
                                    <Image src={horse.image_url} alt={horse.name} fill style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div className={styles.placeholder}>Ingen bild</div>
                                )}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.horseName}>{horse.name}</h3>
                                <p className={styles.meta}>{horse.breed} • {horse.age}</p>
                                <span className={styles.badge}>{horse.category}</span>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    onClick={() => setSelectedHorse(horse)}
                                    className={styles.shareBtn}
                                >
                                    <Share2 size={18} />
                                    Dela
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedHorse && (
                <ShareForm
                    horse={selectedHorse}
                    onClose={() => setSelectedHorse(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
