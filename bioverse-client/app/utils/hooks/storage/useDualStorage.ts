import { useState, useEffect } from 'react';

/**
 * A hook that manages state in both session storage and local storage
 * @param key The key to store the value under
 * @param initialValue The initial value if no stored value exists
 * @returns A tuple containing the stored value and a setter function
 */
const useDualStorage = (key: string, initialValue: any) => {
    // State to store our value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Try to get from session storage first, then local storage, then use initial value
            const sessionItem = window.sessionStorage.getItem(key);
            if (sessionItem) return JSON.parse(sessionItem);

            const localItem = window.localStorage.getItem(key);
            return localItem ? JSON.parse(localItem) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists to both storages
    const setValue = (value: any | ((val: any) => any)) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state to both storages
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                const newValue = e.newValue ? JSON.parse(e.newValue) : null;
                setStoredValue(newValue);
            }
        };

        // Listen for storage changes in other tabs/windows
        window.addEventListener('storage', handleStorageChange);

        // Clean up on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
};

export default useDualStorage;
