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
