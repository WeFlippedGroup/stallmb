import { Horse } from '@/components/HorseCard';

export const MOCK_HORSES: Horse[] = [
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
