'use client';

/**
 * iOS / Safari detection utilities.
 * Used to disable heavy GPU effects that cause jank on mobile Safari.
 */

let _isIOS: boolean | null = null;
let _isSafari: boolean | null = null;

export function isIOS(): boolean {
    if (_isIOS !== null) return _isIOS;
    if (typeof navigator === 'undefined') return false;

    _isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return _isIOS;
}

export function isSafari(): boolean {
    if (_isSafari !== null) return _isSafari;
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent;
    _isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    return _isSafari;
}

/** True when running on iOS Safari — the main target for perf fixes */
export function isIOSSafari(): boolean {
    return isIOS() && isSafari();
}
