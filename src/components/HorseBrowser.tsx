'use client';

import { useState } from 'react';
import { Horse } from './HorseCard';
import HorseCard from './HorseCard';
import styles from '@/app/hastar/page.module.css'; // Re-use existing styles
import clsx from 'clsx';

interface HorseBrowserProps {
    initialHorses: Horse[];
}

type FilterType = 'all' | 'sale' | 'breeding' | 'stallion' | 'youngster';

export default function HorseBrowser({ initialHorses }: HorseBrowserProps) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredHorses = initialHorses.filter((horse) => {
        if (filter === 'all') return true;
        if (filter === 'sale') return horse.category === 'sale';
        if (filter === 'breeding') return horse.category === 'breeding';
        if (filter === 'stallion') return horse.category === 'stallion';
        if (filter === 'youngster') return horse.category === 'youngster';
        return true;
    });

    return (
        <>
            <div className={styles.filterBar}>
                <button
                    onClick={() => setFilter('all')}
                    className={clsx(styles.filter, filter === 'all' && styles.activeFilter)}
                >
                    Alla
                </button>
                <button
                    onClick={() => setFilter('sale')}
                    className={clsx(styles.filter, filter === 'sale' && styles.activeFilter)}
                >
                    Till Salu
                </button>
                <button
                    onClick={() => setFilter('breeding')}
                    className={clsx(styles.filter, filter === 'breeding' && styles.activeFilter)}
                >
                    Avelston
                </button>
                <button
                    onClick={() => setFilter('stallion')}
                    className={clsx(styles.filter, filter === 'stallion' && styles.activeFilter)}
                >
                    Hingstar
                </button>
                <button
                    onClick={() => setFilter('youngster')}
                    className={clsx(styles.filter, filter === 'youngster' && styles.activeFilter)}
                >
                    Unghästar
                </button>
            </div>

            <div className={styles.grid}>
                {filteredHorses.length > 0 ? (
                    filteredHorses.map((horse) => (
                        <HorseCard key={horse.id} horse={horse} />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#888' }}>
                        Inga hästar hittades i denna kategori just nu.
                    </div>
                )}
            </div>
        </>
    );
}
