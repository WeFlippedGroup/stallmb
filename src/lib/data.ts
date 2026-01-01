import { supabase } from '@/lib/supabase';
import { MOCK_HORSES } from '@/lib/mockData';
import { Horse } from '@/components/HorseCard';

export async function getHorses(): Promise<Horse[]> {
    try {
        const { data, error } = await supabase
            .from('horses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            return MOCK_HORSES;
        }
        return data as Horse[];
    } catch (e) {
        return MOCK_HORSES;
    }
}

export async function getHorse(id: string): Promise<Horse | undefined> {
    try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
            .from('horses')
            .select('*')
            .eq('id', id)
            .single();

        let horseData = data as Horse | undefined;

        // If not found in DB by ID, check if it's a mock ID
        if (error || !horseData) {
            horseData = MOCK_HORSES.find((h) => h.id === id);
        }

        // Enhancement: If we have a horse (from DB or Mock), try to find extra data (images) 
        // from local mock data if the DB record is missing it.
        // We match by name since IDs might differ between DB and Mock.
        if (horseData) {
            const mockMatch = MOCK_HORSES.find(m => m.name === horseData?.name || m.id === horseData?.id);
            if (mockMatch && mockMatch.images && (!horseData.images || horseData.images.length === 0)) {
                // Merge images from mock to the result
                horseData = {
                    ...horseData,
                    images: mockMatch.images
                };
            }
        }

        return horseData;
    } catch (e) {
        // Fallback to mock data on exception
        return MOCK_HORSES.find((h) => h.id === id);
    }
}

export type GuestbookEntry = {
    id: number;
    name: string;
    message: string;
    created_at: string;
};

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
    try {
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) {
            console.error('Error fetching guestbook:', error);
            return [];
        }
        return data as GuestbookEntry[];
    } catch (e) {
        return [];
    }
}

export async function addGuestbookEntry(name: string, message: string) {
    return await supabase
        .from('guestbook')
        .insert([{ name, message }])
        .select();
}
