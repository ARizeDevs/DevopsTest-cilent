import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Nft } from '@/data/nft/types';
import styles from './sell.module.css';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { ErrorMessage } from '@/utils/errorMessages';
import classes from '@/utils/classes';
import { listItem } from '@/data/web3/basic';
import { startSell } from '@/data/web3/fixed-price-sell';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import {
    getListedItemById,
    getMarketplaceItemById,
    preListOnMarketplace,
    preStartSellFixedPrice
} from '@/data/marketplace';
import { ListingItem, ListingStatus } from '@/data/marketplace/types';
import { useRouter } from 'next/router';
import { IStep } from '@/components/FollowSteps';
import FollowSteps from '@/components/FollowSteps';
import { EnumStepStatus } from '@/components/FollowSteps/FollowSteps';
import { observer } from 'mobx-react';
import NftSuccessActionModal, { EnumAction } from '@/components/NftSuccessActionModal';
import { getNftData } from '@/data/nft';
import { getApprovalForAll, isApprovedForAll } from '@/data/web3/nft';

interface IFixedPriceProps {
    nft: Nft;
}
const FixedPriceFormSchema = yup
    .object({
        fixedPrice: yup
            .number()
            .required(ErrorMessage.Required)
            .typeError(ErrorMessage.InvaliNumber)
            .positive(ErrorMessage.InvaliNumber),
        duration: yup
            .number()
            .required(ErrorMessage.Required)
            .typeError(ErrorMessage.InvaliNumber)
            .positive(ErrorMessage.InvaliNumber)
    })
    .required();

const enum StepsKey {
    Listing = 'listing',
    Selling = 'selling'
}

const initialProccessSteps: IStep[] = [
    {
        key: StepsKey.Listing,
        title: 'Listing on the market place',
        status: EnumStepStatus.NotStarted,
        description: '',
        allowRetry: false,
        retryCallback: () => {},
        stepOrder: 1
    },
    {
        key: StepsKey.Selling,
        title: 'Start selling',
        status: EnumStepStatus.NotStarted,
        description: '',
        allowRetry: false,
        retryCallback: () => {},
        stepOrder: 2
    }
];

let checkListingStatusInterval: any;
let checkStartSellStatusInterval: any;

