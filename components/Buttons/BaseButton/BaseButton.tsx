import React from 'react';
import styles from './baseButton.module.css';
import classes from '../../../utils/classes';

interface BaseButtonProps {
    type: 'icon' | 'text';
    text?: string;
    icon?: string;
    size?: 'small' | 'large';
    onClick?: () => void;
    isDisabled?: boolean;
    className?: string;
    inputType?: 'button' | 'reset' | 'submit';
}

const BaseButton = (props: BaseButtonProps) => {
    const { text, className, type, size, isDisabled, inputType, onClick } = props;
    const buttonSizeClassName = size === 'large' ? styles.largeBaseButton : styles.smallBaseButton;
    const buttonClassName = classes([buttonSizeClassName, styles.baseButtonContainer, className!]);
    const buttonValue = type === 'icon' ? props.icon && <props.icon /> : text;

    return (
        <button onClick={onClick} className={buttonClassName} disabled={isDisabled} type={inputType ?? 'button'}>
            {buttonValue}
        </button>
    );
};

export default BaseButton;
