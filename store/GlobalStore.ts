import React from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { RootStore, useRootStore } from './RootStore';
import { TokenBalance } from '@/data/web3/wallet/types';

export class GlobalStore {
    root: RootStore;
    showSignInModal: boolean = false;
    showUserEmailConfirmationInMenu: boolean = true;
    showToastNotification: boolean = false;
    notificationType: string = 'Error';
    notificationTime: number = 5000;
    notificationChild: React.ReactNode = '';

    constructor(root: RootStore) {
        this.root = root;

        makeObservable(this, {
            showSignInModal: observable,
            showToastNotification: observable,
            showUserEmailConfirmationInMenu: observable,
            notificationType: observable,
            notificationTime: observable,
            notificationChild: observable,
            changeSignInModalState: action,
            changeToastNotificationState: action,
            changeShowUserEmailConfirmationInMenuState: action,
        });
    }

    hydrate(data?: any) {
        if (data) {
        }
    }

    changeSignInModalState = (value: boolean) => {
        runInAction(() => {
            this.showSignInModal = value;
        });
    };

    changeShowUserEmailConfirmationInMenuState = (value: boolean) => {
        runInAction(() => {
            this.showUserEmailConfirmationInMenu = value;
        });
    };

    changeToastNotificationState = async (
        state: boolean = false,
        child: React.ReactNode = '',
        type: string = 'Error',
        timer: number = 5000
    ) => {
        runInAction(() => {
            this.showToastNotification = state;
            this.notificationType = type;
            this.notificationTime = timer;
            this.notificationChild = child;
        });
    };
}

export const useGlobalStore: () => GlobalStore = () => {
    const { globalStore } = useRootStore();
    return globalStore;
};
