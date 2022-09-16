import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import ShareNFT from '@/components/ShareNFT';

interface ShareNFTProps {
    nftName: string;
    nftId: number;
    show: boolean;
    onClose: () => void;
}

function ShareNFTModal({ nftName, nftId, show, onClose }: ShareNFTProps) {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-darker-raisin-black bg-opacity-80" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="border border-rhythm bg-space-cadet p-6 w-full max-w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-h4 font-extrabold text-white">
                                    Share this NFT
                                </Dialog.Title>
                                <ShareNFT name={nftName} id={nftId} onModalClose={onClose} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ShareNFTModal;
