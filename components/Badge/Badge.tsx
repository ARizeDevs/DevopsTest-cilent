import React from 'react';
import classes from '../../utils/classes';
import styles from './badge.module.css';

interface BadgeProps {
    type?: string;
    text: string;
    className?: string;
}

const Badge = (props: BadgeProps) => {
    const { type, text, className } = props;
    const badgeClasses = classes([
        styles.badge,
        className!,
        styles[`${type}Badge`]
    ]);
    return <p className={badgeClasses}>{text}</p>;
};

export default Badge;
