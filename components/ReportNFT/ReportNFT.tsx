import React, { Fragment, useState } from 'react';
import GeneralInput from '@/components/Inputs/GeneralInput/GeneralInput';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import { Dialog, Transition } from '@headlessui/react';

interface ReportNFTProps {
    nftId: number;
    onModalClose: () => void;
}
function ReportNFT({ nftId, onModalClose }: ReportNFTProps) {
    const [reportFormIsValid, setReportFormIsValid] = useState<boolean>(false);
    const [reportMessage, setReportMessage] = useState<string>('');

    const checkFieldValidation = (value: any, field: string = 'report', isValid: boolean) => {
        setReportFormIsValid(isValid === true);
        setReportMessage(value);
    };

    const handleReportSubmit = () => {
        //TODO: call api
        onModalClose && onModalClose();
    };

    return (
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
                            Why are you reporting
                        </Dialog.Title>
                        <p className="font-normal text-semiBold text-manatee my-4">
                            Tell use how this user violates the rules of the platform
                        </p>
                        <GeneralInput
                            name="report"
                            type="text"
                            validation={/\S{2,32}/}
                            inputClassName="border-0 mt-1 bg-independence"
                            placeholder="Tell use some details"
                            label="Message"
                            size="large"
                            errorMessage="Message is not valid"
                            onChange={checkFieldValidation}
                        />
                        <BaseButton
                            isDisabled={!reportFormIsValid}
                            type="text"
                            text="Report"
                            size="large"
                            className="bg-coral text-raisin-black mt-8"
                            onClick={handleReportSubmit}
                        />
                        <BaseButton
                            onClick={() => {
                                onModalClose && onModalClose();
                            }}
                            type="text"
                            text="Cancel"
                            size="large"
                            className="bg-independence text-white mt-2"
                        />
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
    );
}

export default ReportNFT;
