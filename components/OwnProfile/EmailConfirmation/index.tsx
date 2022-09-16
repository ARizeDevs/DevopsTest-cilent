import { observer } from 'mobx-react';
import IconClose from '@/assets/icons/close.svg';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import {EmailVerificationStatusEnum } from '@/data/user/types';
import NotVerified from './NotVerified';
import Sent from './Sent';

const EmailConfirmation = () => {
    const emailRegex = /^[._a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i;

    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { user } = authStore;

    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const {
        showUserEmailConfirmationInMenu,
        changeShowUserEmailConfirmationInMenuState,
    } = globalStore;

    return (
        <>
            {showUserEmailConfirmationInMenu && user?.emailVerificationStatus !== EmailVerificationStatusEnum.Confirmed && (
                <div className="p-2 center bg-space-cadet text-white">
                    <div className="flex justify-end">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                changeShowUserEmailConfirmationInMenuState(false);
                            }}
                        >
                            <IconClose />
                        </div>
                    </div>
                    {[EmailVerificationStatusEnum.NotVerified, EmailVerificationStatusEnum.Expired].includes(user?.emailVerificationStatus!) && <NotVerified />}
                    {user?.emailVerificationStatus === EmailVerificationStatusEnum.Sent && <Sent />}
                </div>
            )}
        </>
    );
};

export default observer(EmailConfirmation);
