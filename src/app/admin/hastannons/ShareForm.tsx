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
    const [formData, setFormData] = useState({
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
        external_link: `https://stallmb.com/hastar/${horse.id}`,
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
                            <label>Pris (SEK) * (Ange 0 för ej angivet)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                                min="0"
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
                                onChange={e => setFormData({ ...formData, birth_year: Number(e.target.value) })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Mankhöjd (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
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
                    </div>

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
                                </div >

        <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Avbryt</button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Publicerar...' : 'Publicera Annons'}
            </button>
        </div>
                            </form >
                        </div >
        </div >
                );
}
