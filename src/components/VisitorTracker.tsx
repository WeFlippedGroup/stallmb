'use client';

import { useEffect, useRef } from 'react';
import { logVisit } from '@/actions/analytics';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double counting in React Strict Mode or fast re-renders
        if (initialized.current) return;

        // Key for session storage
        const SESSION_KEY = 'stallmb_session_active';

        const hasActiveSession = sessionStorage.getItem(SESSION_KEY);

        if (!hasActiveSession) {
            // New session! Log it.
            logVisit(pathname, navigator.userAgent);

            // Mark session as active
            sessionStorage.setItem(SESSION_KEY, 'true');
        }

        initialized.current = true;
    }, []); // Run once on mount

    return null; // This component renders nothing
}
