'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
            setLoading(false);
        };

        checkUser();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    // Don't wrap the login page with the dashboard layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return <div className={styles.loading}>Laddar admin...</div>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/admin" className={styles.logo}>
                        StallMB <span className={styles.badge}>Admin</span>
                    </Link>

                    <div className={styles.actions}>
                        <Link href="/" target="_blank" className={styles.link}>Till Hemsidan</Link>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <LogOut size={18} />
                            Logga ut
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
