'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import clsx from 'clsx';
import Image from 'next/image';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={clsx(
                styles.nav,
                isScrolled ? styles.scrolled : styles.transparent
            )}
        >
            <div className="container">
                <div className={styles.inner}>
                    {/* Logo Section */}
                    <Link href="/" className={styles.logoLink}>
                        <div className={styles.logoContainer}>
                            {/* Using text for now if image doesn't load perfectly, but structure for image is here */}
                            <Image
                                src="/assets/logo-round.png"
                                alt="StallMB Logo"
                                width={40}
                                height={40}
                                className={styles.logoImage}
                            />
                            <span className={styles.logoText}>STALL<span className="text-accent">MB</span></span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={styles.desktopMenu}>
                        <Link href="/" className={styles.link}>Hem</Link>
                        <Link href="/hastar" className={styles.link}>Våra Hästar</Link>
                        <Link href="/connemara" className={styles.link}>Om Connemaror</Link>
                        <Link href="/kontakt" className={styles.link}>Kontakt</Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={clsx(styles.mobileMenu, isMobileMenuOpen && styles.open)}>
                <div className={styles.mobileLinks}>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Hem</Link>
                    <Link href="/hastar" onClick={() => setIsMobileMenuOpen(false)}>Våra Hästar</Link>
                    <Link href="/connemara" onClick={() => setIsMobileMenuOpen(false)}>Om Connemaror</Link>
                    <Link href="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
                </div>
            </div>
        </nav>
    );
}
