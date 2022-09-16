import React from 'react';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import classes from '../../utils/classes';
import styles from './stakingData.module.css';

interface stakingDataProps {
    className?: string;
    hasButton?: boolean;
    buttonText?: string;
    firstRow: {
        value: string;
        description: string;
    };
    secondRow: {
        value: string;
        description: string;
    };
}

const StakingData = (props: stakingDataProps) => {
    const { className, hasButton, buttonText, firstRow, secondRow } = props;
    const stakingDataClass = classes([styles.wrapper, className!]);
    return (
        <div className={stakingDataClass}>
            <div>
                <p className={styles.value}>{firstRow.value}</p>
                <p className={styles.description}>{firstRow.description}</p>
            </div>
            <div className={styles.secondRow}>
                <div>
                    <p className={styles.value}>{secondRow.value}</p>
                    <p className={styles.description}>
                        {secondRow.description}
                    </p>
                </div>
                {hasButton && (
                    <BaseButton
                        className={styles.button}
                        type="text"
                        text={buttonText}
                    />
                )}
            </div>
        </div>
    );
};

export default StakingData;
