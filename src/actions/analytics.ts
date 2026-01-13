'use server';

import { supabase } from '@/lib/supabase';

export async function logVisit(path: string, userAgent?: string) {
    try {
        const { error } = await supabase.from('visitor_stats').insert({
            path,
            user_agent: userAgent
        });

        if (error) {
            console.error('Error logging visit:', error);
        }
    } catch (err) {
        console.error('Unexpected error logging visit:', err);
    }
}

export async function getVisitorStats() {
    try {
        // Get total count
        const { count: totalCount, error: totalError } = await supabase
            .from('visitor_stats')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // Get today's count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count: todayCount, error: todayError } = await supabase
            .from('visitor_stats')
            .select('*', { count: 'exact', head: true })
            .gte('visited_at', today.toISOString());

        if (todayError) throw todayError;

        return {
            total: totalCount || 0,
            today: todayCount || 0
        };
    } catch (error) {
        console.error('Error fetching visitor stats:', error);
        return { total: 0, today: 0 };
    }
}
