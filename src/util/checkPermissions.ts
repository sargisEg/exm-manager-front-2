import { useEffect, useState } from 'react';

const useGetPermissionName = () => {
    const [roleLoading, setLoading] = useState(true);
    const [roleName, setRoleName] = useState(localStorage.getItem('role'));

    useEffect(() => {
        if (!roleName) {
            setRoleName(null);
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    return { roleLoading, roleName };
};

export default useGetPermissionName;
