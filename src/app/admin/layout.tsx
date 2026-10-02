'use client';

import { useState } from 'react';
import { logout } from '@/actions/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push('/admin/login');
        router.refresh();
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
                        <button onClick={handleLogout} className={styles.logoutBtn} disabled={loggingOut}>
                            <LogOut size={18} />
                            {loggingOut ? 'Loggar ut...' : 'Logga ut'}
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
