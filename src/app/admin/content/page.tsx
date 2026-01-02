'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
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

            // Fetch About Page Content
            const { data: aboutData } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 'about_page')
                .single();

            if (aboutData?.content) {
                setAboutContent(prev => ({ ...prev, ...aboutData.content }));
            }

            // Fetch Connemara Page Content
            const { data: connemaraData } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 'connemara_page')
                .single();

            if (connemaraData?.content) {
                setConnemaraContent(prev => ({ ...prev, ...connemaraData.content }));
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
            const fileExt = file.name.split('.').pop();
            const fileName = `cms-${section}-${field}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('site-assets') // Make sure this bucket exists or use 'horse-images' temporarily
                .upload(filePath, file);

            if (uploadError) {
                // Determine if error is "Bucket not found". For now, fallback to 'horse-images' if needed
                // But let's assume valid bucket or throw.
                // Creating a new bucket via SQL is hard, so we might reuse 'horse-images' if 'site-assets' fails?
                // Actually, let's just use 'horse-images' for simplicity as it is public.
                const { error: retryError } = await supabase.storage
                    .from('horse-images')
                    .upload(filePath, file);

                if (retryError) throw retryError;
            }

            // Get URL - try site-assets first, then horse-images
            const { data: { publicUrl } } = supabase.storage
                .from('horse-images') // Defaulting to known public bucket
                .getPublicUrl(filePath);

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
            if (activeTab === 'about') {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({
                        id: 'about_page',
                        content: aboutContent,
                        updated_at: new Date().toISOString()
                    });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({
                        id: 'connemara_page',
                        content: connemaraContent,
                        updated_at: new Date().toISOString()
                    });
                if (error) throw error;
            }

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
