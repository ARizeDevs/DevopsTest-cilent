import React from 'react';
import Modal, { IModalProps } from '@/components/Modal';
import { action as Action } from 'mobx';
import BaseButton from '../Buttons/BaseButton/BaseButton';
import classes from '@/utils/classes';

export interface Action {
    caption: string;
    type: 'primary' | 'secondary' | 'other';
    order: number;
    callback: () => void;
}
interface QuestionModalProps extends Pick<IModalProps, 'show' | 'onClose'> {
    title: string;
    description: React.ReactElement;
    actions: Action[];
}

function QuestionModal({ title, description, actions, show, onClose }: QuestionModalProps) {
    console.log(title);
    
    return (
        <Modal title={title} onClose={onClose} disableOutsideClick show={show}>
            <div className="w-78 flex flex-col">
                <div className="text-semiBold text-manatee mb-8">{description}</div>
                {renderButtons()}
            </div>
        </Modal>
    );

    function renderButtons() {
        return (
            <div className="flex flex-col gap-2">
                {actions
                    .sort((first: Action, second: Action) => first.order - second.order)
                    .map((action: Action, index: number) => (
                        <BaseButton
                            key={action.caption + index}
                            type="text"
                            text={action.caption}
                            onClick={action.callback}
                            className={classes([
                                'text-semiBold h-11 items-center justify-center',
                                action.type === 'primary' ? 'bg-coral text-raisin-black' : 'bg-independence text-white'
                            ])}
                        />
                    ))}
            </div>
        );
    }
}

export default QuestionModal;
