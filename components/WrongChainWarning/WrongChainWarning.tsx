import React from 'react';
import IconButton from '@/components/Buttons/IconButton/IconButton';
import Modal, { IModalProps } from '../Modal';
import WalletConnect from '@/assets/icons/wallet-connect.svg';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { observer } from 'mobx-react';

function WrongChainWarning({ show, onClose }: Omit<IModalProps, 'title'>) {
    const authStore: AuthStore = useAuthStore();
    const {  signInWithWalletConnect } = authStore;
    const connectWalletConnect = async () => {
        await signInWithWalletConnect();
    };

    return (
        <Modal show={show} onClose={onClose} title="Wrong chain!">
            <div className="flex flex-col w-80">
            <div className="text-manatee mb-8">
                The action you are about to do could not be done on the current chain, please follow the steps to switch
                to the proper chain.
            </div>
            <IconButton
                beforeIcon={true}
                icon={WalletConnect}
                text="WalletConnect"
                size="large"
                externalClass="bg-independence rounded-lg mt-2 font-bold text-semiBold text-white"
                onClick={connectWalletConnect}
            /></div>
        </Modal>
    );
}

export default WrongChainWarning;
