// frontend/src/hooks/useCSRFToken.ts
import { useState, useEffect } from 'react';

const useCSRFToken = () => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    const fetchCSRFToken = async () => {
    try {
        const response = await fetch('/csrf/', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
        const data = await response.json();
        setCsrfToken(document.cookie.split('csrftoken=')[1]?.split(';')[0] || null);
        }
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
    };

    useEffect(() => {
    fetchCSRFToken();
    }, []);

    return { csrfToken, refreshCSRFToken: fetchCSRFToken };
};

export default useCSRFToken;