import React from 'react';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import classes from '../../utils/classes';
import styles from './stakeBanner.module.css';
interface stakeBannerProps {
    className?: string;
}

const StakeBanner = (props: stakeBannerProps) => {
    const { className } = props;
    const stakeClassName = classes([styles.wrapper, className!]);
    return (
        <div className={stakeClassName}>
            <p className={styles.title}>Stake ARZ to earn Tiers</p>
            <a href="https://staking.arize.io/" target="_blank" rel="noreferrer">
                <BaseButton
                    type="text"
                    text="Stake ARZ"
                    className={styles.button}
                />
            </a>
        </div>
    );
};

export default StakeBanner;
