import { useEffect, useState } from 'react';
import { checkAuthorization } from './authUtils';

const useLoggedInStatus = () => {
    const [fetchLoading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isOkay = checkAuthorization();
        if (isOkay) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false)
    }, []);

    return { fetchLoading, isLoggedIn };
};

export default useLoggedInStatus;