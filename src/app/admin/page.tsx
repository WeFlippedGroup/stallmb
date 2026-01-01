'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Horse } from '@/components/HorseCard';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [horses, setHorses] = useState<Horse[]>([]);
    const [loading, setLoading] = useState(true);

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
                <Link href="/admin/new" className={styles.addButton}>
                    <Plus size={20} />
                    Lägg till ny häst
                </Link>
            </div>

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
