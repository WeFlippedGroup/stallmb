import { getHorses } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Info, Trophy, FileText, Calendar, Tag } from 'lucide-react';
import styles from './page.module.css';

// Generate static params for all horses at build time (optional but good for performance)
export async function generateStaticParams() {
    const horses = await getHorses();
    return horses.map((horse) => ({
        id: horse.id,
    }));
}

export default async function HorseDetailPage({ params }: { params: { id: string } }) {
    const horses = await getHorses();
    const horse = horses.find((h) => h.id === params.id);

    if (!horse) {
        return (
            <div className={styles.notFound}>
                <Navbar />
                <div className="container" style={{ marginTop: '10rem', textAlign: 'center' }}>
                    <h1>Hästen hittades inte</h1>
                    <Link href="/hastar" className={styles.backLink}>Tillbaka till alla hästar</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <Navbar />

            {/* Hero / Header with Image Background if possible, or just top spacing */}
            <div className={styles.topSpacer} />

            <div className="container">

                <Link href="/hastar" className={styles.backLink}>
                    <ChevronLeft size={20} />
                    Tillbaka till alla hästar
                </Link>

                <div className={styles.contentGrid}>

                    {/* Left Column: Image */}
                    <div className={styles.imageColumn}>
                        <div className={styles.mainImageWrapper}>
                            {horse.image_url ? (
                                <Image
                                    src={horse.image_url}
                                    alt={horse.name}
                                    fill
                                    priority
                                    style={{ objectFit: 'cover' }}
                                    className={styles.mainImage}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>Ingen bild tillgänglig</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className={styles.infoColumn}>
                        <div className={styles.header}>
                            <span className={styles.categoryBadge}>{getCategoryLabel(horse.category)}</span>
                            <h1 className={styles.name}>{horse.name}</h1>
                            <p className={styles.subtitle}>{horse.breed} • {horse.age}</p>
                        </div>

                        <div className={styles.description}>
                            <p>{horse.description}</p>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <Tag size={18} className="text-primary" />
                                <span><strong>Ras:</strong> {horse.breed}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar size={18} className="text-primary" />
                                <span><strong>Ålder:</strong> {horse.age}</span>
                            </div>
                            {/* Placeholders for future data expansion */}
                            <div className={styles.detailItem}>
                                <Trophy size={18} className="text-primary" />
                                <span><strong>Nivå:</strong> Ej angivet</span>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className={styles.contactCard}>
                            <h3>Intresserad av {horse.name}?</h3>
                            <p>Kontakta oss för mer information, filmer eller provridning.</p>
                            <Link href="/kontakt" className={styles.contactBtn}>
                                Kontakta Oss
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Extra Sections: Pedigree & Results (Placeholders) */}
                <div className={styles.extraSections}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FileText size={24} />
                            <h2>Stamtavla</h2>
                        </div>
                        <div className={styles.comingSoonBox}>Stamtavla kommer snart...</div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Trophy size={24} />
                            <h2>Resultat & Meriter</h2>
                        </div>
                        <div className={styles.comingSoonBox}>Resultat kommer snart...</div>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}

function getCategoryLabel(cat: string) {
    const map: Record<string, string> = {
        breeding: 'Avelssto',
        sale: 'Till Salu',
        youngster: 'Unghäst',
        retired: 'Pensionär'
    };
    return map[cat] || cat;
}