function FixedPriceForm(props: IFixedPriceProps) {
    const [nft, setNft] = useState(props.nft);
    const tokenStandard = nft?.collection.network.nativeToken.toUpperCase();

    const [formIsInProgress, setFormIsInProgress] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { currentChainId, walletAddress } = useAuthStore();

    const [proccessSteps, setProccessSteps] = useState<IStep[]>(initialProccessSteps);
    const [receivableFee, setReceivableFee] = useState(0);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(FixedPriceFormSchema)
    });

    useEffect(() => {
        const fixedPriceWatch = watch(({ fixedPrice }: FieldValues) => {
            setReceivableFee(fixedPrice ? fixedPrice - (fixedPrice / 100) * nft?.serviceFee : 0);
        });
        return () => fixedPriceWatch.unsubscribe();
    }, [watch]);

    const handleAddToMarketPlace = async (formData: FieldValues) => {
        setFormIsInProgress(true);

        let expirationDate: Date = new Date();
        expirationDate.setDate(expirationDate.getDate() + formData.duration);

        // get approval from user
        const allowanceForAll: boolean = await isApprovedForAll(walletAddress);
        if (!allowanceForAll) {
            const resultApprovalForAll = await getApprovalForAll();
            await resultApprovalForAll.wait();
        }

        try {
            await startListingProccess(formData.fixedPrice, expirationDate);
        } catch (e) {
            console.log('Error', e);
        }
    };

    const startListingProccess = async (price: number, expirationDate: Date) => {
        try {
            updateStepStatus(StepsKey.Listing, EnumStepStatus.InProgress);
            const resultPreListing = await preListOnMarketplace(nft.id, currentChainId);
            if (resultPreListing.data) {
                const resultListItem = await listItem(nft.collection.contractAddress, nft.tokenId);
                if (resultListItem) {
                    await resultListItem.wait();
                    startCheckingListingStatus(price, expirationDate, resultPreListing.data);
                } else {
                    updateStepStatus(StepsKey.Listing, EnumStepStatus.Fail);
                    setFormIsInProgress(false);
                }
            }
        } catch (error) {
            updateStepStatus(StepsKey.Listing, EnumStepStatus.Fail);
            clearInterval(checkListingStatusInterval);
            console.log(error);
        }
    };

    const startCheckingListingStatus = (price: number, expirationDate: Date, listingData: any) => {
        if (listingData) {
            checkListingStatusInterval = setInterval(async () => {
                const resultListedItem = await getListedItemById(listingData?.id);
                let listingStatus: ListingItem = resultListedItem.data;

                if (listingStatus.status === ListingStatus.LISTED) {
                    updateStepStatus(StepsKey.Listing, EnumStepStatus.Success);
                    clearInterval(checkListingStatusInterval);
                    checkListingStatusInterval = 0;
                    startSellingProccess(price, listingStatus.marketItemId, expirationDate);
                }
            }, 1000);
        }
    };

    const startSellingProccess = async (price: number, marketplaceItemId: number, expirationDate: Date) => {
        try {
            const startTime = Math.ceil(Date.now() / 1000);
            const endTime = Math.ceil(expirationDate.getTime() / 1000);
            updateStepStatus(StepsKey.Selling, EnumStepStatus.InProgress);

            const {
                data: { id: marketPlaceDbId }
            } = await preStartSellFixedPrice(
                price,
                nft.id,
                currentChainId,
                marketplaceItemId,
                nft.collection.network.nativeToken,
                expirationDate
            );
            const resultStartSell = await startSell(marketplaceItemId, price, startTime, endTime);
            if (resultStartSell) {
                await resultStartSell.wait();
                startCheckingSellingStatus(marketPlaceDbId);
            } else {
                updateStepStatus(StepsKey.Selling, EnumStepStatus.Fail);
            }
        } catch (error) {
            console.log(error);
            updateStepStatus(StepsKey.Selling, EnumStepStatus.Fail);
        }
    };

    const startCheckingSellingStatus = (marketplaceItemId: number) => {
        checkStartSellStatusInterval = setInterval(async () => {
            const marketplaceResult = await getMarketplaceItemById(marketplaceItemId);
            if (marketplaceResult.data && marketplaceResult.data.status === 'STARTED') {
                updateStepStatus(StepsKey.Selling, EnumStepStatus.Success);

                clearInterval(checkStartSellStatusInterval);
                checkStartSellStatusInterval = 0;
                const resultNft = await getNftData(nft.id);
                const updatedNft: Nft = {
                    ...resultNft.data.nft,
                    likeCount: resultNft.data.likeCount,
                    viewCount: resultNft.data.viewCount,
                    isLikedNft: resultNft.data.isLikedNft,
                    serviceFee: resultNft.data.serviceFee,
                    marketplace: resultNft.data.marketplace,
                    bids: resultNft.data.bids
                };
                setNft(updatedNft);
                setFormIsInProgress(false);
                openSuccessModal();
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
    const openSuccessModal = () => {
        setShowSuccessModal(true);
    };
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <form onSubmit={handleSubmit(handleAddToMarketPlace)} className="h-full flex flex-col">
            <div className={classes(['flex-1 overflow-y-auto', styles.scroll])}>
                <div className="pb-5">
                    <label htmlFor="price" className="text-manatee text-smallText">
                        Price*
                    </label>
                    <div
                        className={`p-2 h-11 w-full text-white bg-dark-raisin-black rounded flex ${
                            errors.fixedPrice && 'border border-outrageous-orange'
                        }`}
                    >
                        <input
                            type="number"
                            step="any"
                            placeholder="enter price for 1 piece"
                            className={`flex-1 bg-transparent ${styles.inputNumber}`}
                            {...register('fixedPrice')}
                        />

                        <div className="text-semiBold leading-7 ">{tokenStandard}</div>
                    </div>
                    {errors.fixedPrice && (
                        <p className="text-smallText text-outrageous-orange pt-1">{errors.fixedPrice.message}</p>
                    )}

                    <div className="text-manatee text-smallText pt-1">
                        <div className="pt-1">
                            Service fee: <span className="text-white text-smallSemiBold">{nft?.serviceFee}%</span>
                        </div>
                        <div className="pt-1">
                            You will receive:{' '}
                            <span className="text-white text-smallSemiBold">{`${receivableFee} ${tokenStandard}`}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="duration" className="text-manatee text-smallText">
                        Duration*
                    </label>
                    <div
                        className={`p-2 h-11 w-full text-white bg-dark-raisin-black rounded flex ${
                            errors.duration && 'border border-outrageous-orange'
                        }`}
                    >
                        <div className="flex flex-1">
                            <input
                                type="number"
                                placeholder="14 Days"
                                {...register('duration')}
                                className={`flex-1 bg-transparent ${styles.inputNumber}`}
                            />
                            <label htmlFor="duration" className="py-0.5">
                                {getValues('duration') > 1 ? 'Days' : 'Day'}
                            </label>
                        </div>
                        {/* <div className="p-1">
                                <CalendarIcon />
                            </div> */}
                    </div>
                </div>
                {errors.duration && (
                    <p className="text-smallText text-outrageous-orange pt-1">{errors.duration.message}</p>
                )}
            </div>
            <div className="mt-6 pt-6 sticky border-t-2 border-dark-raisin-black flex-none">
                <BaseButton
                    type="text"
                    text="List on Marketplace"
                    size="large"
                    className="bg-coral text-raisin-black font-bold"
                    inputType="submit"
                    isDisabled={formIsInProgress}
                />
            </div>
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
                    action={EnumAction.list}
                    buttonText="See my listed 3D NFTs"
                    onButtonClick={() => {
                        closeSuccessModal();
                        router.push(`/profile/${nft.ownerId}`);
                    }}
                    onClose={closeSuccessModal}
                    show={showSuccessModal}
                />
            )}
        </form>
    );
}

export default observer(FixedPriceForm);
