import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.brandHeader}>
                            <Image
                                src="/assets/logo-round.png"
                                alt="StallMB Logo"
                                width={50}
                                height={50}
                                className={styles.logoImage}
                            />
                            <span className={styles.logoText}>STALL<span className="text-accent">MB</span></span>
                        </div>
                        <p className={styles.description}>
                            Uppfödning av Connemarahästar med fokus på prestation och temperament.
                        </p>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.heading}>Utforska</h4>
                        <Link href="/" className={styles.link}>Hem</Link>
                        <Link href="/hastar" className={styles.link}>Våra hästar</Link>
                        <Link href="/connemara" className={styles.link}>Rasen Connemara</Link>
                    </div>

                    <div className={styles.contactCol}>
                        <h4 className={styles.heading}>Kontakt</h4>
                        <a href="mailto:info@stallmb.com" className={styles.contactItem}>
                            <Mail size={18} className="text-accent" />
                            <span>info@stallmb.com</span>
                        </a>
                        <div className={styles.contactItem}>
                            <Phone size={18} className="text-accent" />
                            <span>Marina Bengtsson<br />073-0867068</span>
                        </div>
                        <div className={styles.contactItem}>
                            <MapPin size={18} className="text-accent" />
                            <span>Stall MB<br />Rud Brånäng 9,<br />54 590 Töreboda</span>
                        </div>

                        <div className={styles.socials}>
                            <a href="https://www.facebook.com/profile.php?id=100068351711268" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.instagram.com/stall_mb/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <Instagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} StallMB. All rights reserved.</p>
                    <p className={styles.attribution}>
                        Skapad av <a href="https://hastannons.se" target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>Hastannons.se</a> – av kärlek till hästen
                    </p>
                </div>
            </div>
        </footer>
    );
}
