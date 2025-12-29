import { Horse } from '@/components/HorseCard';

export const MOCK_HORSES: Horse[] = [
    {
        id: '1',
        name: 'Misty Blue',
        breed: 'Connemara',
        age: '8 år',
        description: 'Ett fantastiskt sto med otrolig hoppteknik. Vunnit allt som går att vinna.',
        image_url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800', // Placeholder
        category: 'breeding'
    },
    {
        id: '2',
        name: 'Golden Storm',
        breed: 'Connemara',
        age: '4 år',
        description: 'Lovande unghäst med rörelser utöver det vanliga. Inriden och hoppad.',
        image_url: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800',
        category: 'sale'
    },
    {
        id: '3',
        name: 'Silver Shadow',
        breed: 'Connemara',
        age: '12 år',
        description: 'En riktig läromästare. Trygg, stabil och älskar att arbeta.',
        image_url: 'https://images.unsplash.com/photo-1534073379657-36e654c69800?auto=format&fit=crop&q=80&w=800',
        category: 'breeding'
    }
];
