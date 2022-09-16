import React from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Menu from './Menu/Menu';
import StakeBanner from '@/components/StakeBanner/StakeBanner';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import Social from './Social';
import classes from '@/utils/classes';
import NewLogo from 'assets/icons/newLogo.svg';
import PancakeSwap from 'assets/icons/pancakeSwap.svg';
import BitMart from 'assets/icons/bitmart.svg';
import MexGlobal from 'assets/icons/mexglobal.svg';
import styles from './sidebar.module.css';

interface sidebarProps {
    menuItems: Array<object>;
    socialItemsList: Array<object>;
}

const Sidebar = (props: sidebarProps) => {
    const { menuItems, socialItemsList } = props;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <aside className={styles.wrapper}>
            <div>
                <div className={styles.header}>
                    <Link href={'/explore'} passHref>
                        <a>
                            <NewLogo />
                        </a>
                    </Link>

                    <BaseButton onClick={() => setModalIsOpen(true)} type="text" text="Get ARZ" size="small" className="bg-coral font-bold text-smallSemiBold mt-10 text-raisin-black" />
                </div>
                <hr className="mt-2" />
                <Menu items={menuItems} />
            </div>
            <div>
                <div className={styles.bottom}>
                    <StakeBanner />
                </div>
                <hr />
                <div className={styles.footer}>
                    <Social socialItems={socialItemsList} />
                    <p className={styles.policy}>
                        Privacy Policy . Terms & Conditions.
                    </p>
                    <a className={styles.policy} href="#" target="_blank" rel="noreferrer">
                        Feedback
                    </a>
                    <p className={styles.copyright}>
                        © Copyright 2022 ARize. All Rights Reserved.
                    </p>
                </div>
            </div>

            <Transition appear show={modalIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setModalIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-darker-raisin-black bg-opacity-80" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={"border border-rhythm bg-space-cadet p-6 w-full max-w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all " + styles.getArzModal}>
                                    <Dialog.Title as="h3" className="text-h4 font-extrabold text-white">
                                        Get ARZ on:
                                    </Dialog.Title>
                                    <div className="mt-8 flex flex-col gap-y-4">
                                        <a
                                            href="https://pancakeswap.finance/swap?outputCurrency=0xc10375092343fA84B80D4BdCA94488fe3C52101F"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={classes([
                                                styles.socialIcon,
                                                'py-2.5 rounded-lg bg-dark-raisin-black flex h-11 items-center justify-center'
                                            ])}
                                        >
                                            <PancakeSwap />
                                        </a>
                                        <a
                                            href="https://www.bitmart.com/trade/en?symbol=ARZ_USDT&layout=basic"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={classes([
                                                styles.socialIcon,
                                                'py-2.5 rounded-lg bg-dark-raisin-black flex h-11 items-center justify-center'
                                            ])}
                                        >
                                            <BitMart />
                                        </a>
                                        <a
                                            href="https://www.mexc.com/fa-IR/exchange/ARZ_USDT"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={classes([
                                                styles.socialIcon,
                                                'py-2.5 rounded-lg bg-dark-raisin-black flex h-11 items-center justify-center'
                                            ])}
                                        >
                                            <MexGlobal />
                                        </a>

                                        <BaseButton
                                            onClick={() => setModalIsOpen(false)}
                                            type="text"
                                            text="Cancel"
                                            size="large"
                                            className="bg-independence text-white mt-8"
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </aside>
    );
};

export default Sidebar;
