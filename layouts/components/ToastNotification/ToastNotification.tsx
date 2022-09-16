import React, {useState, useEffect} from 'react';
import { observer } from 'mobx-react';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import classes from '@/utils/classes';
import styles from './toastNotification.module.css';
import Error from '@/assets/icons/errorNotif.svg';
import Success from '@/assets/icons/successNotif.svg';
import Warning from '@/assets/icons/warningNotif.svg';
import Info from '@/assets/icons/infoNotif.svg';

const ToastNotification = () => {
    const types = {
        'Error': Error,
        'Success': Success,
        'Warning': Warning,
        'Info': Info,
    };
    const [showToast, setShowToast] = useState(false);
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const {
        showToastNotification,
        notificationType,
        notificationTime,
        notificationChild,
        changeToastNotificationState
    } = globalStore;
    // @ts-ignore
    const NotificationIcon = types[notificationType];

    useEffect(() => {
        if (showToastNotification) {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                changeToastNotificationState(false);
            }, notificationTime);
        }
    }, [showToastNotification]);
    const toastNotificationClass = classes([showToast ? 'flex' : 'hidden', styles.wrapper]);

    return (
        <div className={toastNotificationClass}>
            <NotificationIcon className={classes(["mr-4", styles.typeIcon])}/>
            <div>
                {notificationChild}
            </div>
        </div>
    );
};

export default observer(ToastNotification);