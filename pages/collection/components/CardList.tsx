import NftCard from '@/components/Cards/NftCard/NftCard';
import { Nft } from '@/data/nft/types';

interface cardListProps {
    items: Array<any>;
}

const CardList = (props: cardListProps) => {
    const { items } = props;
    if (!items?.length) return <></>;

    const cards = items.map(({ nft, likeCount, viewCount }: any) => {
        return (
            <NftCard
                nft={nft}
                id={nft.id}
                token={nft.tokenStandard}
                key={nft.id}
                name={nft.name}
                description={nft.description}
                likeCount={likeCount}
                viewCount={viewCount}
                nftThumbnail={nft.thumbnailCloudUrl}
                networkId={nft.collection.networkId}
            />
        );
    });

    return <>{cards}</>;
};

export default CardList;
