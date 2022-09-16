import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { Nft } from '@/data/nft/types';
import { listItem } from '@/data/web3/basic';
import { useRouter } from 'next/router';

const ListOnMarketplace = ({ nft }: { nft: Nft }) => {
    const router = useRouter();
    const handleListOnMarket = async () => {
        // const result = await listItem(nft.collection.contractAddress, nft.tokenId);
        router.push(`/sell/${nft.id}`);
    };
    return (
        <div>
            <BaseButton
                text="List on Marketplace"
                type="text"
                size="large"
                className="bg-coral text-raisin-black font-700"
                onClick={handleListOnMarket}
            />
        </div>
    );
};

export default ListOnMarketplace;
