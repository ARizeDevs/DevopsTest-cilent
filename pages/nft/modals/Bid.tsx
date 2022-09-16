import React, { useEffect, useState } from 'react';
import Modal, { IModalProps } from '@/components/Modal';
import { Nft } from '@/data/nft/types';
import { stringShorter } from '@/utils/stringFormat';
import TokenLogo from '@/components/TokenLogo';
import LockIcon from '@/assets/icons/lock.svg';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { priceMeet } from '@/data/web3/fixed-price-sell';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { TokenBalance } from '@/data/web3/wallet/types';
import { observer } from 'mobx-react';

interface BidProps extends Pick<IModalProps, 'show' | 'onClose'> {
    nft: Nft;
}

function Bid({ nft, show, onClose }: BidProps) {
    const [serviceFee, setServiceFee] = useState(0);
    const [balance, setBalance] = useState(0);
    const [paymentFee, setPaymentFee] = useState(0);
    const paymentToken = nft?.collection?.network?.nativeToken!;
    const [hasSufficientFee, setHasSufficientFee] = useState<boolean | null>(null);

    const authStore: AuthStore = useAuthStore();
    const { walletAddress: userWalletAddress, balances, currentChainId } = authStore;

    useEffect(() => {
        calculateFees();
    }, []);

    useEffect(() => {
        checkUserSufficientFund();
    }, [balances, paymentToken]);

    const chainIdMapping: { [key: number]: { name: string; title: string } } = {
        1: { name: 'eth', title: 'Ethereum' },
        56: { name: 'bsc', title: 'Binance' },
        97: { name: 'bsctestnet', title: 'Binance' },
        137: { name: 'polygon', title: 'Polygon' }
    };

    const checkUserSufficientFund = () => {
        if (balances) {
            const balance = balances.find((item: TokenBalance) => {
                item.symbol === paymentToken;
            });
            setBalance(balance?.balance || 0);

            setHasSufficientFee(balance ? balance?.balance >= nft.marketplace.basePrice : false);
        }
    };
    const calculateFees = () => {
        const basePrice = nft.marketplace.basePrice;
        const serviceFee = (basePrice / 100) * nft.serviceFee;
        setServiceFee(serviceFee);
        setPaymentFee(basePrice + serviceFee);
    };

    const handleBuyFixedPriceSell = async () => {
        await priceMeet(nft.marketItemId, nft.collection.address, nft.tokenId, 0, 0);
    };
    
    if (!nft) return <></>;
    return (
        <Modal title="Place a bid" show={show} onClose={onClose}>
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
                    <div className="text-smallText text-light-independence">Your bid</div>
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
                <div className="flex flex-col mb-4">
                    <div className="text-smallText text-light-independence">Enter quantity</div>
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
                        <span className="text-manatee text-smallText mr-auto">Your balance</span>
                        <span className="text-manatee text-smallText">{`${balance} ${paymentToken}`}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="text-manatee text-smallText mr-auto">Balance</span>
                        <span className="text-manatee text-smallText">{`${balance} ${paymentToken}`}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="text-manatee text-smallText">Service fee {nft.serviceFee}%</span>
                        <span className="text-manatee text-smallText">{`${serviceFee} ${paymentToken}`}</span>
                    </div>
                    <div className="border-b-2 border-independence mx-4 "></div>
                    <div className="flex justify-between">
                        <span className="text-manatee text-smallText">You will pay</span>
                        <span className="text-white text-smallText">{paymentFee}</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    {hasSufficientFee && (
                        <>
                            <BaseButton
                                type="text"
                                text="Buy"
                                className="bg-coral text-raisin-black text-semiBold font-bold h-11 flex items-center mb-2"
                                onClick={handleBuyFixedPriceSell}
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
            </div>
        </Modal>
    );
}

export default observer(Bid);
