import { getHorses } from '@/lib/data';
import HorseCard from '@/components/HorseCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function HorsesPage() {
    const horses = await getHorses();

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.header}>
                <div className="container">
                    <h1 className="h1 text-white">Våra hästar</h1>
                    <p className="p text-white" style={{ opacity: 0.9, marginTop: '1rem', maxWidth: '600px' }}>
                        Här presenterar vi våra avelston, hingstar och föl samt de som är till salu.
                    </p>
                </div>
            </div>

            <div className="container" style={{ margin: '4rem auto' }}>
                {/* Simple Filter placeholder - could be made client-side functional later */}
                <div className={styles.filterBar}>
                    <span className={styles.activeFilter}>Alla</span>
                    <span className={styles.filter}>Till Salu</span>
                    <span className={styles.filter}>Avelston</span>
                    <span className={styles.filter}>Hingstar</span>
                    <span className={styles.filter}>Unghästar</span>
                </div>

                <div className={styles.grid}>
                    {horses.map((horse) => (
                        <HorseCard key={horse.id} horse={horse} />
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
