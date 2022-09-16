import React, { useState } from 'react';
import BaseInput from '../BaseInput/BaseInput';
import classes from '../../../utils/classes';
import styles from '../GeneralInput/generalInput.module.css';
import iconInputStyles from './iconInput.module.css';
import Wrong from '../../../assets/icons/wrong.svg';
import Check from '../../../assets/icons/check.svg';

interface IconInputProps {
    type: string;
    name: string;
    isDisabled?: boolean;
    validation?: string;
    className?: string;
    placeholder?: string;
    onChange?: (value: any) => void;
    value?: any;
    label?: string;
    size?: string;
    errorMessage?: string;
    successMessage?: string;
    beforeIcon?: string;
    afterIcon?: string;
    isAutoComplete?: string;
}

const IconInput = (props: IconInputProps) => {
    const {
        type,
        isDisabled,
        label,
        name,
        value,
        placeholder,
        validation,
        onChange,
        size,
        errorMessage,
        successMessage,
        className,
        isAutoComplete
    } = props;
    const [isValid, setValidation] = useState<any>();
    const onChangeValue = (e: any) => {
        const value = e.target.value;
        if (validation) {
            if (!value) return setValidation(null);
            const validationRegex = new RegExp(validation);
            const isValidationMatch = validationRegex.test(value);
            setValidation(isValidationMatch);
        }
        if (onChange) onChange(value);
    };
    const inputSizeClassName =
        size === 'large' ? styles.largeGeneralInput : styles.smallGeneralInput;
    const baseInputClassName = classes([
        styles.generalInput,
        iconInputStyles.iconInput,
        inputSizeClassName,
        className!
    ]);
    const validationClass = isValid === false && styles.generalInputInvalid;
    return (
        <label className={styles.generalInputContainer}>
            <span className={styles.generalInputLabel}>{label}</span>
            <div className={baseInputClassName + ' ' + validationClass}>
                {props.beforeIcon && (
                    <span className={iconInputStyles.beforeIcon}>
                        <props.beforeIcon />
                    </span>
                )}
                <BaseInput
                    type={type}
                    isDisabled={isDisabled}
                    value={value}
                    placeholder={placeholder}
                    validation={validation}
                    name={name}
                    onChange={onChangeValue}
                    isAutoComplete={isAutoComplete}
                />
                {props.afterIcon && (
                    <span className={iconInputStyles.afterIcon}>
                        <props.afterIcon />
                    </span>
                )}
            </div>
            {isValid === false && errorMessage && (
                <div className={styles.generalInputValidation}>
                    <Wrong />
                    <span className={styles.generalInputWrongValidation}>
                        errorMessage
                    </span>
                </div>
            )}
            {isValid && successMessage && (
                <div className={styles.generalInputValidation}>
                    <Check />
                    <span className={styles.generalInputRightValidation}>
                        successMessage
                    </span>
                </div>
            )}
        </label>
    );
};

export default IconInput;
