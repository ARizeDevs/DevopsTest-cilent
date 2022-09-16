import React, { useEffect, useState } from 'react';
import Modal, { IModalProps } from '@/components/Modal';
import { Nft } from '@/data/nft/types';
import { stringShorter } from '@/utils/stringFormat';
import TokenLogo from '@/components/TokenLogo';
import LockIcon from '@/assets/icons/lock.svg';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { priceMeet } from '@/data/web3/fixed-price-sell';
import { AuthStore, ProcessStatus, useAuthStore } from 'store/AuthStore';
import { TokenBalance } from '@/data/web3/wallet/types';
import { observer } from 'mobx-react';
import { getMarketplaceItemById, postBuy, preBuy } from '@/data/marketplace';
import { useGlobalStore } from 'store/GlobalStore';
import { BidStatus, MarketplaceStatus } from '@/data/marketplace/types';
import { interval, from } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import FollowSteps from '@/components/FollowSteps';
import { EnumStepStatus, IStep } from '@/components/FollowSteps/FollowSteps';
import Spin from '@/components/Spin';

interface CheckoutProps extends Pick<IModalProps, 'show' | 'onClose'> {
    nft: Nft;
    onSuccess: () => void;
}
const enum StepsKey {
    Selling = 'selling'
}

const initialProccessSteps: IStep[] = [
    {
        key: StepsKey.Selling,
        title: 'Confirm Purchase',
        status: EnumStepStatus.NotStarted,
        description: '',
        allowRetry: false,
        retryCallback: () => {},
        stepOrder: 1
    }
];

let checkBuyStatusInterval;

