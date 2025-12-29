import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import styles from './page.module.css';

export default function ConnemaraPage() {
    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.header}>
                <div className="container">
                    <h1 className="h1 text-white">Rasen Connemara</h1>
                    <p className={styles.headerSubtitle}>
                        Irlands gåva till hästvärlden – en unik kombination av styrka, skönhet och intelligens.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles.contentWrapper}>

                    <section className={styles.section}>
                        <div className={styles.textCol}>
                            <h2 className={styles.sectionTitle}>Ursprung & Historia</h2>
                            <p className="p">
                                Connemaraponnyn härstammar från det vilda och karga landskapet Connemara på Irlands västkust.
                                Här har rasen under århundraden formats av det hårda klimatet, vilket har gett upphov till
                                en otroligt tålig och sund häst. Legenden säger att spanska armada-hästar som strandkraschade
                                på 1500-talet blandades med de lokala vilda ponnyerna, vilket bidrog till rasens ädla drag.
                            </p>
                        </div>
                        <div className={styles.imageCol}>
                            {/* Placeholder for a historic or landscape image */}
                            <div className={styles.placeholderImage}>Landskap från Connemara</div>
                        </div>
                    </section>

                    <section className={styles.sectionReverse}>
                        <div className={styles.textCol}>
                            <h2 className={styles.sectionTitle}>Karaktär & Egenskaper</h2>
                            <p className="p">
                                Det som verkligen utmärker en Connemara är dess fantastiska temperament. De är kända för att vara
                                modiga, intelligenta och arbetsvilliga. Det är en ponny som tänker själv men som alltid vill göra rätt.
                                <br /><br />
                                Exteriört är de kompakta men ädla, med en stark rygg, välformad hals och ett uttrycksfullt huvud.
                                De rör sig med en fri och vägvinnande steglängd som gör dem till utmärkta ridhästar för både barn och vuxna.
                            </p>
                        </div>
                        <div className={styles.imageCol}>
                            <div className={styles.placeholderImage}>Connemara profil</div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.textCol}>
                            <h2 className={styles.sectionTitle}>Användningsområden</h2>
                            <p className="p">
                                Connemaran är den ultimata allroundhästen. De tävlar framgångsrikt i svår hoppning och dressyr,
                                men är lika populära inom fälttävlan och körning.
                                <br /><br />
                                Tack vare sitt lugna psyke och sin stora hoppkapacitet är de ofta det självklara valet
                                för den satsande tävlingsryttaren som vill ha en bästa vän att klättra i klasserna med.
                            </p>
                        </div>
                        <div className={styles.imageCol}>
                            <div className={styles.placeholderImage}>Hoppning / Tävling</div>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
