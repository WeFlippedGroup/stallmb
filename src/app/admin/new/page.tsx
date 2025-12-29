'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload } from 'lucide-react';
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let imageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('horse-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('horse-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // 2. Collect Pedigree Data
            // We use the simpler method of harvesting form data since we switched the inputs to uncontrolled
            const formData = new FormData(e.target as HTMLFormElement);
            const pedigree: Record<string, any> = {};

            // List of pedigree keys to harvest
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

            // 3. Insert Record
            const { error: insertError } = await supabase
                .from('horses')
                .insert({
                    name,
                    breed,
                    age,
                    description,
                    category, // Can now be "stallion" or empty
                    image_url: imageUrl,
                    pedigree: pedigree // Insert the JSON object
                });

            if (insertError) throw insertError;

            // Success
            router.push('/admin');

        } catch (err: any) {
            setError(err.message || 'Något gick fel');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/admin" className={styles.backLink}>
                <ChevronLeft size={20} /> Use
                Tillbaka till Översikt
            </Link>

            <div className={styles.card}>
                <h1 className={styles.title}>Lägg till ny häst</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Image Upload */}
                    <div className={styles.imageSection}>
                        <div className={styles.imagePreview}>
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <div className={styles.placeholder}>
                                    <Upload size={32} />
                                    <span>Välj bild</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                        </div>
                        <p className={styles.helpText}>Klicka för att välja en bild (JPG, PNG)</p>
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
                            </select>
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
                        {/* Sire Line */}
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

                        {/* Dam Line */}
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
