'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/app/hastar/[id]/page.module.css'; // Re-use styles
import type { Horse } from '@/components/HorseCard';

interface HorseDetailGalleryProps {
    horse: Horse;
}

export default function HorseDetailGallery({ horse }: HorseDetailGalleryProps) {
    // Default to main image URL, or first of images if main is missing
    const [activeImage, setActiveImage] = useState<string>(
        horse.image_url || (horse.images && horse.images.length > 0 ? horse.images[0] : '')
    );

    // Combine main image and additional gallery images into one unique list for the grid
    // But typically 'horse.images' contains ALL images including the main one (based on my previous mock data implementation)
    // If not, we might want to ensure consistency. 
    // In the mock data I updated, 'images' array contains ALL images.
    const galleryImages = horse.images || (horse.image_url ? [horse.image_url] : []);

    return (
        <div className={styles.imageColumn}>
            <div className={styles.mainImageWrapper}>
                {activeImage ? (
                    <Image
                        src={activeImage}
                        alt={horse.name}
                        fill
                        priority
                        style={{ objectFit: 'contain' }}
                        className={styles.mainImage}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>Ingen bild tillgänglig</div>
                )}
            </div>

            {/* Image Gallery */}
            {galleryImages.length > 1 && (
                <div className={styles.imageGallery}>
                    {galleryImages.map((img, index) => (
                        <div
                            key={index}
                            className={styles.galleryItem}
                            onClick={() => setActiveImage(img)}
                            style={{
                                cursor: 'pointer',
                                border: activeImage === img ? '2px solid var(--color-primary)' : '2px solid transparent'
                            }}
                        >
                            <Image
                                src={img}
                                alt={`${horse.name} ${index + 1}`}
                                width={200}
                                height={150}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
