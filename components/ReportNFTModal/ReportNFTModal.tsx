import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import ReportNFT from '../ReportNFT/ReportNFT';

interface ReportNFTModalProps {
    nftId:number;
    show: boolean;
    onClose: () => void;
}

function ReportNFTModal({nftId, show, onClose }: ReportNFTModalProps) {
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
                <ReportNFT nftId={nftId} onModalClose={onClose} />
            </Dialog>
        </Transition>
    );
}

export default ReportNFTModal;
