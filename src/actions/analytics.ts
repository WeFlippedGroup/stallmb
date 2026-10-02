'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function logVisit(path: string, userAgent?: string) {
    try {
        await prisma.visitorStat.create({
            data: {
                path,
                userAgent: userAgent?.slice(0, 500),
            },
        });
    } catch (err) {
        console.error('Unexpected error logging visit:', err);
    }
}

export async function getVisitorStats() {
    const session = await getSession();
    if (!session) return { total: 0, today: 0 };

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [total, todayCount] = await Promise.all([
            prisma.visitorStat.count(),
            prisma.visitorStat.count({ where: { visitedAt: { gte: today } } }),
        ]);

        return { total, today: todayCount };
    } catch (error) {
        console.error('Error fetching visitor stats:', error);
        return { total: 0, today: 0 };
    }
}
