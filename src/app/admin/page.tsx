'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Horse } from '@/components/HorseCard';
import { Plus, Trash2, Edit2, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [horses, setHorses] = useState<Horse[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ total: number; today: number } | null>(null);

    const fetchHorses = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('horses')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setHorses(data as Horse[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchHorses();
        // Import dynamically to avoid server component issues if any, 
        // but since it's a server action we can call it directly in useEffect.
        import('@/actions/analytics').then(({ getVisitorStats }) => {
            getVisitorStats().then(setStats);
        });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Är du säker på att du vill ta bort denna häst?')) return;

        const { error } = await supabase.from('horses').delete().eq('id', id);
        if (!error) {
            setHorses(horses.filter(h => h.id !== id));
        } else {
            alert('Kunde inte ta bort hästen: ' + error.message);
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Mina Hästar</h1>
                <div className={styles.headerActions}>
                    <Link href="/admin/hastannons" className={styles.secondaryButton}>
                        <Share2 size={20} />
                        Dela till Hastannons
                    </Link>
                    <Link href="/admin/content" className={styles.secondaryButton}>
                        <Edit2 size={20} />
                        Redigera sidor
                    </Link>
                    <Link href="/admin/new" className={styles.addButton}>
                        <Plus size={20} />
                        Lägg till ny häst
                    </Link>
                </div>
            </div>

            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Totalt antal besökare</h3>
                        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            {stats.total.toLocaleString()}
                        </p>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Besökare idag</h3>
                        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            {stats.today.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className={styles.loading}>Laddar hästar...</div>
            ) : horses.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Du har inte lagt till några hästar än.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {horses.map((horse) => (
                        <div key={horse.id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                {horse.image_url && <Image src={horse.image_url} alt={horse.name} fill style={{ objectFit: 'cover' }} />}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.horseName}>{horse.name}</h3>
                                <p className={styles.horseMeta}>{horse.breed} • {horse.age}</p>
                                <div className={styles.badges}>
                                    <span className={styles.badge}>{horse.category}</span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <Link href={`/admin/edit/${horse.id}`} className={styles.editBtn} title="Redigera">
                                    <Edit2 size={18} />
                                </Link>
                                <button onClick={() => handleDelete(horse.id)} className={styles.deleteBtn} title="Ta bort">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
