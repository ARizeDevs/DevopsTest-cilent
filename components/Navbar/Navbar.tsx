import Close from '@/assets/icons/close.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import IconInput from '@/components/Inputs/IconInput/IconInput';
import Menu from '@/components/Sidebar/Menu/Menu';
import Social from '@/components/Sidebar/Social';
import { Web3Service } from '@/data/web3/web3service';
import MobileArz from 'assets/icons/logo.svg';
import Search from 'assets/icons/search.svg';
import AvatarTier from 'components/Avatar/AvatarTier';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import classes from '../../utils/classes';
import WrongChainWarning from '../WrongChainWarning';
import styles from './navbar.module.css';
interface navbarProps {
    className?: string;
    menuItems: Array<object>;
    socialItemsList: Array<object>;
}

const Navbar = (props: navbarProps) => {
    const { className, menuItems, socialItemsList } = props;
    const NavbarClass = classes([styles.wrapper, className!]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showWrongChainWarning, setShowWrongChainWarning] = useState(false);

    const router = useRouter();
    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const {
        loginStatus,
        walletAddress,
        currentChainId,
        isChainIdValid,
        updateChainIdValidityStatus,
        detectNetwork,
        updateNetwork,
        getUserTokenBalances,
        switchMetamaskChainToBscTestnet,
        switchMetamaskChainToBscMainnet,
        updateWalletAddress,
        strictChainId
    } = authStore;
    const { changeSignInModalState } = globalStore;

    useEffect(() => {
        setShowWrongChainWarning(loginStatus === LoginStatus.Success && !isChainIdValid);
    }, [isChainIdValid, loginStatus]);

    const retrieveBalances = async () => {
        await getUserTokenBalances();
    };
    const initCheckChainId = async () => {
        await detectNetwork();
        if (strictChainId === 97 && currentChainId === strictChainId) {
            await updateChainIdValidityStatus(true);
            return;
        } else if (strictChainId === 97 && currentChainId !== strictChainId) {
            // await updateChainIdValidityStatus(false);
            const chainChangeSuccess = await switchMetamaskChainToBscTestnet();
            if (chainChangeSuccess) {
                await updateChainIdValidityStatus(true);
                await updateNetwork(strictChainId);
            } else {
                await updateChainIdValidityStatus(false);
            }
        }
    };
    const validateChainId = async (newChainId: number) => {
        if (newChainId === strictChainId) return;
        await updateChainIdValidityStatus(false);
        const chainChangeSuccess = await switchMetamaskChainToBscTestnet();
        if (chainChangeSuccess) {
            await updateChainIdValidityStatus(true);
            await updateNetwork(strictChainId);
        } else {
            await updateChainIdValidityStatus(false);
        }
    };
    const handleAccountChange = async (accounts: string[]) => {
        if (accounts[0] !== walletAddress) {
            await updateWalletAddress(accounts[0]);
            await getUserTokenBalances();
        }
    };
    const handleChainChange = async (newChainId: string) => {
        await validateChainId(parseInt(newChainId));
        await getUserTokenBalances();
    };
    useEffect(() => {
        window.ethereum?.on('chainChanged', handleChainChange);
        setTimeout(() => {
            window.ethereum?.on('accountsChanged', handleAccountChange);
        }, 5000);
        return () => {
            window.ethereum?.removeListener('chainChanged', handleChainChange);
            window.ethereum?.removeListener('accountsChanged', handleAccountChange);
        };
    });

    useEffect(() => {
        if (loginStatus === LoginStatus.Success) {
            showSignInModalAction(false);
            retrieveBalances();
            initCheckChainId();
        }
    }, [loginStatus]);

    const showSignInModalAction = (value: boolean) => {
        changeSignInModalState(value);
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

    const signInMobile = () => {
        setIsMenuOpen(false);
        showSignInModalAction(true);
    };
    const menuItemClick = () => {
        setIsMenuOpen(false);
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
                    isAutoComplete="off"
                />
            </form>
            {showWrongChainWarning && (
                <WrongChainWarning
                    show={showWrongChainWarning}
                    onClose={() => {
                        setShowWrongChainWarning(false);
                    }}
                />
            )}
            <Link href={'/explore'} passHref>
                <a>
                    <MobileArz className="block lg:hidden" />
                </a>
            </Link>
            <div className={styles.actions}>
                {(loginStatus === LoginStatus.NotStarted || loginStatus === LoginStatus.Pending) && (
                    <BaseButton
                        className={styles.signIn}
                        type="text"
                        text="Sign In"
                        onClick={() => showSignInModalAction(true)}
                    />
                )}
                {loginStatus === LoginStatus.Success && (
                    <div className={styles.notifications}>
                        <AvatarTier />
                    </div>
                )}

                <MenuIcon className="block lg:hidden ml-4" onClick={() => setIsMenuOpen(true)} />
            </div>
            <div
                className={classes([
                    isMenuOpen ? 'w-full' : 'w-0',
                    styles.showMobileMenu,
                    'lg:hidden fixed flex flex-col right-0 top-0 h-full bg-darker-raisin-black z-10'
                ])}
            >
                <div className="px-3.5 pt-12">
                    <div className="flex justify-between items-center">
                        <MobileArz />
                        <Close onClick={menuItemClick} />
                    </div>
                    <a
                        href="https://pancakeswap.finance/swap?outputCurrency=0xc10375092343fa84b80d4bdca94488fe3c52101f"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <BaseButton
                            type="text"
                            text="Get ARZ"
                            size="large"
                            className="bg-coral font-bold text-smallSemiBold mt-10 text-raisin-black"
                            onClick={menuItemClick}
                        />
                    </a>
                </div>
                <hr className="my-6" />
                <div className="flex flex-col justify-between h-full pb-14">
                    <Menu items={menuItems} onItemClick={menuItemClick} />
                    <div>
                        <hr />
                        <div className="px-6 mt-6">
                            <Social socialItems={socialItemsList}  onItemClick={menuItemClick}/>
                            <p className="mt-5 text-semiBold font-medium text-manatee">
                                Privacy Policy . Terms & Conditions .
                            </p>
                            <a
                                className="mt-4 text-semiBold font-medium text-manatee"
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                onClick={menuItemClick}
                            >
                                Feedback
                            </a>
                            <p className="mt-4 text-smallSemiBold font-medium text-manatee">
                                © Copyright 2022 ARize. All Rights Reserved.
                            </p>
                            {(loginStatus === LoginStatus.NotStarted || loginStatus === LoginStatus.Pending) && (
                                <BaseButton
                                    type="text"
                                    text="Sign in"
                                    size="large"
                                    className="bg-coral font-bold text-smallSemiBold mt-8 text-raisin-black"
                                    onClick={() => {
                                        menuItemClick();
                                        signInMobile();
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default observer(Navbar);
