import React from 'react';
import classes from '../../../utils/classes';
import styles from './baseInput.module.css';

interface BaseInputProps {
    type: string;
    name: string;
    validation?: string;
    className?: string;
    placeholder?: string;
    isDisabled?: boolean;
    onChange?: (e: any) => void;
    value?: any;
    isRequired?: boolean;
    isAutoComplete?: string;
}

const BaseInput = (props: BaseInputProps) => {
    const {
        validation,
        type,
        name,
        placeholder,
        isDisabled,
        className,
        onChange,
        value,
        isRequired,
        isAutoComplete,
    } = props;
    const baseInputClassName = classes([styles.baseInput, className || '']);

    return (
        <input
            className={baseInputClassName}
            type={type}
            placeholder={placeholder}
            pattern={validation}
            disabled={isDisabled}
            defaultValue={value}
            name={name}
            onChange={onChange}
            required={isRequired}
            autoComplete={isAutoComplete}
        />
    );
};

export default BaseInput;
