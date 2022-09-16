import Chain from '@/assets/icons/chain.svg';
import Facebook from '@/assets/icons/largeFacebook.svg';
import Pocket from '@/assets/icons/pocket.svg';
import Telegram from '@/assets/icons/telegram.svg';
import Twitter from '@/assets/icons/twitter.svg';
import AvatarGroup from '@/components/Avatar/AvatarGroup/AvatarGroup';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import GeneralInput from '@/components/Inputs/GeneralInput/GeneralInput';
import NetworkLogo from '@/components/NetworkLogo';
import Timer from '@/components/Timer/Timer';
import { Dialog, Menu, Transition } from '@headlessui/react';
import ETH from 'assets/icons/eth.svg';
import Fire from 'assets/icons/fire.svg';
import Hart from 'assets/icons/hart.svg';
import More from 'assets/icons/more.svg';
import View from 'assets/icons/view.svg';
import api from 'data/api';
import { observer } from 'mobx-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import classes from '../../../utils/classes';
import styles from './nftCard.module.css';

interface NftCardProps {
    deadline?: string;
    className?: string;
    name: string;
    description: string;
    likeCount: number;
    viewCount: number;
    id: number;
    token: string;
    avatars?: Array<any>;
    nftThumbnail: string;
    nft: any;
    marketplace?: any;
    networkId: number;
}

