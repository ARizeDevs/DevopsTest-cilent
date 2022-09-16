import Bell from '@/assets/icons/bell.svg';
import Moon from '@/assets/icons/dark.svg';
import Sun from '@/assets/icons/light.svg';
import MetaMask from '@/assets/icons/meta-mask.svg';
import QA from '@/assets/icons/questionAndAnswer.svg';
import TrustWallet from '@/assets/icons/trust-wallet.svg';
import SignIN from '@/assets/images/signIn.jpg';
import Badge from '@/components/Badge/Badge';
import detect from '@/utils/detect';
import { Dialog } from '@headlessui/react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import Search from 'assets/icons/search.svg';
import BaseButton from 'components/Buttons/BaseButton/BaseButton';
import IconButton from 'components/Buttons/IconButton/IconButton';
import IconInput from 'components/Inputs/IconInput/IconInput';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import classes from '../../utils/classes';
import styles from './navbar.module.css';

interface navbarProps {
    className?: string;
}

const Navbar = (props: navbarProps) => {
    const { className } = props;
    const NavbarClass = classes([styles.wrapper, className!]);
    const [userAddress, setUserAddress] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress);
        setTheme('dark');
    }, []);

    async function connect(onConnected: any) {
        if (!window.ethereum) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        if (detect.isMobileDevice) {
            const dappUrl = 'metamask-auth.ilamanov.repl.co'; // TODO enter your dapp URL. For example: https://uniswap.exchange. (don't enter the "https://")
            const metamaskAppDeepLink =
                'https://metamask.app.link/dapp/' + dappUrl;
            window.open(metamaskAppDeepLink, '_blank');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        setIsModalOpen(false);
        onConnected(accounts[0]);
    }

    async function checkIfWalletIsConnected(onConnected: any) {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts.length > 0) {
                const account = accounts[0];
                onConnected(account);
                setIsModalOpen(false);
                return;
            }

            if (detect.isMobileDevice) {
                await connect(onConnected);
            }
        }
    }

    const changeTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const submitSearch = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        router.push({
            pathname: '/search',
            query: {
                value: searchValue
            }
        });
    };

    const changeSearchValue = (value: string) => {
        setSearchValue(value);
    };

    const connectWalletConnect = () => {
        console.log('call');
        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });

        // Check if connection is already established
        if (!connector.connected) {
            // create new session
            connector.createSession();
            console.log('init wallet connect');
        }

        // Subscribe to connection events
        connector.on('connect', (error, payload) => {
            if (error) {
                throw error;
            }

            // Get provided accounts and chainId
            const { accounts, chainId } = payload.params[0];
            console.log('wallet connected');
            setIsModalOpen(false);
        });

        connector.on('session_update', (error, payload) => {
            if (error) {
                throw error;
            }

            // Get updated accounts and chainId
            const { accounts, chainId } = payload.params[0];
            console.log('update');
        });

        connector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }

            // Delete connector
            console.log('delete connection');
        });
    };

    return (
        <nav className={NavbarClass}>
            <form onSubmit={submitSearch} className={styles.searchForm}>
                <IconInput
                    type="text"
                    name="search"
                    size="large"
                    placeholder="Search NFTs, Creators, etc."
                    onChange={changeSearchValue}
                    className={styles.search}
                    beforeIcon={Search}
                />
            </form>
            <div className={styles.actions}>
                {theme === 'dark' ? (
                    <Sun onClick={changeTheme} className="mr-4 min-w-fit" />
                ) : (
                    <Moon onClick={changeTheme} className="mr-4 min-w-fit" />
                )}
                {!userAddress && (
                    <BaseButton
                        className={styles.signIn}
                        type="text"
                        text="Sign In"
                        onClick={() => setIsModalOpen(true)}
                    />
                )}
                {userAddress && (
                    <div className={styles.notifications}>
                        <Bell />
                        <Badge
                            text="1"
                            type="important"
                            className={styles.badge}
                        />
                    </div>
                )}
                {userAddress && (
                    <div className={styles.notifications}>
                        <QA />
                        <Badge
                            text="1"
                            type="important"
                            className={styles.badge}
                        />
                    </div>
                )}
            </div>
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Dialog.Panel>
                    <div className={styles.signInModal}>
                        <div>
                            <Image
                                src={SignIN}
                                alt="test"
                                className={styles.modalImage}
                            />
                        </div>
                        <div className={styles.modalData}>
                            <p className={styles.modalTitle}>Sign in</p>
                            <p className={styles.modalDescription}>
                                Use your wallet to sing in to ARize and get
                                access to millions of 3D NFTs
                            </p>
                            <a className={styles.modalLink} href="#">
                                What is a wallet?
                            </a>
                            <IconButton
                                beforeIcon={true}
                                icon={MetaMask}
                                text="Sign in with MetaMask"
                                size="large"
                                externalClass={styles.metaMask}
                                onClick={() => connect(setUserAddress)}
                            />
                            <IconButton
                                beforeIcon={true}
                                icon={TrustWallet}
                                text="Sign in with Trust Wallet"
                                size="large"
                                externalClass={styles.trustWallet}
                                onClick={connectWalletConnect}
                            />
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </nav>
    );
};

export default Navbar;
