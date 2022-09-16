import classes from '@/utils/classes';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, PropsWithChildren } from 'react';

export interface IModalProps {
    title?: string;
    show: boolean;
    onClose: () => void;
    className?: string;
    disableOutsideClick?: boolean;
}
function Modal({ title, show, onClose, className, disableOutsideClick, children }: PropsWithChildren<IModalProps>) {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" onClose={disableOutsideClick ? () => null : onClose} className="relative z-10" static>
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
                            <Dialog.Panel
                                className={classes([
                                    'border border-rhythm bg-space-cadet p-6 w-full max-w-fit transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all',
                                    className
                                ])}
                            >
                                {title && (
                                    <Dialog.Title className="text-h4 font-extrabold text-white pb-4">
                                        {title}
                                    </Dialog.Title>
                                )}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Modal;
