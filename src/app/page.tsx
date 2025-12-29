import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function Home() {
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

      {/* Placeholder for "Våra Hästar" Preview - Will be dynamic later */}
      <section className={styles.previewSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h3 className="h2 text-primary">Våra Hästar</h3>
            <p className="p" style={{ maxWidth: '600px', margin: '1rem auto 0', opacity: 0.8 }}>
              Här presenterar vi våra avelston, unghästar och de hästar vi har till salu.
            </p>
          </div>

          <div className={styles.gridPlaceholder}>
            {/* We will replace this with a dynamic Grid component later */}
            <div className={styles.placeholderCard}>Coming Soon: Häst 1</div>
            <div className={styles.placeholderCard}>Coming Soon: Häst 2</div>
            <div className={styles.placeholderCard}>Coming Soon: Häst 3</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
