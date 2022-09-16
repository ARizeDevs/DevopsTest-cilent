import React, { useState, useEffect } from 'react';
import BaseInput from '../BaseInput/BaseInput';
import classes from '../../../utils/classes';
import styles from '../GeneralInput/generalInput.module.css';
import Wrong from '../../../assets/icons/wrong.svg';
import Check from '../../../assets/icons/check.svg';

interface SlottedInputProps {
    type: string;
    name: string;
    isDisabled?: boolean;
    validation?: any;
    className?: string;
    inputClassName?: string;
    placeholder?: string;
    onChange?: (value: any, name: string, validation: boolean) => void;
    value?: any;
    label?: string;
    size?: string;
    errorMessage?: string;
    successMessage?: string;
    beforeChild?: React.ReactNode;
    afterChild?: React.ReactNode;
    isAutoComplete?: string;
}

const SlottedInput = (props: SlottedInputProps) => {
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
        inputClassName,
        afterChild,
        beforeChild,
        isAutoComplete
    } = props;
    const [isValid, setValidation] = useState<any>();

    useEffect(() => {
        inputValidation(value);
    }, [value]);

    const inputValidation = (value: any) => {
        let isValidationMatch;
        if (validation) {
            if (!value) {
                setValidation(null);
                if (onChange) onChange(value, name, true);
            } else {
                const validationRegex = new RegExp(validation);
                isValidationMatch = validationRegex.test(value);
                setValidation(isValidationMatch);
                if (onChange) onChange(value, name, isValidationMatch);
            }
        } else {
            if (onChange) onChange(value, name, true);
        }
    };

    const onChangeValue = (e: any) => {
        const value = e.target.value;
        inputValidation(value);
    };

    const inputSizeClassName = size === 'large' ? styles.largeGeneralInput : styles.smallGeneralInput;
    const baseInputClassName = classes([styles.generalInput, inputSizeClassName, className!]);
    const validationClass = isValid === false && styles.generalInputInvalid;
    return (
        <label className={styles.generalInputContainer}>
            <span className={classes([styles.generalInputLabel, 'font-semibold text-smallSemiBold text-manatee'])}>
                {label}
            </span>
            <div className={baseInputClassName + ' ' + validationClass}>
                {beforeChild && beforeChild}
                <BaseInput
                    type={type}
                    isDisabled={isDisabled}
                    value={value}
                    className={inputClassName}
                    placeholder={placeholder}
                    name={name}
                    onChange={onChangeValue}
                    isAutoComplete={isAutoComplete}
                />
                {afterChild && afterChild}
            </div>
            {isValid === false && errorMessage && (
                <div className={styles.generalInputValidation}>
                    <Wrong />
                    <span className={styles.generalInputWrongValidation}>{errorMessage}</span>
                </div>
            )}
            {isValid && successMessage && (
                <div className={styles.generalInputValidation}>
                    <Check />
                    <span className={styles.generalInputRightValidation}>{successMessage}</span>
                </div>
            )}
        </label>
    );
};

export default SlottedInput;
