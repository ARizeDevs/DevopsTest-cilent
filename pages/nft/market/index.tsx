import { Nft, SellingType } from '@/data/nft/types';
import ListOnMarketplace from './ListOnMarket';
import BuyFixedPrice from './buyFixedPrice';
import BuyTimedAuction from './buyTimedAuction';
import UnlistFromMarketplace from './UnlistFromMarket';
import CurrentBid from './currentBid';
import { MarketplaceStatus } from '@/data/marketplace/types';
const Market = ({ nft, isOwner }: { nft: Nft; isOwner: boolean }) => {
    const isOnMarketplace = nft?.marketplace?.status === MarketplaceStatus.STARTED;
    const sellingType: SellingType = nft?.marketplace?.sellingType!;
    return (
        <>
            {sellingType === SellingType.AUCTION && <CurrentBid nft={nft} />}
            {isOnMarketplace && isOwner && <UnlistFromMarketplace nft={nft} />}
            {!isOnMarketplace && isOwner && <ListOnMarketplace nft={nft} />}
            {!isOwner && isOnMarketplace && sellingType === SellingType.FIXED && <BuyFixedPrice nft={nft} />}
            {!isOwner && isOnMarketplace && sellingType === SellingType.AUCTION && <BuyTimedAuction nft={nft} />}
        </>
    );
};

export default Market;
