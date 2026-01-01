'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './HorseCard.module.css';

export interface Horse {
    id: string;
    name: string;
    breed: string;
    age: string;
    description: string;
    image_url: string;
    images?: string[];
    category: 'breeding' | 'sale' | 'youngster' | 'retired' | 'stallion' | 'sold' | 'reference' | '';
    pedigree?: any;
}

interface HorseCardProps {
    horse: Horse;
}

export default function HorseCard({ horse }: HorseCardProps) {
    return (
        <Link href={`/hastar/${horse.id}`}>
            <motion.div
                className={styles.card}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.imageWrapper}>
                    <Image
                        src={horse.image_url} // Will use placeholder if URL is invalid in real usage
                        alt={horse.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.shimmerEffect} />

                    {horse.category && (
                        <div className={styles.overlay}>
                            <span className={styles.categoryBadge}>{getCategoryLabel(horse.category)}</span>
                        </div>
                    )}
                </div>

                <div className={styles.info}>
                    <h3 className={styles.name}>{horse.name}</h3>
                    <p className={styles.details}>{horse.breed} • {horse.age}</p>
                </div>
            </motion.div>
        </Link>
    );
}

function getCategoryLabel(cat: string) {
    const map: Record<string, string> = {
        breeding: 'Avelssto',
        sale: 'Till Salu',
        youngster: 'Unghäst',
        retired: 'Pensionär',
        stallion: 'Hingst för avel',
        sold: 'Såld',
        reference: 'Tidigare häst'
    };
    return map[cat] || cat;
}
