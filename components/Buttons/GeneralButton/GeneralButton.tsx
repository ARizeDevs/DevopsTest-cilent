import React from 'react';
import styles from '../BaseButton/baseButton.module.css';
import classes from '../../../utils/classes';

interface GeneralButtonProps {
    size?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const GeneralButton = (props: GeneralButtonProps) => {
    const { className, size, isDisabled, onClick, children } = props;
    const buttonSizeClassName =
        size === 'large' ? styles.largeBaseButton : styles.smallBaseButton;
    const buttonClassNames = classes([
        buttonSizeClassName,
        styles.baseButtonContainer,
        className!
    ]);

    return (
        <button
            onClick={onClick}
            className={buttonClassNames}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};

export default GeneralButton;
