import { Tab } from '@headlessui/react';
import Head from 'next/head';
// import GeneralInput from '@/components/Inputs/GeneralInput/GeneralInput';
import Clock from '@/assets/icons/clock.svg';
import Dollar from '@/assets/icons/dollar.svg';
import { checkAuthentication } from '@/utils/checkAuthentication';
import classes from '@/utils/classes';
import styles from './sell.module.css';
import { Nft, SellingType, TokenStandardEnum } from '@/data/nft/types';
import NftCard from '@/components/Cards/NftCard/NftCard';
import { getNftData } from '@/data/nft';
import { Fragment } from 'react';
import FixedPriceForm from './FixedPriceForm';

const Sell = ({ nft }: { nft: Nft }) => {
    // TODO: check if user is the owner
    const searchTabs = [
        {
            title: 'Fixed price',
            icon: Dollar,
            key: SellingType.AUCTION
        },
        {
            title: 'Timed auction',
            icon: Clock,
            key: SellingType.FIXED
        }
    ];
    const tabsItem = searchTabs.map((item, index) => {
        return (
            <Tab
                className={({ selected }) =>
                    classes([
                        `${styles.priceTab}`,
                        'px-6 py-2.5 border-solid border-coral bg-dark-raisin-black flex flex-col items-center font-bold text-white text-paragraphAlt rounded-lg',
                        selected ? 'border' : 'border-0'
                    ])
                }
                key={index}
            >
                <item.icon className="mb-2" />
                {item.title}
            </Tab>
        );
    });

    if (!nft) return <></>;
    return (
        <>
            <div className="flex h-full flex-col md:flex-row">
                <div className=" w-auto md:w-2/3 justify-center lg:pt-14">
                    <div className="flex flex-col w-80 m-auto">
                        <p className="text-h6 text-white mb-4">Preview</p>
                        <NftCard
                            nft={nft}
                            id={nft.id}
                            description={nft.description}
                            name={nft.name}
                            likeCount={nft.likeCount}
                            token={nft.tokenStandard}
                            viewCount={nft.viewCount}
                            nftThumbnail={nft.thumbnailCloudUrl}
                            networkId={nft.collection.networkId}
                        />
                    </div>
                </div>
                <div className="w-auto md:w-1/3 border-l-2 border-dark-raisin-black px-6 h-full">
                    <div className="py-4 justify-between h-full flex flex-col">
                        <Tab.Group as={Fragment}>
                            <div className="flex-none">
                                <div>
                                    <p className="text-h4 font-extrabold text-white">Sell on Marketplace</p>
                                    <p className="text-paragraph font-bold text-white mt-3">Sales type</p>
                                    <p className="mt-1 text-manatee text-smallText font-normal">
                                        Enter price to allow users instantly purch ase your NFT
                                    </p>
                                </div>
                                <Tab.List className="flex gap-4 mt-2 ">{tabsItem}</Tab.List>
                            </div>
                            <Tab.Panels className={classes(['flex-1 py-4 box-content', styles.tabPanel])}>
                                <Tab.Panel as={Fragment}>
                                    <FixedPriceForm nft={nft} />
                                </Tab.Panel>
                                <Tab.Panel as={Fragment}>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                                        Timed Auction
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    try {
        const nftId: string = context.params.id;

        const result = await getNftData(+nftId);

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
        console.log(error);
    }
});

export default Sell;
