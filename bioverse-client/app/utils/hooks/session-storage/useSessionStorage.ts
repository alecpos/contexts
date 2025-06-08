import { useState, useEffect } from 'react';

/**
 * @author Nathan Cho
 *
 * Initialization: On initialization, it attempts to retrieve the value associated with the provided key from session storage.
 * If the value exists, it parses it from JSON; otherwise, it uses the provided initial value.
 * Setting Values: The setValue function allows you to update the value.
 * It supports both direct values and functions (for functional updates similar to useState).
 * When setting a new value, it also updates both session storage and local storage.
 * Listening to Storage Changes: The useEffect hook adds an event listener for the storage event,
 *     which fires when any change is made to the storage from another document (e.g., another tab or window).
 * This ensures that if the value is updated elsewhere, your component will react to those changes.
 * Note that this does not detect changes made to storage within the same page; it's primarily useful for syncing across tabs/windows.
 * Cleanup: The useEffect cleanup function removes the event listener when the component unmounts to avoid memory leaks.
 *
 * @param key
 * @param initialValue
 * @returns
 */
const useSessionStorage = (key: string, initialValue: any) => {
    // throw new Error('window is not defined');

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
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

    // Return a wrapped version of useState's setter function that...
    //... persists the new value to both sessionStorage and localStorage.
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

        // This only works for other documents, not the current one
        window.addEventListener('storage', handleStorageChange);

        // Clean up on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
};

export default useSessionStorage;
