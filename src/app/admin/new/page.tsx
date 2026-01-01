'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function NewHorsePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('Connemara');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('breeding');
    const [blabasenLink, setBlabasenLink] = useState('');

    // Image State
    const [images, setImages] = useState<string[]>([]);

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        // Limit check
        const newFilesCount = e.target.files.length;
        if (images.length + newFilesCount > 20) {
            alert('Du kan max ha 20 bilder per häst.');
            return;
        }

        setLoading(true); // Re-using loading state for specific upload indication might be better, but this blocks submit
        const newImageUrls: string[] = [];

        try {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('horse-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('horse-images')
                    .getPublicUrl(filePath);

                newImageUrls.push(publicUrl);
            }

            setImages(prev => [...prev, ...newImageUrls]);
        } catch (err: any) {
            alert('Fel vid uppladdning: ' + err.message);
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset input
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const setMainImage = (index: number) => {
        const newImages = [...images];
        const selected = newImages.splice(index, 1)[0];
        newImages.unshift(selected);
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Harvest Pedigree Data
            const formData = new FormData(e.target as HTMLFormElement);
            const pedigree: Record<string, any> = {};
            const pedKeys = [
                'sire', 'sire_sire', 'sire_sire_sire', 'sire_sire_dam',
                'sire_dam', 'sire_dam_sire', 'sire_dam_dam',
                'dam', 'dam_sire', 'dam_sire_sire', 'dam_sire_dam',
                'dam_dam', 'dam_dam_sire', 'dam_dam_dam'
            ];

            pedKeys.forEach(key => {
                const value = formData.get(key);
                if (value && typeof value === 'string' && value.trim() !== '') {
                    pedigree[key] = { name: value.trim() };
                }
            });

            // Insert Record
            const { error: insertError } = await supabase
                .from('horses')
                .insert({
                    name,
                    breed,
                    age,
                    description,
                    category,
                    image_url: images[0] || null, // First image is main
                    images: images, // All images
                    pedigree: pedigree,
                    blabasen_link: blabasenLink
                });

            if (insertError) throw insertError;

            router.push('/admin');

        } catch (err: any) {
            setError(err.message || 'Något gick fel');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/admin" className={styles.backLink}>
                <ChevronLeft size={20} />
                Tillbaka till Översikt
            </Link>

            <div className={styles.card}>
                <h1 className={styles.title}>Lägg till ny häst</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Multi Image Upload Section */}
                    <div className={styles.imageSection}>
                        <div className={styles.imageGrid}>
                            {images.map((url, index) => (
                                <div key={index} className={styles.imageThumb}>
                                    <Image src={url} alt={`Bild ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                                    <div className={styles.thumbOverlay}>
                                        {index === 0 ? (
                                            <span className={styles.mainBadge}>Huvudbild</span>
                                        ) : (
                                            <button type="button" onClick={() => setMainImage(index)} className={styles.setMainBtn}>
                                                Sätt som huvudbild
                                            </button>
                                        )}
                                        <button type="button" onClick={() => removeImage(index)} className={styles.removeBtn}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {images.length < 20 && (
                                <label className={styles.uploadBox}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className={styles.hiddenInput}
                                    />
                                    <Upload size={24} />
                                    <span>Lägg till</span>
                                </label>
                            )}
                        </div>
                        <p className={styles.helpText}>Max 20 bilder. Den första bilden används som huvudbild.</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label>Namn</label>
                            <input
                                value={name} onChange={e => setName(e.target.value)}
                                required placeholder="T.ex. Misty Blue"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Ras</label>
                            <input
                                value={breed} onChange={e => setBreed(e.target.value)}
                                required placeholder="T.ex. Connemara"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Ålder / Födelseår</label>
                            <input
                                value={age} onChange={e => setAge(e.target.value)}
                                placeholder="T.ex. 2018 eller 6 år"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Kategori</label>
                            <select
                                value={category} onChange={e => setCategory(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Ingen etikett</option>
                                <option value="breeding">Avelssto</option>
                                <option value="stallion">Hingst för avel</option>
                                <option value="sale">Till Salu</option>
                                <option value="youngster">Unghäst</option>
                                <option value="retired">Pensionär</option>
                                <option value="sold">Såld</option>
                                <option value="reference">Tidigare häst / Referens</option>
                                <option value="reference">Tidigare häst / Referens</option>
                                <option value="loaned">Utlånad/Tävlas</option>
                                <option value="foal">Årsföl</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Länk till Blåbasen</label>
                            <input
                                value={blabasenLink} onChange={e => setBlabasenLink(e.target.value)}
                                placeholder="https://blabasen.se/sh/..."
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Beskrivning</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Berätta om hästen..."
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.sectionHeader}>
                        <h2>Härstamning (3 led)</h2>
                        <p className={styles.helpText}>Fyll i så mycket du vet. Lämnas tomt visas inget.</p>
                    </div>

                    <div className={styles.pedigreeGrid}>
                        <div className={styles.pedigreeColumn}>
                            <h3>Far (Sire)</h3>
                            <input placeholder="Far" name="sire" className={styles.input} />
                            <div className={styles.subGrid}>
                                <div>
                                    <label>Farfar</label>
                                    <input placeholder="Farfar" name="sire_sire" className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input placeholder="Farfars Far" name="sire_sire_sire" className={styles.microInput} />
                                        <input placeholder="Farfars Mor" name="sire_sire_dam" className={styles.microInput} />
                                    </div>
                                </div>
                                <div>
                                    <label>Farmor</label>
                                    <input placeholder="Farmor" name="sire_dam" className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input placeholder="Farmors Far" name="sire_dam_sire" className={styles.microInput} />
                                        <input placeholder="Farmors Mor" name="sire_dam_dam" className={styles.microInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.pedigreeColumn}>
                            <h3>Mor (Dam)</h3>
                            <input placeholder="Mor" name="dam" className={styles.input} />
                            <div className={styles.subGrid}>
                                <div>
                                    <label>Morfar</label>
                                    <input placeholder="Morfar" name="dam_sire" className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input placeholder="Morfars Far" name="dam_sire_sire" className={styles.microInput} />
                                        <input placeholder="Morfars Mor" name="dam_sire_dam" className={styles.microInput} />
                                    </div>
                                </div>
                                <div>
                                    <label>Mormor</label>
                                    <input placeholder="Mormor" name="dam_dam" className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input placeholder="Mormors Far" name="dam_dam_sire" className={styles.microInput} />
                                        <input placeholder="Mormors Mor" name="dam_dam_dam" className={styles.microInput} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Sparar...' : 'Spara Häst'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
