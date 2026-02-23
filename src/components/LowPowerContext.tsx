'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface LowPowerState {
    isLowPower: boolean;
    toggle: () => void;
    reason: string | null;
}

const LowPowerContext = createContext<LowPowerState>({
    isLowPower: false,
    toggle: () => { },
    reason: null,
});

export function useLowPower() {
    return useContext(LowPowerContext);
}

export function LowPowerProvider({ children }: { children: ReactNode }) {
    const [isLowPower, setIsLowPower] = useState(false);
    const [reason, setReason] = useState<string | null>(null);

    /* ── Faqat URL parametr va admin sozlamasi orqali boshqariladi ── */
    useEffect(() => {
        // URL dan low=1 parametrini tekshirish
        const params = new URLSearchParams(window.location.search);
        if (params.get('low') === '1') {
            setIsLowPower(true);
            setReason('Link orqali yoqilgan');
            return; // URL param ustunlik qiladi
        }

        // Server-side (admin panel orqali sayt darajasida)
        const domain = window.location.hostname;
        fetch(`/api/site-config?domain=${domain}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.lowPowerMode) {
                    setIsLowPower(true);
                    setReason('Admin tomonidan yoqilgan');
                }
            })
            .catch(() => { /* ignore */ });
    }, []);

    const toggle = useCallback(() => {
        setIsLowPower((prev) => !prev);
        setReason(null);
    }, []);

    return (
        <LowPowerContext.Provider value={{ isLowPower, toggle, reason }}>
            {children}
        </LowPowerContext.Provider>
    );
}
