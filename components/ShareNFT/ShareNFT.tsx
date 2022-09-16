import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Twitter from '@/assets/icons/twitter.svg';
import Facebook from '@/assets/icons/largeFacebook.svg';
import Telegram from '@/assets/icons/telegram.svg';
import Pocket from '@/assets/icons/pocket.svg';
import Chain from '@/assets/icons/chain.svg';
import styles from './ShareNFT.module.css';
import classes from '@/utils/classes';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';

interface ShareNFTProps {
    name: string;
    id: number;
    onModalClose: () => void;
}
function ShareNFT({ name, id, onModalClose }: ShareNFTProps) {
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const { changeToastNotificationState } = globalStore;

    const openNewWindow = (url: string) => {
        window.open(url, '', 'height=400, width=550, windowPosition=windowCenter');
    };

    const shareOnTwitter = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `url=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const hashtags = `hashtags=ARize,NFT` + encodedLineBreaks;
        const nftName = `text=${name}` + encodedLineBreaks;
        openNewWindow(`https://twitter.com/share?${nftUrl}&${nftName}&${hashtags}`);
        onModalClose && onModalClose();
    };

    const shareOnFacebook = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `u=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const hashtags = `hashtag=ARize` + encodedLineBreaks;
        const nftName = `quote=${name}` + encodedLineBreaks;
        openNewWindow(`https://www.facebook.com/sharer/sharer.php?${nftUrl}&${nftName}&${hashtags}`);
        onModalClose && onModalClose();
    };

    const shareOnTelegram = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `url=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const nftName = `text=${name}` + encodedLineBreaks;
        openNewWindow(`https://telegram.me/share/url?${nftUrl}&${nftName}`);
        onModalClose && onModalClose();
    };

    const shareOnEmail = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `body=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const nftName = `su=${name}` + encodedLineBreaks;
        openNewWindow(`https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&${nftName}&${nftUrl}`);
        onModalClose && onModalClose();
    };

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(`${window.location.origin}/nft/${id}`);
        onModalClose && onModalClose();
        changeToastNotificationState(true, <p>Copied</p>, 'Success', 2000);
    };

    return (
        <div className="mt-4 flex gap-x-5">
            <button onClick={shareOnTwitter}>
                <div className={classes([styles.socialIcon, 'p-3 rounded-lg bg-independence '])}>
                    <Twitter />
                </div>
                <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">Twitter</p>
            </button>
            <button onClick={shareOnFacebook}>
                <div className={classes([styles.socialIcon, 'p-3 rounded-lg bg-independence '])}>
                    <Facebook />
                </div>
                <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">Facebook</p>
            </button>
            <button onClick={shareOnTelegram}>
                <div className={classes([styles.socialIcon, 'p-3 rounded-lg bg-independence '])}>
                    <Telegram />
                </div>
                <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">Telegram</p>
            </button>
            <button onClick={shareOnEmail}>
                <div className={classes([styles.socialIcon, 'p-3 rounded-lg bg-independence '])}>
                    <Pocket />
                </div>
                <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">Email</p>
            </button>
            <div className="cursor-pointer" onClick={copyToClipBoard}>
                <div className={classes([styles.socialIcon, 'p-3 rounded-lg bg-independence '])}>
                    <Chain />
                </div>
                <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">Copy link</p>
            </div>
        </div>
    );
}

export default ShareNFT;
