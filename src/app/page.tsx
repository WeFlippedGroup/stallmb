import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import HorseCard from '@/components/HorseCard';
import { getHorses } from '@/lib/data';
import styles from './page.module.css';

export default async function Home() {
  const horses = await getHorses();
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />

      <section className={styles.introSection}>
        <div className="container">
          <div className={styles.introContent}>
            <h2 className="h2 text-primary" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              Välkommen till <span className="text-accent">StallMB</span>
            </h2>
            <p className="p" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Vi föder upp och utbildar Connemarahästar av högsta kvalitet. Vårt mål är att ta fram hållbara,
              trevliga och prestationsvilliga individer som passar både till tävling och som bästa vän.
              Här på vår gård i Töreboda lever hästarna i en harmonisk miljö med stora hagar och daglig hantering.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Horses Preview */}
      <section className={styles.previewSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h3 className="h2 text-primary">Våra hästar</h3>
            <p className="p" style={{ maxWidth: '600px', margin: '1rem auto 0', opacity: 0.8 }}>
              Här presenterar vi våra avelston, hingstar och föl samt de som är till salu.
            </p>
          </div>

          <div className={styles.gridPlaceholder}>
            {horses.slice(0, 6).map((horse) => (
              <HorseCard key={horse.id} horse={horse} />
            ))}
          </div>

          <div className={styles.viewAllContainer}>
            <Link href="/hastar" className={styles.viewAllLink}>
              Se alla hästar <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
