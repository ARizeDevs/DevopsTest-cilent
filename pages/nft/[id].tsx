import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { Menu, Tab, Transition } from '@headlessui/react';
import Profile from '@/components/Profile';
import classes from '@/utils/classes';
import styles from './nft.module.css';
import ModelViewer from '@/components/ModelViewer';
import { checkAuthentication } from '@/utils/checkAuthentication';
import { getNftData } from '@/data/nft';
import { Nft } from '@/data/nft/types';
import Market from './market';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';

import { observer } from 'mobx-react';
import TokenLogo from '@/components/TokenLogo';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import MoreIcon from '@/assets/icons/more.svg';
import Link from 'next/link';
import ShareNFTModal from '@/components/ShareNFTModal';
import ReportNFTModal from '@/components/ReportNFTModal';
import { replaceSpaceWithUnderline, stringShorter } from '@/utils/stringFormat';
import MintingStatusLogo from '@/components/MintingLogo';
import PinkQuestionLogo from '@/components/PinkQuestionLogo';

const NFT = ({ nft, hydrationData }: { nft: Nft; hydrationData: any }) => {
    const globalStore: GlobalStore = useGlobalStore();
    const { changeToastNotificationState } = globalStore;

    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { loginStatus, user } = authStore;

    const [isShareNFTModalOpen, setIsShareNFTModalOpen] = useState<boolean>(false);
    const [isReportNFTModalOpen, setIsReportNFTModalOpen] = useState<boolean>(false);

    const [userId, setUserId] = useState(user?.id);

    useEffect(() => {
        if (loginStatus === LoginStatus.Success) {
            setUserId(user?.id);
        }

        if (loginStatus !== LoginStatus.Success) {
            setUserId(null);
        }
    }, [loginStatus, user]);

    const searchTabs = ['Details', 'Price History', 'Activity'];
    const tabsItem = searchTabs.map((item) => {
        return (
            <Tab
                className={({ selected }) =>
                    classes([`${styles.tab}`, selected ? `${styles.activeTab}` : `${styles.deactiveTab}`])
                }
                key={item}
            >
                {item}
            </Tab>
        );
    });

    if (!nft) {
        changeToastNotificationState(true, <p>There is a problem to load NFT!</p>, 'Error', 5000);
        return <></>;
    }
    return (
        <>
            <Head>
                <script type="module" async src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js"></script>
            </Head>
            <div className="lg:flex lg:min-h-full h-full">
                <div className="lg:w-2/3">
                    <div className="h-96 lg:h-full">
                        <ModelViewer
                            solidBackgroundColor={'white'}
                            title={nft.name}
                            allowScaling={true}
                            id={nft.id}
                            glbURL={nft.artCloudUrl}
                            usdzURL={nft.usdzCloudUrl}
                            poster={nft.thumbnailCloudUrl}
                            showQR={true}
                            openAr={true}
                            viewCount={nft.viewCount}
                            likeCount={nft.likeCount}
                            isLikedByUser={nft.isLikedNft}
                        />
                    </div>
                </div>
                <div className="lg:w-1/3  sm:w-auto overflow-y-hidden flex flex-col pb-24 lg:pb-0">
                    <div className="px-6 py-4 flex-1">
                        <div className="flex">
                            <div className="flex-1 flex items-center">
                                <p className="text-h4 font-extrabold text-white">{nft.name}</p>
                            </div>
                            <div className=" pl-4 flex-none relative">
                                <Menu>
                                    <div>
                                        <Menu.Button className="w-11 h-11 rounded-lg justify-center items-center inline-flex !bg-dark-raisin-black  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                            <MoreIcon />
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
                                        <Menu.Items className="absolute z-10 right-0 mt-2 py-2 overflow-hidden w-40 origin-top-right divide-y rounded-lg bg-raisin-black shadow-lg">
                                            <Menu.Item>
                                                <Link href={`/model-viewer/${nft.id}`} passHref>
                                                    <div className="cursor-pointer bg-transparent w-full p-4 justify-start text-white text-semiBold font-normal rounded-none hover:bg-space-cadet">
                                                        <a>View in AR</a>
                                                    </div>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <BaseButton
                                                    type="text"
                                                    text="Refresh Metadata"
                                                    className="bg-transparent p-4 justify-start text-white text-semiBold font-normal rounded-none hover:bg-space-cadet"
                                                />
                                            </Menu.Item>
                                            <Menu.Item>
                                                <BaseButton
                                                    type="text"
                                                    text="Share"
                                                    className="bg-transparent p-4 justify-start text-white text-semiBold font-normal rounded-none hover:bg-space-cadet"
                                                    onClick={() => {
                                                        setIsShareNFTModalOpen(true);
                                                    }}
                                                />
                                            </Menu.Item>
                                            <Menu.Item>
                                                <BaseButton
                                                    type="text"
                                                    text="Report"
                                                    className="bg-transparent p-4 justify-start text-white text-semiBold font-normal rounded-none hover:bg-space-cadet"
                                                    onClick={() => {
                                                        setIsReportNFTModalOpen(true);
                                                    }}
                                                />
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                        <p className="mt-4 text-white text-paragraph font-normal">{nft.description}</p>
                        <div className="flex gap-8 mt-4 mb-4 p-4 rounded bg-raisin-black">
                            <div className="flex-1">
                                <p className="font-bold text-smallSemiBold text-white mb-1">Creator</p>
                                <Profile
                                    userName={nft.creator?.displayName! ?? stringShorter(nft.creator.publicAddress)}
                                    avatar={nft.creator?.avatarUrl!}
                                    linkUrl={`/profile/${nft.creator.id}`}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-smallSemiBold text-white mb-1">Collection</p>
                                <Profile
                                    userName={nft.collection?.name}
                                    avatar={nft.collection?.thumbnail!}
                                    linkUrl={`/collection/${nft.collection.id}`}
                                />
                            </div>
                        </div>

                        <Tab.Group>
                            <Tab.List className="flex border-b-2 border-dark-raisin-black">{tabsItem}</Tab.List>
                            <Tab.Panels className={classes(['py-6 overflow-y-scroll', styles.tabPanel])}>
                                <Tab.Panel className="">
                                    <div>
                                        <p className="font-bold text-smallSemiBold text-manatee mb-2">Owner</p>
                                        <Profile
                                            userName={nft.owner.displayName! ?? stringShorter(nft.owner.publicAddress)}
                                            avatar={nft.owner.avatarUrl!}
                                            linkUrl={`/profile/${nft.owner.id}`}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <p className="font-bold text-smallSemiBold text-manatee mb-2">Blockchain</p>
                                        <div className="flex items-center">
                                            <TokenLogo name={nft.collection.network.nativeToken} />
                                            <p className="text-semiBold font-semibold text-white ml-2">
                                                {nft.collection.network.nativeToken}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-bold text-smallSemiBold text-manatee mb-2">Token Standard</p>
                                        <p className="text-semiBold font-semibold text-white">{nft.tokenStandard}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-bold text-smallSemiBold text-manatee mb-2">Minting Status</p>
                                        <div className="flex items-center">
                                            <MintingStatusLogo />
                                            <p className="text-semiBold font-semibold text-white ml-2 mr-2">
                                                {nft.mintingStatus && replaceSpaceWithUnderline(nft.mintingStatus)}
                                            </p>
                                            {/* <PinkQuestionLogo /> */}
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    {/* History */}
                                </Tab.Panel>
                                <Tab.Panel className="flex flex-col gap-4">{/* Activities */}</Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                    {userId && (
                        <div className="p-6 sticky border-t-2 border-dark-raisin-black">
                            <Market nft={nft} isOwner={nft.ownerId === userId} />
                        </div>
                    )}
                </div>
                <ShareNFTModal
                    nftName={nft.name}
                    nftId={nft.id}
                    show={isShareNFTModalOpen}
                    onClose={() => {
                        setIsShareNFTModalOpen(false);
                    }}
                />
                <ReportNFTModal
                    nftId={nft.id}
                    show={isReportNFTModalOpen}
                    onClose={() => setIsReportNFTModalOpen(false)}
                />
            </div>
        </>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    try {
        const nftId: number = context.params.id;
        const result = await getNftData(nftId);

        if (!result.data.nft) {
            return {
                redirect: {
                    permanent: false,
                    destination: `/404`
                }
            };
        }

        let nft: Nft = {
            ...result.data.nft,
            likeCount: result.data.likeCount,
            viewCount: result.data.viewCount,
            isLikedNft: result.data.isLikedNft,
            serviceFee: result.data.serviceFee,
            marketplace: result.data.marketplace,
            bids: result.data.bids
        };

        return {
            props: { nft: nft }
        };
    } catch (error) {
        // console.log(error);
    }
});

export default observer(NFT);
