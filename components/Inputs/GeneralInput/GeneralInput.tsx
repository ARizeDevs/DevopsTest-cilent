import React, { useState, useEffect } from 'react';
import BaseInput from '../BaseInput/BaseInput';
import classes from '../../../utils/classes';
import styles from './generalInput.module.css';
import Wrong from '../../../assets/icons/wrong.svg';
import Check from '../../../assets/icons/check.svg';

interface GeneralInputProps {
    name: string;
    type: string;
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
    isAutoComplete?: string;
}

const GeneralInput = (props: GeneralInputProps) => {
    const {
        name,
        type,
        isDisabled,
        label,
        value,
        placeholder,
        validation,
        onChange,
        size,
        errorMessage,
        successMessage,
        className,
        inputClassName,
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
    const baseInputClassNames = classes([styles.generalInput, inputSizeClassName, inputClassName!]);
    const validationClass = isValid === false && styles.generalInputInvalid;
    return (
        <label className={classes([styles.generalInputContainer, className!])}>
            <span className={styles.generalInputLabel}>{label}</span>
            <BaseInput
                name={name}
                type={type}
                isDisabled={isDisabled}
                className={baseInputClassNames + ' ' + validationClass}
                value={value}
                placeholder={placeholder}
                onChange={onChangeValue}
                isAutoComplete={isAutoComplete}
            />
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

export default GeneralInput;