function Checkout({ nft, show, onClose, onSuccess }: CheckoutProps) {
    const [balance, setBalance] = useState(0);
    const [hasSufficientFee, setHasSufficientFee] = useState<boolean | null>(null);
    const [formIsInProgress, setFormIsInProgress] = useState<boolean>(false);
    const [proccessSteps, setProccessSteps] = useState<IStep[]>(initialProccessSteps);
    const { changeToastNotificationState } = useGlobalStore();
    const authStore: AuthStore = useAuthStore();
    const { walletAddress: userWalletAddress, balances, currentChainId, loadingBalacesStatus } = authStore;
    const paymentFee = nft.marketplace.basePrice;
    const paymentToken = nft?.collection?.network?.nativeToken!;

    useEffect(() => {
        if (loadingBalacesStatus === ProcessStatus.Success) {
            checkUserSufficientFund();
        }
    }, [balances, loadingBalacesStatus]);

    const chainIdMapping: { [key: number]: { name: string; title: string } } = {
        1: { name: 'eth', title: 'Ethereum' },
        56: { name: 'bsc', title: 'Binance' },
        97: { name: 'bsctestnet', title: 'Binance' },
        137: { name: 'polygon', title: 'Polygon' }
    };

    const checkUserSufficientFund = () => {
        if (balances) {
            const balance = balances.find((item: TokenBalance) => {
                return item.symbol === paymentToken;
            });
            setBalance(balance?.balance || 0);

            setHasSufficientFee(balance ? balance?.balance >= paymentFee : false);
        }
    };

    const handleBuyFixedPriceSell = async () => {
        try {
            await startBuyProccess();
        } catch (error) {
            console.log(error);
            changeToastNotificationState(true, <p>{error.message}</p>, 'Error', 5000);
        } finally {
            setFormIsInProgress(false);
        }
    };
    const startBuyProccess = async () => {
        try {
            setFormIsInProgress(true);
            updateStepStatus(StepsKey.Selling, EnumStepStatus.InProgress);
            const resultPreBuy = await preBuy(nft.id, paymentFee);
            const resultPriceMeet = await priceMeet(
                nft.marketplace.marketItemId,
                nft.collection.contractAddress,
                nft.tokenId,
                paymentFee,
                nft.serviceFee * 100
            );
            if (resultPriceMeet) {
                const txHash: string = resultPriceMeet.hash;
                startCheckingBuyProccess(txHash);
            }
        } catch (error) {
            console.log(error);
            updateStepStatus(StepsKey.Selling, EnumStepStatus.Fail);
        }
    };

    const startCheckingBuyProccess = async (txHash: string) => {
        const resultPostBuy = await postBuy(nft.id, txHash);
        const checkingBuyProcessInterval = interval(1000);
        const subscription = checkingBuyProcessInterval
            .pipe(
                exhaustMap(() => {
                    const response = from(getMarketplaceItemById(nft.marketplace.id));
                    response.subscribe((marketplace) => {
                        if (marketplace.data && marketplace.data.status === MarketplaceStatus.COMPLETED) {
                            subscription.unsubscribe();
                            setFormIsInProgress(false);
                            onSuccess();
                        }
                    });

                    return response;
                })
            )
            .subscribe();
    };

    const updateStepStatus = (key: StepsKey, status: EnumStepStatus) => {
        let steps = [...proccessSteps];

        let step = steps.find((step: IStep) => {
            return step.key === key;
        });
        if (step) step.status = status;

        setProccessSteps(steps);
    };

    if (!nft) return <></>;
    return (
        <Modal title="Checkout" show={show} onClose={onClose}>
            <div className="w-72">
                <div className="text-semiBold text-manatee mb-4">
                    You are about to purchase a <span className="text-white font-bold">{nft?.name}</span> from{' '}
                    <span className="text-white font-bold">{stringShorter(nft.owner.publicAddress, 11, 4)}</span>
                </div>
                <div className="rounded-lg p-2 flex mb-4 bg-independence">
                    <div className="flex-none mr-2">
                        <TokenLogo name={paymentToken} />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="text-white text-semiBold font-bold leading-5">
                            {stringShorter(userWalletAddress, 11, 4)}
                        </div>
                        <div className="text-manatee text-smallText leading-5">
                            {!!currentChainId && chainIdMapping[currentChainId].title}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mb-4">
                    <div className="text-smallText text-light-independence">Copies</div>
                    <div className="rounded-lg bg-independence p-2 flex items-center justify-between mb-1.5">
                        <input
                            type="text"
                            className="bg-transparent text-manatee text-semiBold flex-1"
                            disabled
                            defaultValue={1}
                        />
                        <LockIcon />
                    </div>
                    <div className="text-semiBold text-manatee">Buying multiple is unavailable for this item</div>
                </div>
                <div className="flex flex-col mb-8">
                    <div className="flex justify-between mb-1">
                        <span className="text-manatee text-smallText mr-auto">Balance</span>
                        <span className="text-white text-smallText">{`${balance} ${paymentToken}`}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="text-manatee text-smallText">Service fee 0%</span>
                        <span className="text-white text-smallText">{`0 ${paymentToken}`}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-manatee text-smallText">You will pay</span>
                        <span className="text-white text-smallText">{paymentFee}</span>
                    </div>
                </div>
                {loadingBalacesStatus === ProcessStatus.Success && (
                    <div className="flex flex-col">
                        {hasSufficientFee && (
                            <>
                                <BaseButton
                                    type="text"
                                    text="Buy"
                                    className="bg-coral text-raisin-black text-semiBold font-bold h-11 flex items-center mb-2"
                                    onClick={handleBuyFixedPriceSell}
                                    isDisabled={formIsInProgress}
                                />
                                <BaseButton
                                    type="text"
                                    text="Cancel"
                                    className="bg-independence text-white text-semiBold font-bold h-11 flex items-center"
                                    onClick={onClose}
                                />
                            </>
                        )}
                        {!hasSufficientFee && (
                            <>
                                <div className="text-center text-outrageous-red text-paragraph">
                                    Insufficient funds in {nft.collection.network.nativeToken.toUpperCase()}
                                </div>
                                <div className="text-center text-manatee text-semiBold">
                                    Please add funds to your connected wallet to buy this AR NFT.
                                </div>
                            </>
                        )}
                    </div>
                )}
                {loadingBalacesStatus === ProcessStatus.Loading && (
                    <div className="flex items-center w-full">
                        <Spin height="16px" width="16px" />
                        <div className="text-semiBold text-manatee ml-1">Getting tokens balance</div>
                    </div>
                )}
            </div>
            {formIsInProgress && (
                <FollowSteps
                    steps={proccessSteps}
                    onCancel={() => {
                        setFormIsInProgress(false);
                    }}
                    allowCancel={true}
                />
            )}
        </Modal>
    );
}

export default observer(Checkout);
