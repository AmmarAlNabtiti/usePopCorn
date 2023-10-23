import { useEffect } from 'react';
const a = ['a', 'b'];
export function useKey(key, action) {
    const res = (a.map((a) => a));
    // GO BACK USING Esc button
    useEffect(() => {
        function callback(e) {

            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
            };
        }


        document.addEventListener('keydown', callback);

        return () => {
            document.removeEventListener('keydown', action);
        };

    }, [action, key]);

}