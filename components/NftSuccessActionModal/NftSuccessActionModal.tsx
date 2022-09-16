import Modal, { IModalProps } from '@/components/Modal';
import { Nft } from '@/data/nft/types';
import React from 'react';
import Image from 'next/image';
import ShareNFT from '@/components/ShareNFT';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import styles from './NftSuccessActionModal.module.css';
export const enum EnumAction {
    buy = 'buy',
    sell = 'sold',
    list = 'listed',
    unlist = 'unlisted'
}
interface SuccessBuyProps extends Pick<IModalProps, 'show' | 'onClose'> {
    nft: Nft;
    action: EnumAction;
    buttonText: string;
    onButtonClick: () => void;
}
function NftSuccessActionModal({ nft, action, show, buttonText, onButtonClick, onClose }: SuccessBuyProps) {
    return (
        <Modal onClose={onClose} show={show} className={styles.successBackground}>
            <div className={styles.container}>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                    <Image
                        src={nft.thumbnailCloudUrl}
                        alt={nft.name}
                        width={'100%'}
                        height={'100%'}
                        layout="responsive"
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL="/assets/images/loading.svg"
                        sizes="100vw"
                    />
                </div>
                <div className="my-4 text-paragraph text-white flex flex-col">
                    Congratulations! you have just {action}
                    <span className="font-bold text-coral contents">{` ${nft.name} `}</span>
                    for
                    <span className="font-bold text-coral contents">
                        {` ${nft.marketplace.basePrice} ${nft.marketplace.token}`}
                    </span>
                    !
                </div>
                <div className="flex flex-col">
                    <p className="text-h5 text-white text-center">Share it</p>
                    <ShareNFT id={nft.id} name={nft.name} onModalClose={() => {}} />
                </div>
                <div className="mt-8">
                    <BaseButton
                        onClick={onButtonClick}
                        text={buttonText}
                        type="text"
                        className="bg-coral text-raisin-black text-semiBold font-bold h-11 justify-center items-center"
                    />
                </div>
            </div>
        </Modal>
    );
}

export default NftSuccessActionModal;
