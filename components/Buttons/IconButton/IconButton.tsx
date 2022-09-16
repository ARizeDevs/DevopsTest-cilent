import React from 'react';
import BaseButton from '../BaseButton/BaseButton';
import styles from './iconButton.module.css';
import classes from '../../../utils/classes';

interface IconButtonProps {
    text: string;
    beforeIcon?: boolean;
    afterIcon?: boolean;
    icon: string;
    size?: 'small' | 'large';
    onClick?: () => void;
    externalClass?: string;
    isDisabled?: boolean;
}

const IconButton = (props: IconButtonProps) => {
    const { text, size, onClick, isDisabled, externalClass } = props;
    const iconButtonSizeClass =
        size === 'large' ? styles.largeIconButton : styles.smallIconButton;
    const iconButtonClasses = classes([
        iconButtonSizeClass,
        styles.iconButton,
        externalClass!,
        isDisabled ? styles.disabledButton : '',
        'flex items-center'
    ]);
    const beforeIconClass = classes([text ? 'mr-1' : '']);

    return (
        <div onClick={onClick} className={iconButtonClasses}>
            {props.beforeIcon && (
                <span className={beforeIconClass}>
                    <props.icon />
                </span>
            )}
            <BaseButton
                className={styles.coreButton}
                type="text"
                text={text}
                size={size}
                isDisabled={isDisabled}
            />
            {props.afterIcon && (
                <span className={styles.afterIcon}>
                    <props.icon />
                </span>
            )}
        </div>
    );
};

export default IconButton;
