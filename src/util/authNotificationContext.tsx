import { createContext, useContext, useState } from 'react';

// export const AuthNotification: React.FC<{ setNotification: any; status: string; message: string }> = ({ setNotification, status, message }) => {
//     return (
//         <div onClick={() => setNotification(null)} className={`auth-notification-block ${status}`}>
//             {status === 'success' ? <CheckCircleIcon htmlColor='#47BE7D' /> : status === 'info' ? <InfoIcon htmlColor='#1B84FF' /> : <CancelIcon htmlColor='#D9214E' />}
//             <p>{message}</p>
//         </div>
//     );
// };

export const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
    const [notification, setNotification] = useState<any>('');

    const showNotification = (status: any) => {
        setNotification(status);
    };

    return (
        <NotificationContext.Provider value={{ value: notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const notification = useContext(NotificationContext);
    return notification;
};