const NftCard = (props: NftCardProps) => {
    const {
        deadline,
        className,
        name,
        description,
        likeCount,
        viewCount,
        id,
        token,
        avatars,
        nftThumbnail,
        nft,
        networkId,
        marketplace
    } = props;
    const [LikedCount, setLikeCount] = useState(likeCount);
    const [liked, setLike] = useState(false);
    const [pendingLiked, setPendingLiked] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportFormIsValid, setReportFormIsValid] = useState(false);
    const [reportMessage, setReportMessage] = useState('');
    const router = useRouter();

    const cardAvatars = [
        {
            userId: nft.owner.id,
            src: nft.owner.avatarUrl,
            alt: `Owner: ${nft.owner.displayName || nft.owner.publicAddress}`
        },
        {
            userId: nft.creator.id,
            src: nft.creator.avatarUrl,
            alt: `Creator: ${nft.creator.displayName || nft.creator.publicAddress}`
        },
        {
            src: '',
            alt: `Collection: ${nft.collection.name}`
        }
    ];

    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const { loginStatus } = authStore;
    const { changeSignInModalState, changeToastNotificationState } = globalStore;

    useEffect(() => {
        if (loginStatus === LoginStatus.Success) {
            if (pendingLiked) {
                likeNft();
            }
        }
    }, [loginStatus]);

    const nftCardClass = classes([styles.wrapper, className!]);
    const tokenList = {
        ERC721: ETH
    };
    // @ts-ignore
    const StandardToken = tokenList[token];
    const likeNft = () => {
        if (loginStatus === LoginStatus.NotStarted || loginStatus === LoginStatus.Pending) {
            setPendingLiked(true);
            changeSignInModalState(true);
        } else {
            if (liked) {
                api.post('/nft/unlike', {
                    // @ts-ignore
                    nftId: id
                })
                    .then((res) => {
                        console.log(res);
                        setLike(false);
                        setLikeCount(LikedCount - 1);
                    })
                    .catch((err) => {
                        changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
                    });
            } else {
                api.post('/nft/like', {
                    nftId: id
                })
                    .then((res) => {
                        console.log(res);
                        setLike(true);
                        setLikeCount(LikedCount + 1);
                    })
                    .catch((err) => {
                        changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
                    });
            }
        }
    };

    const navigateToModelViewer = () => {
        router.push(`/model-viewer/${id}`);
    };

    const shareNft = () => {
        setIsShareOpen(true);
    };

    const reportNft = () => {
        setIsReportOpen(true);
    };

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(`${window.location.origin}/nft/${id}`);
        setIsShareOpen(false);
        changeToastNotificationState(true, <p>Copied</p>, 'Success', 2000);
    };

    const checkFieldValidation = (value: any, field: string = 'report', isValid: boolean) => {
        setReportFormIsValid(isValid === true);
        setReportMessage(value);
    };

    const openNewWindow = (url: string) => {
        window.open(url, '', 'height=400, width=550, windowPosition=windowCenter');
    };

    const shareOnTwitter = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `url=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const hashtags = `hashtags=ARize,NFT` + encodedLineBreaks;
        const nftName = `text=${name}` + encodedLineBreaks;
        openNewWindow(`https://twitter.com/share?${nftUrl}&${nftName}&${hashtags}`);
    };

    const shareOnFacebook = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `u=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const hashtags = `hashtag=ARize` + encodedLineBreaks;
        const nftName = `quote=${name}` + encodedLineBreaks;
        openNewWindow(`https://www.facebook.com/sharer/sharer.php?${nftUrl}&${nftName}&${hashtags}`);
    };

    const shareOnTelegram = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `url=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const nftName = `text=${name}` + encodedLineBreaks;
        openNewWindow(`https://telegram.me/share/url?${nftUrl}&${nftName}`);
    };

    const shareOnEmail = () => {
        const encodedLineBreaks = '%0A';
        const nftUrl = `body=${window.location.origin}/nft/${id}` + encodedLineBreaks;
        const nftName = `su=${name}` + encodedLineBreaks;
        openNewWindow(`https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&${nftName}&${nftUrl}`);
    };

    return (
        <div className={nftCardClass}>
            <div className="flex justify-between">
                <AvatarGroup avatars={cardAvatars} size="medium" />
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex !bg-dark-raisin-black justify-center hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            <More />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute z-10 right-0 mt-2 w-40 origin-top-right divide-y rounded-lg bg-raisin-black shadow-lg">
                            <div className="py-2">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className="w-full">
                                            <Link href={`/model-viewer/${id}`} passHref>
                                                <a
                                                    target="_blank"
                                                    className={`${
                                                        active ? 'bg-space-cadet' : ''
                                                    } group text-white flex w-full items-center font-normal text-semiBold px-4 py-2.5`}
                                                >
                                                    View AR
                                                </a>
                                            </Link>
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-space-cadet' : ''
                                            } group text-white flex w-full items-center font-normal text-semiBold px-4 py-2.5`}
                                            onClick={shareNft}
                                        >
                                            Share
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-space-cadet' : ''
                                            } group text-white flex w-full items-center font-normal text-semiBold px-4 py-2.5`}
                                            onClick={reportNft}
                                        >
                                            Report
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className={styles.imageContainer}>
                <Link href={'/nft/' + id} passHref>
                    <Image
                        className="rounded-lg"
                        src={nftThumbnail}
                        height={'100%'}
                        width={'100%'}
                        alt={name}
                        layout="responsive"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/assets/images/loading.svg"
                        sizes="100vw"
                    />
                </Link>
            </div>
            {deadline && (
                <div className={styles.timer}>
                    <Fire className={styles.fire} />
                    <Timer deadline={deadline} />
                    <span>left</span>
                </div>
            )}
            <div className="flex flex-col justify-between">
                <div>
                    <div className={styles.name}>
                        <p className={styles.nftName}>{name}</p>
                        <NetworkLogo id={networkId} />
                    </div>
                    <p className={styles.des}>{description}</p>
                </div>
                <div className={styles.footer}>
                    <div className="flex items-center">
                        <Link href={`/model-viewer/${id}`} passHref>
                            <a target="_blank">
                                <p className="px-3 py-1.5 mr-3 cursor-pointer rounded-md bg-space-cadet text-smallSemiBold font-bold text-fade-ghost-white">
                                    View AR/3D
                                </p>
                            </a>
                        </Link>
                        {marketplace && marketplace.status === 'STARTED' && (
                            <Link href={`/nft/${id}`} passHref>
                                <a>
                                    <p className={styles.bid}>For Sale</p>
                                </a>
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center">
                        <p className="flex items-center mr-2.5">
                            <View className={styles.view} />
                            <span className={styles.likeCount}>{viewCount}</span>
                        </p>
                        <p className={styles.like}>
                            <Hart
                                className={classes([liked ? styles.likedNft : '', 'cursor-pointer'])}
                                onClick={likeNft}
                            />
                            <span className={styles.likeCount}>{LikedCount}</span>
                        </p>
                    </div>
                </div>
            </div>

            <Transition appear show={isShareOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsShareOpen(false)}>
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
                                <Dialog.Panel className="border border-rhythm bg-space-cadet p-6 w-full max-w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-h4 font-extrabold text-white">
                                        Share this NFT
                                    </Dialog.Title>
                                    <div className="mt-4 flex gap-x-5">
                                        <button onClick={shareOnTwitter}>
                                            <div
                                                className={classes([
                                                    styles.socialIcon,
                                                    'p-3 rounded-lg bg-independence '
                                                ])}
                                            >
                                                <Twitter />
                                            </div>
                                            <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">
                                                Twitter
                                            </p>
                                        </button>
                                        <button onClick={shareOnFacebook}>
                                            <div
                                                className={classes([
                                                    styles.socialIcon,
                                                    'p-3 rounded-lg bg-independence '
                                                ])}
                                            >
                                                <Facebook />
                                            </div>
                                            <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">
                                                Facebook
                                            </p>
                                        </button>
                                        <button onClick={shareOnTelegram}>
                                            <div
                                                className={classes([
                                                    styles.socialIcon,
                                                    'p-3 rounded-lg bg-independence '
                                                ])}
                                            >
                                                <Telegram />
                                            </div>
                                            <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">
                                                Telegram
                                            </p>
                                        </button>
                                        <button onClick={shareOnEmail}>
                                            <div
                                                className={classes([
                                                    styles.socialIcon,
                                                    'p-3 rounded-lg bg-independence '
                                                ])}
                                            >
                                                <Pocket />
                                            </div>
                                            <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">
                                                Email
                                            </p>
                                        </button>
                                        <div className="cursor-pointer" onClick={copyToClipBoard}>
                                            <div
                                                className={classes([
                                                    styles.socialIcon,
                                                    'p-3 rounded-lg bg-independence '
                                                ])}
                                            >
                                                <Chain />
                                            </div>
                                            <p className="mt-1 text-center text-fade-ghost-white text-paragraphAlt font-normal">
                                                Copy link
                                            </p>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isReportOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsReportOpen(false)}>
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
                                <Dialog.Panel className="border border-rhythm bg-space-cadet p-6 w-full max-w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-h4 font-extrabold text-white">
                                        Why are you reporting
                                    </Dialog.Title>
                                    <p className="font-normal text-semiBold text-manatee my-4">
                                        Tell use how this user violates the rules of the platform
                                    </p>
                                    <GeneralInput
                                        name="report"
                                        type="text"
                                        validation={/\S{2,32}/}
                                        inputClassName="border-0 mt-1 bg-independence"
                                        placeholder="Tell use some details"
                                        label="Message"
                                        size="large"
                                        errorMessage="Message is not valid"
                                        onChange={checkFieldValidation}
                                    />
                                    <BaseButton
                                        isDisabled={!reportFormIsValid}
                                        type="text"
                                        text="Report"
                                        size="large"
                                        className="bg-coral text-raisin-black mt-8"
                                    />
                                    <BaseButton
                                        onClick={() => setIsReportOpen(false)}
                                        type="text"
                                        text="Cancel"
                                        size="large"
                                        className="bg-independence text-white mt-2"
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default observer(NftCard);
