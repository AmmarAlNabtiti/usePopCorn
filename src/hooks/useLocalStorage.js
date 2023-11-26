import { useEffect, useState } from 'react';

export function useLocalStorage() {
    const [value, setValue] = useState(() => {
        const storeValue = localStorage.getItem('watched') || null;
        if (storeValue === null) return [];
        return JSON.parse(storeValue);
    });
    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}