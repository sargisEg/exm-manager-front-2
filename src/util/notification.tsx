import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import {createRoot} from 'react-dom/client';
import {toast} from 'react-toastify';

export const showNotify = (status: string, message: string) => {
    const tryRenderNotification = () => {
        document.querySelector('.notification-block')?.remove();
        const newDiv = document.createElement('div');
        newDiv.className = `notification-block ${status}`;
        document.body.appendChild(newDiv);
        const root = createRoot(newDiv);
        root.render(<RegistrationNotification status={status} message={message}/>);
    }
    tryRenderNotification();
};

export const RegistrationNotification: React.FC<{ status: string; message: string }> = ({status, message}) => {
    return (
        <>
            {status === 'success' ? <CheckCircleIcon htmlColor='#47BE7D'/> : status === 'info' ?
                <InfoIcon htmlColor='#1B84FF'/> : <CancelIcon htmlColor='#D9214E'/>}
            <p>{message}</p>
        </>
    );
};

export const showAuthNotify = (type: string, message: string) => {
    switch (type) {
        case 'success':
            toast.success(
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <CheckCircleIcon htmlColor='#47BE7D'/>{message}
                </div>, {
                    autoClose: 5000
                }
            )
            break;
        case 'error':
            toast.error(
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <CancelIcon htmlColor='#D9214E'/>{message}
                </div>, {
                    autoClose: 5000
                }
            )
            break;
        case 'info':
            toast.info(
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <InfoIcon htmlColor='#1B84FF'/>{message}
                </div>, {
                    autoClose: 5000
                }
            )
            break;
        default:
            toast.info(
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <InfoIcon htmlColor='#1B84FF'/>No message
                </div>, {
                    autoClose: 5000
                }
            )
            break;
    }
}


//         document.querySelector('.auth-notification-block')?.remove();
//         const newDiv = document.createElement('div');
//         newDiv.className = `auth-notification-block ${status}`;
//         const parentDiv = document.querySelector('.main');
//         if (parentDiv && newDiv) {
//             parentDiv.appendChild(newDiv);
//             const root = createRoot(newDiv);
//             root.render(<AuthNotification status={status} message={message} />);
//         } else {
//             setTimeout(tryRenderNotification, 500);
//         }
//     }
//     tryRenderNotification();
// };

// export const showAuthNotify = (status: string, message: string) => {
//     const notificationRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const newDiv = document.createElement('div');
//         newDiv.className = `auth-notification-block ${status}`;
//         const parentDiv = document.querySelector('.RaAppBar-toolbar');
//         const beforeDiv = document.querySelector('.nav-top-right');
//         if (parentDiv && beforeDiv) {
//             parentDiv.insertBefore(newDiv, beforeDiv);
//             notificationRef.current = newDiv;
//         }
//         return () => {
//             if (notificationRef.current) {
//                 notificationRef.current.remove();
//             }
//         };
//     }, []);

//     return (
//         <div ref={notificationRef}>
//             <AuthNotification status={status} message={message} />
//         </div>
//     );
// };

// export const AuthNotification: React.FC<{ status: string; message: string }> = ({ status, message }) => {
//     return (
//         <>
//             {status === 'success' ? <CheckCircleIcon htmlColor='#47BE7D' /> : status === 'info' ? <InfoIcon htmlColor='#1B84FF' /> : <CancelIcon htmlColor='#D9214E' />}
//             <p>{message}</p>
//         </>
//     );
// };