import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { Nft } from '@/data/nft/types';
import Bid from 'pages/nft/modals/Bid';
import { useState } from 'react';

const BuyTimedAuction = ({ nft }: { nft: Nft }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const closePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const openPaymentModal = () => {
        setShowPaymentModal(true);
    };
    if (!nft?.marketplace!) return <></>;

    return (
        <div>
            <BaseButton
                text='Place a bid'
                type="text"
                size="large"
                className="bg-coral text-raisin-black font-bold"
                onClick={openPaymentModal}
            />
            {showPaymentModal && <Bid nft={nft} show={showPaymentModal} onClose={closePaymentModal} />}
            
        </div>
    );
};

export default BuyTimedAuction;
