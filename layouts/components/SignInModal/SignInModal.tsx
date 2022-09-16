import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import IconButton from 'components/Buttons/IconButton/IconButton';
import detect from '@/utils/detect';
import classes from '@/utils/classes';
import styles from './signInModal.module.css';
import SignIN from '@/assets/images/signIn.jpg';
import Loading from '@/assets/images/loading.svg';
import MetaMask from '@/assets/icons/meta-mask.svg';
import WalletConnect from '@/assets/icons/wallet-connect.svg';
import { useRouter } from 'next/router';

const SignInModal = (props: any) => {
    const { thumbnail } = props;
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { showSignInModal, changeSignInModalState } = globalStore;
    const signWalletButtonRef = useRef(null);
    const router = useRouter();
    const {
        signInWithMetaMask,
        signInWithWalletConnect,
        signWalletForLogin,
        isWalletConnected,
        isWalletSignedForLogin
    } = authStore;
    const [showModal, setShowModal] = useState(showSignInModal);
    const connectMetamask = async () => {
        await signInWithMetaMask();
    };

    const connectWalletConnect = async () => {
        await signInWithWalletConnect();
    };

    const signWallet = async () => {
        signWalletForLogin();
    };

    useEffect(() => {
        setShowModal(showSignInModal);
    }, [showSignInModal]);

    useEffect(() => {
        console.log(isWalletConnected, !isWalletSignedForLogin, signWalletButtonRef.current);

        isWalletConnected &&
            !isWalletSignedForLogin &&
            signWalletButtonRef.current &&
            signWalletButtonRef.current.click();
    }, [isWalletConnected]);

    const closeSignInModal = () => {
        setShowModal(false);
        if (detect.isMobileDevice) {
            setTimeout(() => {
                changeSignInModalState(false);
            }, 350);
        } else {
            changeSignInModalState(false);
        }
    };

    return (
        <>
            <div className={classes([styles.wrapper, showSignInModal ? 'block' : 'hidden'])}>
                <Dialog open={showSignInModal} onClose={() => closeSignInModal()}>
                    <Dialog.Panel>
                        <div className={styles.modalWrapper}>
                            <div className={classes([styles.signInModal, showModal ? styles.showModal : ''])}>
                                <div className={styles.imageWrapper}>
                                    {/* <Image
                                        src={SignIN}
                                        alt="test"
                                        className={styles.modalImage}
                                    /> */}
                                    <div
                                        style={{
                                            backgroundImage: `url(${thumbnail?.thumbnailCloudUrl || Loading.src})`
                                        }}
                                        className={styles.modalImage}
                                    />

                                    {thumbnail && (
                                        <p className={styles.modalImageDescription}>
                                            {thumbnail?.name}
                                            <span className="text-rhythm font-semibold mx-1">by</span>
                                            <Link href={`profile/${thumbnail?.creator?.id}`} passHref>
                                                <a>{thumbnail?.creator?.displayName}</a>
                                            </Link>
                                        </p>
                                    )}
                                </div>
                                <div className={styles.modalData}>
                                    <div>
                                        <p className={styles.modalTitle}>Sign in</p>
                                        <p className={styles.modalDescription}>
                                            Use your wallet to sign in to ARize and get access to millions of 3D NFTs
                                        </p>
                                        <a className={styles.modalLink} href="#">
                                            What is a wallet?
                                        </a>
                                    </div>

                                    <div>
                                        {!detect.isMobileDevice && (
                                            <IconButton
                                                beforeIcon={true}
                                                icon={MetaMask}
                                                text="MetaMask"
                                                size="large"
                                                externalClass={styles.metaMask}
                                                onClick={connectMetamask}
                                            />
                                        )}
                                        {isWalletConnected && !isWalletSignedForLogin && (
                                            <div>
                                                <div className={styles.walletIsConnected}>
                                                    Your wallet is connected successfully. We need your signature to
                                                    continue the account verification process.
                                                </div>
                                                <IconButton
                                                    beforeIcon={true}
                                                    icon={WalletConnect}
                                                    text="Sign your wallet to login"
                                                    size="large"
                                                    externalClass={styles.trustWallet}
                                                    onClick={signWallet}
                                                />
                                                <input
                                                    type="button"
                                                    onClick={signWallet}
                                                    ref={signWalletButtonRef}
                                                    value="Sign your wallet to login"
                                                    className="hidden"
                                                ></input>
                                            </div>
                                        )}
                                        {!isWalletConnected && (
                                            <IconButton
                                                beforeIcon={true}
                                                icon={WalletConnect}
                                                text="WalletConnect"
                                                size="large"
                                                externalClass={styles.trustWallet}
                                                onClick={connectWalletConnect}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </div>
        </>
    );
};

export default observer(SignInModal);
