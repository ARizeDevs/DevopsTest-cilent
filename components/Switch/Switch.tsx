import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import classes from '../../utils/classes';
import styles from './switch.module.css';

interface switchProps {
    className?: string;
    size?: string;
    isChecked?: boolean;
    isDisabled?: boolean;
    changeSwitch?: ChangeEventHandler<HTMLInputElement>;
}

const Switch = (props: switchProps) => {
    const { className, size, isChecked, isDisabled, changeSwitch } = props;
    const [inputStatus, setInputStatus] = useState(isChecked);
    const change = (e: ChangeEvent<HTMLInputElement>) => {
        setInputStatus(!inputStatus);
        if (changeSwitch) changeSwitch(e);
    };
    const switchSize =
        size === 'large' ? styles.largeSwitch : styles.smallSwitch;
    const switchClass = classes([styles.switch, switchSize]);
    const switchContainerSize =
        size === 'large'
            ? styles.largeSwitchContainer
            : styles.smallSwitchContainer;
    const switchContainerClass = classes([
        styles.switchContainer,
        switchContainerSize,
        className!
    ]);

    return (
        <label className={switchContainerClass}>
            <input
                type="checkbox"
                className={styles.switchInput}
                checked={inputStatus}
                hidden
                disabled={isDisabled}
                onChange={change}
            />
            <span className={switchClass}></span>
        </label>
    );
};

export default Switch;
