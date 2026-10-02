'use client';

import { useState, useEffect } from 'react';
import { getAdminSiteContent, saveSiteContent } from '@/actions/content';
import { uploadImage } from '@/actions/upload';
import { ChevronLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './page.module.css';

// Define the shape of our content
type AboutPageContent = {
    history_text: string;
    history_image: string;
    philosophy_text: string;
    philosophy_image: string;
};

type ConnemaraPageContent = {
    origin_image: string;
    character_image: string;
    usage_image: string;
};

export default function ContentAdminPage() {
    const [activeTab, setActiveTab] = useState<'about' | 'connemara'>('about');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State for contents
    const [aboutContent, setAboutContent] = useState<AboutPageContent>({
        history_text: '',
        history_image: '',
        philosophy_text: '',
        philosophy_image: ''
    });

    const [connemaraContent, setConnemaraContent] = useState<ConnemaraPageContent>({
        origin_image: '',
        character_image: '',
        usage_image: ''
    });

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const about = await getAdminSiteContent('about_page');
            if (about.content) {
                setAboutContent(prev => ({ ...prev, ...about.content }));
            }

            const connemara = await getAdminSiteContent('connemara_page');
            if (connemara.content) {
                setConnemaraContent(prev => ({ ...prev, ...connemara.content }));
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleImageUpload = async (
        file: File,
        section: 'about' | 'connemara',
        field: keyof AboutPageContent | keyof ConnemaraPageContent
    ) => {
        setMessage(null);
        try {
            const body = new FormData();
            body.append('file', file);
            body.append('kind', 'assets');
            const uploaded = await uploadImage(body);
            if (uploaded.error || !uploaded.url) {
                throw new Error(uploaded.error || 'Uppladdning misslyckades');
            }
            const publicUrl = uploaded.url;

            // Update State
            if (section === 'about') {
                setAboutContent(prev => ({ ...prev, [field]: publicUrl }));
            } else {
                setConnemaraContent(prev => ({ ...prev, [field]: publicUrl }));
            }

        } catch (err: any) {
            setMessage({ type: 'error', text: 'Kunde inte ladda upp bild: ' + err.message });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const payload = activeTab === 'about' ? aboutContent : connemaraContent;
            const id = activeTab === 'about' ? 'about_page' : 'connemara_page';
            const result = await saveSiteContent(id, payload);
            if (result.error) throw new Error(result.error);

            setMessage({ type: 'success', text: 'Ändringar sparade!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Kunde inte spara: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Laddar innehåll...</div>;

    return (
        <div className={styles.container}>
            <Link href="/admin" className={styles.backLink}>
                <ChevronLeft size={20} />
                Tillbaka till Admin
            </Link>

            <div className={styles.card}>
                <h1 className={styles.title}>Hantera Sidinnehåll</h1>

                <div className={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={clsx(styles.tab, activeTab === 'about' && styles.activeTab)}
                    >
                        Om StallMB
                    </button>
                    <button
                        onClick={() => setActiveTab('connemara')}
                        className={clsx(styles.tab, activeTab === 'connemara' && styles.activeTab)}
                    >
                        Rasen Connemara
                    </button>
                </div>

                {message && (
                    <div className={clsx(styles.message, message.type === 'success' ? styles.success : styles.error)}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className={styles.form}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Vår Historia</h2>
                            <div className={styles.field}>
                                <label>Text</label>
                                <textarea
                                    className={styles.textarea}
                                    value={aboutContent.history_text || ''}
                                    onChange={e => setAboutContent({ ...aboutContent, history_text: e.target.value })}
                                    placeholder="Skriv historian här..."
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Bild (vid texten)</label>
                                <ImageUploadField
                                    imageUrl={aboutContent.history_image}
                                    onUpload={(file) => handleImageUpload(file, 'about', 'history_image')}
                                    onRemove={() => setAboutContent({ ...aboutContent, history_image: '' })}
                                />
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Vår Filosofi</h2>
                            <div className={styles.field}>
                                <label>Text</label>
                                <textarea
                                    className={styles.textarea}
                                    value={aboutContent.philosophy_text || ''}
                                    onChange={e => setAboutContent({ ...aboutContent, philosophy_text: e.target.value })}
                                    placeholder="Skriv filosofin här..."
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Bild (vid filosofin)</label>
                                <ImageUploadField
                                    imageUrl={aboutContent.philosophy_image}
                                    onUpload={(file) => handleImageUpload(file, 'about', 'philosophy_image')}
                                    onRemove={() => setAboutContent({ ...aboutContent, philosophy_image: '' })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'connemara' && (
                    <div className={styles.form}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ursprung & Historia</h2>
                            <div className={styles.field}>
                                <label>Bild</label>
                                <ImageUploadField
                                    imageUrl={connemaraContent.origin_image}
                                    onUpload={(file) => handleImageUpload(file, 'connemara', 'origin_image')}
                                    onRemove={() => setConnemaraContent({ ...connemaraContent, origin_image: '' })}
                                />
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Karaktär & Egenskaper</h2>
                            <div className={styles.field}>
                                <label>Bild</label>
                                <ImageUploadField
                                    imageUrl={connemaraContent.character_image}
                                    onUpload={(file) => handleImageUpload(file, 'connemara', 'character_image')}
                                    onRemove={() => setConnemaraContent({ ...connemaraContent, character_image: '' })}
                                />
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Användningsområden</h2>
                            <div className={styles.field}>
                                <label>Bild</label>
                                <ImageUploadField
                                    imageUrl={connemaraContent.usage_image}
                                    onUpload={(file) => handleImageUpload(file, 'connemara', 'usage_image')}
                                    onRemove={() => setConnemaraContent({ ...connemaraContent, usage_image: '' })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.submitBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Sparar...' : 'Spara Ändringar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component for Image Upload
function ImageUploadField({ imageUrl, onUpload, onRemove }: {
    imageUrl: string,
    onUpload: (file: File) => void,
    onRemove: () => void
}) {
    return (
        <div className={styles.imageUpload}>
            {imageUrl ? (
                <div className={styles.preview}>
                    <Image src={imageUrl} alt="Uploaded content" fill style={{ objectFit: 'cover' }} />
                </div>
            ) : (
                <div className={styles.preview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    Ingen bild
                </div>
            )}

            <div className={styles.uploadControls}>
                <label className={styles.uploadLabel}>
                    <Upload size={16} />
                    {imageUrl ? 'Byt bild' : 'Ladda upp bild'}
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.hiddenInput}
                        onChange={(e) => {
                            if (e.target.files?.[0]) onUpload(e.target.files[0]);
                        }}
                    />
                </label>
                {imageUrl && (
                    <button className={styles.removeBtn} onClick={onRemove}>
                        <Trash2 size={16} /> Ta bort
                    </button>
                )}
            </div>
        </div>
    );
}
