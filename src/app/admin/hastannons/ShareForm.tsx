'use client';

import { useState } from 'react';
import { Horse } from '@/components/HorseCard';
import { postToHastannons } from '@/lib/hastannons';
import { X, Check, AlertCircle } from 'lucide-react';
import styles from './ShareForm.module.css';

interface ShareFormProps {
    horse: Horse;
    onClose: () => void;
    onSuccess: (url: string) => void;
}

export default function ShareForm({ horse, onClose, onSuccess }: ShareFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default values mapped from horse data where possible
    const [formData, setFormData] = useState<{
        title: string;
        price: number | string;
        category: string;
        subcategory: string;
        breed: string;
        gender: string;
        birth_year: number | string;
        height: number | string;
        county: string;
        municipality: string;
        description: string;
        external_link: string;
        website: string;
        facebook: string;
        instagram: string;
        instagram_music: string;
        images: string[];
    }>({
        title: horse.name,
        price: 0,
        category: 'Hästar',
        subcategory: '',
        breed: horse.breed || '',
        gender: '', // StallMB doesn't seem to store gender strictly as "Sto"/"Hingst"/"Valack" in a reusable way, user must select
        birth_year: horse.age ? (new Date().getFullYear() - parseInt(horse.age)) : new Date().getFullYear(),
        height: 0,
        county: '',
        municipality: '',
        description: horse.description || '',
        external_link: '',
        // Social media defaults
        website: 'https://stallmb.com',
        facebook: 'https://www.facebook.com/profile.php?id=100068351711268',
        instagram: '@stall_mb',
        instagram_music: '',

        // Combine main image and gallery images, remove duplicates/empty
        images: [
            ...(horse.image_url ? [horse.image_url] : []),
            ...(horse.images || [])
        ].filter((v, i, a) => a.indexOf(v) === i && v),
    });

    const horseSubcategories = [
        "Allroundhäst", "Avelshäst", "Distanshäst", "Dressyrhäst", "Fälttävlanshäst",
        "Galopphäst", "Halvblod", "Hobbyhäst", "Hopphäst", "Kallblod",
        "Körning/brukshäst", "Ponny", "Ridhäst", "Sällskapshäst", "Terapihäst",
        "Travhäst", "Tävlingshäst", "Varmblod", "Westernhäst", "Övriga hästar"
    ];

    const breedingSubcategories = [
        "Hingst för avel", "Sto till avel"
    ];

    const currentSubcategories = formData.category === 'Hästar' ? horseSubcategories :
        formData.category === 'Avelsmarknad' ? breedingSubcategories : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await postToHastannons({
                ...formData,
                horse_name: horse.name,
                // Ensure correct types
                birth_year: Number(formData.birth_year),
                height: Number(formData.height),
                price: Number(formData.price),
            });

            if (response.success && response.ad) {
                onSuccess(response.ad.url);
            } else {
                setError(response.error || 'Ett okänt fel inträffade.');
            }
        } catch (err) {
            setError('Kunde inte kontakta servern.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Dela {horse.name} till Hastannons.se</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label>Rubrik *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Pris (SEK) *</label>
                            <div style={{ margin: '5px 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="no-price-check"
                                    checked={formData.price === 0 || formData.price === ''}
                                    onChange={(e) => {
                                        if (e.target.checked) setFormData({ ...formData, price: 0 });
                                    }}
                                    style={{ width: 'auto' }}
                                />
                                <label htmlFor="no-price-check" style={{ fontWeight: 'normal', margin: 0, cursor: 'pointer' }}>Ange ej pris</label>
                            </div>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, price: val === '' ? '' : Number(val) });
                                }}
                                required={formData.price !== 0 && formData.price !== ''}
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Kategori *</label>
                            <select
                                value={formData.category}
                                onChange={e => {
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                        subcategory: '' // Reset subcategory on category change
                                    });
                                }}
                                required
                            >
                                <option value="Hästar">Hästar</option>
                                <option value="Avelsmarknad">Avelsmarknad</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Underkategori *</label>
                            <select
                                value={formData.subcategory}
                                onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                required
                            >
                                <option value="">Välj underkategori...</option>
                                {currentSubcategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Kön *</label>
                            <select
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                required={formData.category === 'Hästar'}
                            >
                                <option value="">Välj kön...</option>
                                <option value="Sto">Sto</option>
                                <option value="Hingst">Hingst</option>
                                <option value="Valack">Valack</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Ras</label>
                            <input
                                type="text"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Födelseår</label>
                            <input
                                type="number"
                                value={formData.birth_year}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, birth_year: val === '' ? '' : Number(val) });
                                }}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Mankhöjd (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, height: val === '' ? '' : Number(val) });
                                }}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Län</label>
                            <select
                                value={formData.county}
                                onChange={e => setFormData({ ...formData, county: e.target.value })}
                            >
                                <option value="">Välj län...</option>
                                <option value="Blekinge län">Blekinge län</option>
                                <option value="Dalarnas län">Dalarnas län</option>
                                <option value="Gotlands län">Gotlands län</option>
                                <option value="Gävleborgs län">Gävleborgs län</option>
                                <option value="Hallands län">Hallands län</option>
                                <option value="Jämtlands län">Jämtlands län</option>
                                <option value="Jönköpings län">Jönköpings län</option>
                                <option value="Kalmar län">Kalmar län</option>
                                <option value="Kronobergs län">Kronobergs län</option>
                                <option value="Norrbottens län">Norrbottens län</option>
                                <option value="Skåne län">Skåne län</option>
                                <option value="Stockholms län">Stockholms län</option>
                                <option value="Södermanlands län">Södermanlands län</option>
                                <option value="Uppsala län">Uppsala län</option>
                                <option value="Värmlands län">Värmlands län</option>
                                <option value="Västerbottens län">Västerbottens län</option>
                                <option value="Västernorrlands län">Västernorrlands län</option>
                                <option value="Västmanlands län">Västmanlands län</option>
                                <option value="Västra Götalands län">Västra Götalands län</option>
                                <option value="Örebro län">Örebro län</option>
                                <option value="Östergötlands län">Östergötlands län</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Kommun</label>
                            <input
                                type="text"
                                value={formData.municipality}
                                onChange={e => setFormData({ ...formData, municipality: e.target.value })}
                                placeholder="T.ex. Falkor"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Hemsida</label>
                            <input
                                type="text"
                                value={formData.website}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Facebook (Länk)</label>
                            <input
                                type="text"
                                value={formData.facebook}
                                onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Instagram (Handle)</label>
                            <input
                                type="text"
                                value={formData.instagram}
                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                placeholder="@dittkonto"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Önskelåt vid delning av Hästannons</label>
                            <input
                                type="text"
                                value={formData.instagram_music}
                                onChange={e => setFormData({ ...formData, instagram_music: e.target.value })}
                                placeholder="T.ex. Queen - We Are The Champions"
                            />
                        </div>

                        <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                            <label>Extern Länk (T.ex. Blåbasen)</label>
                            <input
                                type="text"
                                value={formData.external_link}
                                onChange={e => setFormData({ ...formData, external_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Beskrivning</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Bilder (Välj vilka som ska skickas med)</label>
                        <div className={styles.imageGrid}>
                            {[
                                ...(horse.image_url ? [horse.image_url] : []),
                                ...(horse.images || [])
                            ].filter((v, i, a) => a.indexOf(v) === i && v).map((imgUrl, index) => (
                                <div
                                    key={index}
                                    className={`${styles.imageOption} ${formData.images?.includes(imgUrl) ? styles.selected : ''}`}
                                    onClick={() => {
                                        const currentImages = formData.images || [];
                                        const newImages = currentImages.includes(imgUrl)
                                            ? currentImages.filter(i => i !== imgUrl)
                                            : [...currentImages, imgUrl];
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                >
                                    <img src={imgUrl} alt={`Bild ${index + 1}`} />
                                    <div className={styles.checkmark}>
                                        <Check size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className={styles.helpText}>{formData.images?.length || 0} bilder valda</p>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Avbryt</button>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Publicerar...' : 'Publicera Annons'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
