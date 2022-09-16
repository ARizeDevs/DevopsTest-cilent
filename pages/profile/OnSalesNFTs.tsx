import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import NftCard from '@/components/Cards/NftCard/NftCard';
import { EnumStepStatus } from '@/components/FollowSteps/FollowSteps';
import StepStatus from '@/components/FollowSteps/StepStatus';
import {  getNftOnSaleByOwnerId, NftDataMapper } from '@/data/nft';
import { Nft } from '@/data/nft/types';
import React, { useEffect, useState } from 'react';

function OnSalesNFTs({ userId }: { userId: number }) {
    const [NFTs, setNFTs] = useState<Nft[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserNFTs();
    }, []);

    const loadUserNFTs = async () => {
        setLoading(true);
        const resultNft = await getNftOnSaleByOwnerId(userId);
        if (resultNft.data) {
            let mappedNFTs = resultNft.data.map(NftDataMapper);
            setNFTs(mappedNFTs);
        }
        setLoading(false);
    };
    return (
        <div
            className={
                NFTs.length
                    ? 'grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8'
                    : 'flex items-center justify-center w-full h-full'
            }
        >
            {loading && <StepStatus status={EnumStepStatus.InProgress} />}
            {!loading &&( NFTs.length ? renderListOfNFTs() : renderThereIsNoItem())}
        </div>
    );

    function renderListOfNFTs(): React.ReactNode {
        return NFTs.map((nft: Nft) => (
            <NftCard
                nft={nft}
                id={nft.id}
                token={nft.tokenStandard}
                key={nft.id}
                name={nft.name}
                description={nft.description}
                likeCount={nft.likeCount}
                viewCount={nft.viewCount}
                nftThumbnail={nft.thumbnailCloudUrl}
                networkId={nft.collection.networkId}
            />
        ));
    }

    function renderThereIsNoItem(): React.ReactNode {
        return (
            <div className="flex flex-col justify-between items-center">
                <p className="text-white font-extrabold text-h4 text-center">No sale yet</p>
                <p className="text-manatee font-normal text-semiBold mt-2">Looks like you haven’t started selling.</p>
                <p className="text-manatee font-normal text-semiBold">It’s time you started with your first NFT.</p>
                <BaseButton
                    className="max-w-fit bg-coral text-smallSemiBold font-bold text-raisin-black mt-4 rounded-md"
                    type="text"
                    text="Start selling"
                    size="small"
                />
            </div>
        );
    }
}

export default OnSalesNFTs;
