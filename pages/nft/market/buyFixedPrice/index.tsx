import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { Nft } from '@/data/nft/types';
import Checkout from 'pages/nft/modals/Checkout';
import { useState } from 'react';
import NftSuccessActionModal, { EnumAction } from '@/components/NftSuccessActionModal';
import { useRouter } from 'next/router';

const BuyFixedPrice = ({ nft }: { nft: Nft }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();

    const closePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const openPaymentModal = () => {
        setShowPaymentModal(true);
    };
    const openSuccessModal = () => {
        closePaymentModal();
        setShowSuccessModal(true);
    };
    const closeSuccessModal=()=>{
        setShowSuccessModal(false);
    }
    if (!nft?.marketplace!) return <></>;

    return (
        <div>
            <BaseButton
                text={`Buy for ${nft.marketplace.basePrice} ${nft.collection.network.nativeToken}`}
                type="text"
                size="large"
                className="bg-coral text-raisin-black font-bold"
                onClick={openPaymentModal}
            />
            {showPaymentModal && (
                <Checkout nft={nft} show={showPaymentModal} onClose={closePaymentModal} onSuccess={openSuccessModal} />
            )}
            {showSuccessModal && (
                <NftSuccessActionModal
                    nft={nft}
                    action={EnumAction.buy}
                    buttonText="View 3D NFT"
                    onButtonClick={() => {
                        closeSuccessModal();
                        router.push(`/nft/${nft.id}`);
                    }}
                    onClose={closeSuccessModal}
                    show={showSuccessModal}
                />
            )}
        </div>
    );
};

export default BuyFixedPrice;
