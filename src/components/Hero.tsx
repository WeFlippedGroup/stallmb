'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay} />
            {/* Background Image is handled in CSS for better cover control, or Next/Image with absolute fill */}
            {/* We will use CSS background for simplicity with the 'fixed' attachment for parallax feel */}

            <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <div className={styles.content}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h1 className={styles.title}>
                            Kvalitet.<br />
                            <span className="text-accent">Passion.</span><br />
                            Connemara.
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className={styles.subtitleWrapper}
                    >
                        <p className={styles.subtitle}>
                            StallMB i Töreboda – Uppfödning av den fantastiska rasen Connemara.
                        </p>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <div className={styles.line}></div>
            </motion.div>
        </section>
    );
}
