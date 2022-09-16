import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import QuestionModal, { Action } from '@/components/QuestionModal';
import { IStep } from '@/components/FollowSteps';
import FollowSteps, { EnumStepStatus } from '@/components/FollowSteps/FollowSteps';
import NftSuccessActionModal, { EnumAction } from '@/components/NftSuccessActionModal';
import {
    getMarketplaceItemById,
    getUnlistedItemById,
    preCancelSellFixedPrice,
    preCancelSellTimedAuction,
    removeFromMarkeplace as unlistFromMarkeplace
} from '@/data/marketplace';
import { Nft, SellingType } from '@/data/nft/types';
import { unlistItem } from '@/data/web3/basic';
import { cancelSell } from '@/data/web3/fixed-price-sell';
import { cancelAuctionWithFund } from '@/data/web3/timing-auction';
import { update } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useGlobalStore } from 'store/GlobalStore';
import { BidStatus, MarketplaceStatus } from '@/data/marketplace/types';

const enum StepsKey {
    Unlisting = 'unlisting',
    CancelingSell = 'cancelingSell'
}
const initialProccessSteps: IStep[] = [
    {
        key: StepsKey.CancelingSell,
        title: 'Start canceling sell',
        status: EnumStepStatus.NotStarted,
        description: '',
        allowRetry: false,
        retryCallback: () => {},
        stepOrder: 1
    },
    {
        key: StepsKey.Unlisting,
        title: 'Start unlisting from the marketplace',
        status: EnumStepStatus.NotStarted,
        description: '',
        allowRetry: false,
        retryCallback: () => {},
        stepOrder: 2
    }
];
let checkCancelingInterval;
let checkUnlistingInterval;
const UnlistFromMarketplace = ({ nft }: { nft: Nft }) => {
    const globalStore = useGlobalStore();
    const [formIsInProgress, setFormIsInProgress] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const { changeToastNotificationState } = globalStore;
    const [proccessSteps, setProccessSteps] = useState<IStep[]>(initialProccessSteps);
    const router = useRouter();

    const handleRemoveFromMarketPlace = () => {
        setShowQuestionModal(true);
    };

    const unlistNFT = () => {
        try {
            setFormIsInProgress(true);
            updateStepStatus(StepsKey.CancelingSell, EnumStepStatus.InProgress);

            if (nft?.marketplace) {
                if (nft?.marketplace?.sellingType === SellingType.FIXED) {
                    startCancellingFixedPriceSell();
                }
                if (nft?.marketplace?.sellingType === SellingType.AUCTION) {
                    startCancellingTimedAuctionSell();
                }
            }
        } catch (error) {
            console.log(error);
            changeToastNotificationState(true, <p>{error.message}</p>, 'Error', 5000);
        }
    };

    const startCancellingTimedAuctionSell = async () => {
        try {
            const resultPreCancel = await preCancelSellTimedAuction(nft.marketplace.id);
            if (resultPreCancel.data.isSuccess) {
                let resultCancel = await cancelAuctionWithFund(nft.marketplace.marketItemId, true);
                if (resultCancel) {
                    await resultCancel.wait();
                    startCheckingCancellingResult();
                }
            }
        } catch (error) {
            console.log(error);
            updateStepStatus(StepsKey.CancelingSell, EnumStepStatus.Fail);
        }
    };

    const startCancellingFixedPriceSell = async () => {
        try {
            const resultPreCancel = await preCancelSellFixedPrice(nft.marketplace.id);
            if (resultPreCancel.data.isSuccess) {
                const resultCancel = await cancelSell(nft.marketplace.marketItemId);
                if (resultCancel) {
                    await resultCancel.wait();
                    startCheckingCancellingResult();
                }
            }
        } catch (error) {
            console.log(error);
            updateStepStatus(StepsKey.CancelingSell, EnumStepStatus.Fail);
        }
    };

    const startCheckingCancellingResult = async () => {
        checkCancelingInterval = setInterval(async () => {
            const resultMarketItem = await getMarketplaceItemById(nft.marketplace.id);
            if (resultMarketItem.data.status === MarketplaceStatus.CANCELED) {
                clearInterval(checkCancelingInterval);
                updateStepStatus(StepsKey.CancelingSell, EnumStepStatus.Success);
                startUnlisting();
            }
        }, 1000);
    };

    const startUnlisting = async () => {
        try {
            updateStepStatus(StepsKey.Unlisting, EnumStepStatus.InProgress);
            const resultUnlist = await unlistItem(nft.marketplace.marketItemId);
            if (resultUnlist) {
                await resultUnlist.wait();
                startCheckingUnlistingResult();
            }
        } catch (error) {
            console.log(error);
            updateStepStatus(StepsKey.Unlisting, EnumStepStatus.Fail);
        }
    };

    const startCheckingUnlistingResult = async () => {
        checkUnlistingInterval = setInterval(async () => {
            const resultMarketItem = await getUnlistedItemById(nft.id);
            if (resultMarketItem.data.status === MarketplaceStatus.UNLISTED) {
                clearInterval(checkUnlistingInterval);
                updateStepStatus(StepsKey.Unlisting, EnumStepStatus.Success);
            }
        }, 1000);
    };

    const updateStepStatus = (key: StepsKey, status: EnumStepStatus) => {
        let steps = [...proccessSteps];

        let step = steps.find((step: IStep) => {
            return step.key === key;
        });
        if (step) step.status = status;

        setProccessSteps(steps);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const cancelQuestionModal = () => {
        setShowQuestionModal(false);
    };
    const confirmQuestionModal = () => {
        setShowQuestionModal(false);
        unlistNFT();
    };

    const questionModalActions: Action[] = [
        { caption: 'Yes', type: 'primary', callback: confirmQuestionModal, order: 1 },
        { caption: 'Cancel', type: 'secondary', callback: cancelQuestionModal, order: 2 }
    ];

    return (
        <div>
            <BaseButton
                text="Unlist from Marketplace"
                type="text"
                size="large"
                className="bg-coral text-raisin-black font-bold"
                onClick={handleRemoveFromMarketPlace}
                isDisabled={formIsInProgress}
            />
            {formIsInProgress && (
                <FollowSteps
                    steps={proccessSteps}
                    onCancel={() => {
                        setFormIsInProgress(false);
                    }}
                    allowCancel={false}
                />
            )}
            {showSuccessModal && (
                <NftSuccessActionModal
                    nft={nft}
                    action={EnumAction.unlist}
                    buttonText="See my listed 3D NFTs"
                    onButtonClick={() => {
                        closeSuccessModal();
                        router.push(`/profile/${nft.ownerId}`);
                    }}
                    onClose={closeSuccessModal}
                    show={showSuccessModal}
                />
            )}
            {showQuestionModal && (
                <QuestionModal
                    title={'Unlist NFT'}
                    description={
                        <p>
                            Are you sure that you want to unlist the{' '}
                            <span className="text-coral font-bold">{nft.name}</span>?
                        </p>
                    }
                    actions={questionModalActions}
                    show={showQuestionModal}
                    onClose={cancelQuestionModal}
                />
            )}
        </div>
    );
};

export default UnlistFromMarketplace;
