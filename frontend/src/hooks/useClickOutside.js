import { useEffect } from 'react';

/**
 * Hook para detectar clics fuera de un elemento específico.
 * * @param {Object} ref - Referencia de React (useRef) del elemento a observar.
 * @param {Function} handler - Función a ejecutar cuando se hace clic fuera.
 */
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;