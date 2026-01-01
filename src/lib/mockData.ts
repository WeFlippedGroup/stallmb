import { Horse } from '@/components/HorseCard';

export const MOCK_HORSES: Horse[] = [
    {
        id: 'fls-poetic-sydney',
        name: 'F.L.S Poetic Sydney',
        breed: 'Connemara',
        age: '2015',
        description: 'M1-372004000032587. Ett lovande avelssto.',
        image_url: '/assets/horses/fls-poetic-sydney/1.jpg',
        category: 'breeding',
        pedigree: {
            sire: { name: 'Poetic Kelly', id: '' },
            dam: { name: '', id: '' },
            damsire: { name: 'Gerryhinch Millrace', id: '' }
        }
    },
    {
        id: 'realt-chois-fharraige',
        name: 'Realt Chois Fharraige',
        breed: 'Connemara',
        age: '2013',
        description: 'M1-372004000030876. Ett fint avelssto.',
        image_url: '/assets/horses/realt-chois-fharraige/1.jpg',
        category: 'breeding',
        pedigree: {
            sire: { name: 'Teach Mor King', id: '' },
            dam: { name: '', id: '' },
            damsire: { name: 'Smokey Finn', id: '' }
        }
    },
    {
        id: 'dunguaire-aisling',
        name: 'Dunguaire Aisling',
        breed: 'Connemara',
        age: '2010',
        description: 'M1-372004000025423. Imp Irland. Ett vackert avelssto.',
        image_url: '/assets/horses/dunguaire-aisling/1.jpg',
        category: 'breeding',
        pedigree: {
            sire: { name: '', id: '' }, // Sire not provided
            dam: { name: 'Currachmore Cashel', id: '' },
            damsire: { name: 'Kylemore Rocky', id: '' }
        }
    },
    {
        id: 'gentle-farms-breeze',
        name: 'Gentle Farm’s Breeze RC 1425',
        breed: 'Connemara',
        age: '2005',
        description: 'Ett avelssto av högsta klass.',
        image_url: '/assets/horses/gentle-farms-breeze/1.jpg',
        category: 'breeding',
        pedigree: {
            sire: { name: 'Kulan Kavat RC 90', id: '' },
            dam: { name: '', id: '' },
            damsire: { name: 'Myrens Wilbur RC 59', id: '' }
        }
    },
    {
        id: 'midnight-lady',
        name: 'Midnight Lady',
        breed: 'Connemara',
        age: '2012',
        description: 'Imp Irland. Ett fantastiskt avelssto med fina linjer.',
        image_url: '/assets/horses/midnight-lady/1.jpg',
        category: 'breeding',
        pedigree: {
            sire: { name: 'Ballinavilla Prince', id: '' },
            dam: { name: '', id: '' }, // Dam name not provided
            damsire: { name: 'Callowfeenish Buachaill', id: '' }
        }
    }
];
