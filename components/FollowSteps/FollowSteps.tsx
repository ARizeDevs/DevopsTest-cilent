import React from 'react';
import Modal from '@/components/Modal';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import StepStatus from './StepStatus';

interface FollowStepsProps {
    title?: string;
    steps: IStep[];
    onCancel?: () => void;
    allowCancel: boolean;
}
export interface IStep {
    key: string;
    title: string;
    description: string;
    status: EnumStepStatus;
    allowRetry: boolean;
    retryCallback: () => void;
    stepOrder: number;
}
export enum EnumStepStatus {
    NotStarted = 'notstarted',
    InProgress = 'inprogress',
    Success = 'success',
    Fail = 'fail'
}

function FollowSteps({ title, steps, onCancel, allowCancel }: FollowStepsProps) {
    return (
        <Modal title={title ?? 'Follow Steps'} show={true} onClose={onCancel} disableOutsideClick>
            <div className="w-72">
                <div className="flex flex-col gap-6">{generateStepsElements()}</div>
                {allowCancel && (
                    <BaseButton
                        type="text"
                        onClick={onCancel}
                        text="Cancel"
                        className="bg-independence text-white text-semiBold justify-center items-center h-11 mt-8"
                    />
                )}
            </div>
        </Modal>
    );

    function generateStepsElements(): React.ReactNode {
        let result = steps
            .sort((a: IStep, b: IStep) => a.stepOrder - b.stepOrder)
            .map((step: IStep, index) => {
                return (
                    <div className="flex gap-4" key={step.key + index}>
                        <div className="flex-none justify-center items-center w-8 h-8">
                            <StepStatus status={step.status} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="text-h5 text-white">{step.title}</p>
                            <p className="text-semiBold text-manatee">{step.description}</p>
                        </div>
                    </div>
                );
            });
        return result;
    }
}

export default FollowSteps;
