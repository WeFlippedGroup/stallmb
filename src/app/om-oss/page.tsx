import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function AboutPage() {
    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.header}>
                <div className="container">
                    <h1 className="h1 text-white">Om StallMB</h1>
                    <p className={styles.headerSubtitle}>
                        En familjär uppfödning i hjärtat av Töreboda med passion för kvalitet och hållbarhet.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles.contentWrapper}>

                    <section className={styles.section}>
                        <div className={styles.textCol}>
                            <h2 className={styles.sectionTitle}>Vår Historia</h2>
                            <p className="p">
                                StallMB grundades ur en livslång kärlek till hästar. Det som började som en liten verksamhet
                                har växt till att bli en respekterad uppfödning av Connemarahästar. Vi har alltid strävat efter
                                att föda upp individer som inte bara är vackra att se på, utan som också har det temperament
                                och den hållbarhet som krävs för ett långt liv på tävlingsbanan eller som älskad familjemedlem.
                            </p>
                        </div>
                        <div className={styles.imagePlaceholder}>
                            Gårbild / Stallbild
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.imagePlaceholder}>
                            Häst i hagen
                        </div>
                        <div className={styles.textCol}>
                            <h2 className={styles.sectionTitle}>Vår Filosofi</h2>
                            <p className="p">
                                Vi tror på att låta hästar vara hästar. Våra unghästar växer upp i stora kuperade hagar
                                där de får röra sig fritt och bygga naturlig styrka. Vi lägger stor vikt vid hantering
                                från första dagen, vilket ger trygga och sociala individer.
                            </p>
                        </div>
                    </section>

                    {/* CTA to Connemara Info */}
                    <section className={styles.ctaSection}>
                        <div className={styles.ctaContent}>
                            <h2 className="h2 text-white">En ras vi älskar</h2>
                            <p className={styles.ctaText}>
                                Vi har valt att specialisera oss på Connemaran – en ras som kombinerar styrka,
                                mod och ett fantastiskt psyke.
                            </p>
                            <Link href="/connemara" className={styles.ctaButton}>
                                Läs mer om rasen Connemara
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
