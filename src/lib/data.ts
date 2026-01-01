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
