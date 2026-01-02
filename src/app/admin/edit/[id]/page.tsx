'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Upload, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../new/page.module.css'; // Reusing styles

export default function EditHorsePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('Connemara');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('breeding');
    const [blabasenLink, setBlabasenLink] = useState('');
    const [results, setResults] = useState('');

    // Image State
    // We store the full array of image URLs here
    const [images, setImages] = useState<string[]>([]);

    // Pedigree state (for controlled inputs if needed, or just to populate defaultValue)
    const [pedigree, setPedigree] = useState<any>({});

    useEffect(() => {
        const fetchHorse = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('horses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('Kunde inte hitta hästen.');
                setLoading(false);
                return;
            }

            if (data) {
                setName(data.name || '');
                setBreed(data.breed || 'Connemara');
                setAge(data.age || '');
                setDescription(data.description || '');
                setCategory(data.category || 'breeding');
                setPedigree(data.pedigree || {});
                setBlabasenLink(data.blabasen_link || '');
                setResults(data.results || '');

                // Combine legacy image_url with new images array if present
                // Priority: images array -> single image_url -> empty
                let loadedImages: string[] = [];
                if (data.images && Array.isArray(data.images)) {
                    loadedImages = data.images;
                } else if (data.image_url) {
                    loadedImages = [data.image_url];
                }
                setImages(loadedImages);
            }
            setLoading(false);
        };

        fetchHorse();
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        // Check if adding these would exceed limit of 20
        const newFilesCount = e.target.files.length;
        if (images.length + newFilesCount > 20) {
            alert('Du kan max ha 20 bilder per häst.');
            return;
        }

        setSaving(true);
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
            setSaving(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const setMainImage = (index: number) => {
        // Move the selected image to index 0
        const newImages = [...images];
        const selected = newImages.splice(index, 1)[0];
        newImages.unshift(selected);
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Harvest Pedigree Data
            const formData = new FormData(e.target as HTMLFormElement);
            const newPedigree: Record<string, any> = {};
            const pedKeys = [
                'sire', 'sire_sire', 'sire_sire_sire', 'sire_sire_dam',
                'sire_dam', 'sire_dam_sire', 'sire_dam_dam',
                'dam', 'dam_sire', 'dam_sire_sire', 'dam_sire_dam',
                'dam_dam', 'dam_dam_sire', 'dam_dam_dam'
            ];

            pedKeys.forEach(key => {
                const value = formData.get(key);
                // Use existing value if not changed (form data might be empty if inputs didn't have defaultValue set precisely)
                // Actually, for uncontrolled inputs with defaultValues, FormData works great.
                if (value && typeof value === 'string' && value.trim() !== '') {
                    newPedigree[key] = { name: value.trim() };
                }
            });

            // Update Record
            const { error: updateError } = await supabase
                .from('horses')
                .update({
                    name,
                    breed,
                    age,
                    description,
                    category,
                    image_url: images[0] || null, // Main image is always first
                    images: images, // Save all images
                    pedigree: newPedigree,
                    blabasen_link: blabasenLink,
                    results: results
                })
                .eq('id', id);

            if (updateError) throw updateError;

            router.push('/admin');

        } catch (err: any) {
            setError(err.message || 'Något gick fel');
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>Laddar...</div>;

    // Helper to get nested pedigree name safely
    const getPedigreeName = (key: string) => pedigree[key]?.name || '';

    return (
        <div className={styles.container}>
            <Link href="/admin" className={styles.backLink}>
                <ChevronLeft size={20} />
                Tillbaka till Översikt
            </Link>

            <div className={styles.card}>
                <h1 className={styles.title}>Redigera häst</h1>

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
                                required className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Ras</label>
                            <input
                                value={breed} onChange={e => setBreed(e.target.value)}
                                required className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Ålder / Födelseår</label>
                            <input
                                value={age} onChange={e => setAge(e.target.value)}
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
                            rows={4} className={styles.textarea}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Övrig information</label>
                        <textarea
                            value={results} onChange={e => setResults(e.target.value)}
                            rows={4}
                            placeholder="Tävlingsresultat, utmärkelser, övrigt..."
                            className={styles.textarea}
                        />
                    </div>

                    {/* Pedigree Section - Pre-populated */}
                    <div className={styles.sectionHeader}>
                        <h2>Härstamning (3 led)</h2>
                    </div>

                    <div className={styles.pedigreeGrid}>
                        <div className={styles.pedigreeColumn}>
                            <h3>Far (Sire)</h3>
                            <input name="sire" defaultValue={getPedigreeName('sire')} className={styles.input} />
                            <div className={styles.subGrid}>
                                <div>
                                    <label>Farfar</label>
                                    <input name="sire_sire" defaultValue={getPedigreeName('sire_sire')} className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input name="sire_sire_sire" defaultValue={getPedigreeName('sire_sire_sire')} className={styles.microInput} />
                                        <input name="sire_sire_dam" defaultValue={getPedigreeName('sire_sire_dam')} className={styles.microInput} />
                                    </div>
                                </div>
                                <div>
                                    <label>Farmor</label>
                                    <input name="sire_dam" defaultValue={getPedigreeName('sire_dam')} className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input name="sire_dam_sire" defaultValue={getPedigreeName('sire_dam_sire')} className={styles.microInput} />
                                        <input name="sire_dam_dam" defaultValue={getPedigreeName('sire_dam_dam')} className={styles.microInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.pedigreeColumn}>
                            <h3>Mor (Dam)</h3>
                            <input name="dam" defaultValue={getPedigreeName('dam')} className={styles.input} />
                            <div className={styles.subGrid}>
                                <div>
                                    <label>Morfar</label>
                                    <input name="dam_sire" defaultValue={getPedigreeName('dam_sire')} className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input name="dam_sire_sire" defaultValue={getPedigreeName('dam_sire_sire')} className={styles.microInput} />
                                        <input name="dam_sire_dam" defaultValue={getPedigreeName('dam_sire_dam')} className={styles.microInput} />
                                    </div>
                                </div>
                                <div>
                                    <label>Mormor</label>
                                    <input name="dam_dam" defaultValue={getPedigreeName('dam_dam')} className={styles.input} />
                                    <div className={styles.microGrid}>
                                        <input name="dam_dam_sire" defaultValue={getPedigreeName('dam_dam_sire')} className={styles.microInput} />
                                        <input name="dam_dam_dam" defaultValue={getPedigreeName('dam_dam_dam')} className={styles.microInput} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" disabled={saving} className={styles.submitBtn}>
                            {saving ? 'Sparar...' : 'Uppdatera Häst'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
