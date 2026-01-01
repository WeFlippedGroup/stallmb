import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

import { getGuestbookEntries } from '@/lib/data';
import ContactForm from '@/components/ContactForm';
import Guestbook from '@/components/Guestbook';

// Increase revalidation time for guestbook updates
export const revalidate = 0; // Or keep it simple with 0 to always get fresh data

export default async function ContactPage() {
    const guestbookEntries = await getGuestbookEntries();

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.header}>
                <div className="container">
                    <h1 className="h1 text-white">Kontakta Oss</h1>
                    <p className={styles.headerSubtitle}>
                        Har du frågor om våra hästar eller verksamheten? Tveka inte att höra av dig.
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Contact Info Cards */}
                <div className={styles.grid}>
                    <div className={styles.infoCard}>
                        <div className={styles.iconCircle}>
                            <Mail size={32} />
                        </div>
                        <h3 className="h3">Mejl</h3>
                        <p className={styles.cardText}>Skicka ett mejl till oss så svarar vi så snart vi kan.</p>
                        <a href="mailto:info@stallmb.com" className={styles.link}>info@stallmb.com</a>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.iconCircle}>
                            <MapPin size={32} />
                        </div>
                        <h3 className="h3">Besök Oss</h3>
                        <p className={styles.cardText}>Vi finns på den vackra landsbygden utanför Töreboda.</p>
                        <span className={styles.address}>Töreboda, Sverige</span>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.iconCircle}>
                            <Instagram size={32} />
                        </div>
                        <h3 className="h3">Följ Oss</h3>
                        <p className={styles.cardText}>Följ vardagen på gården via våra sociala medier.</p>
                        <div className={styles.socialLinks}>
                            <a href="https://www.instagram.com/stall_mb/" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                                Instagram
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=100068351711268" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>

                {/* New Section: Contact Form & Guestbook */}
                <div className={styles.interactionSection}>
                    <div className={styles.formContainer}>
                        <ContactForm />
                    </div>
                    <div className={styles.guestbookContainer}>
                        <Guestbook initialEntries={guestbookEntries} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
