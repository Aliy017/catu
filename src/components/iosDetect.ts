'use client';

/**
 * iOS / Safari / Touch device detection utilities.
 * Used to disable heavy GPU/scroll effects on touch devices.
 *
 * IMPORTANT: Results are cached per-environment (SSR vs client).
 * SSR always returns false. Client result is cached after first real check.
 */

let _isIOS: boolean | null = null;
let _isSafari: boolean | null = null;

export function isIOS(): boolean {
    // Never cache during SSR — return false but don't save it
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    // Only cache client-side result
    if (_isIOS !== null) return _isIOS;

    const ua = navigator.userAgent;

    _isIOS =
        // iPhone, iPod, older iPad
        /iPad|iPhone|iPod/.test(ua) ||
        // Modern iPad (iPadOS 13+) — reports as Mac
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
        // Extra fallback: check for Mac + touch (covers future iPadOS changes)
        (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

    return _isIOS;
}

export function isSafari(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    if (_isSafari !== null) return _isSafari;

    const ua = navigator.userAgent;
    _isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    return _isSafari;
}

/** True when running on iOS Safari — the main target for perf fixes */
export function isIOSSafari(): boolean {
    return isIOS() && isSafari();
}
