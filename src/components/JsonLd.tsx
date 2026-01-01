export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'StallMB',
        image: 'https://stallmb.com/assets/logo-round.png',
        '@id': 'https://stallmb.com',
        url: 'https://stallmb.com',
        telephone: '',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rud Brånäng 9',
            addressLocality: 'Töreboda',
            postalCode: '54 590',
            addressCountry: 'SE',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 58.7, // Only approximate, user location specific coordinates would be better
            longitude: 14.1,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '09:00',
            closes: '18:00',
        },
        sameAs: [
            'https://www.facebook.com/profile.php?id=100068351711268',
            'https://www.instagram.com/stall_mb/',
        ],
        description: 'Uppfödning av Connemarahästar med fokus på prestation och temperament i Töreboda.',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
