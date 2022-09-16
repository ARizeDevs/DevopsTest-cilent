import React from 'react';
import classes from '../../utils/classes';
import styles from './banner.module.css';

interface BannerProps {
    message: string;
    type?: string;
    icon: string;
    className?: string;
}

const Banner = (props: BannerProps) => {
    const { message, type } = props;
    const bannerClasses = classes([styles.banner, styles[`${type}Banner`]]);
    const messageClasses = classes([
        styles.message,
        type === 'warning' ? styles.darkMessage : styles.lightMessage
    ]);
    return (
        <div className={bannerClasses}>
            {props.icon && <props.icon />}
            <p className={messageClasses}>{message}</p>
        </div>
    );
};

export default Banner;
