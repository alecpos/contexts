'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState<T>(() => {
        // Initialize state with local storage value or fallback
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : fallbackValue;
        }
        return fallbackValue;
    });

    useEffect(() => {
        // Update local storage when value changes
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue] as const;
}
