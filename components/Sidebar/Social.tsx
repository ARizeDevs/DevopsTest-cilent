import React from 'react';
import Link from 'next/link';
import classes from '../../utils/classes';
import styles from './sidebar.module.css';

interface socialProps {
    className?: string;
    socialItems: Array<any>;
    onItemClick?: () => void;
}

const Social = (props: socialProps) => {
    const { className, socialItems } = props;
    const socialClass = classes([styles.social, className!]);
    const socialsList = socialItems.map((item, index) => {
        return (
            <li key={index} onClick={props.onItemClick}>
                <Link href={item.link} passHref>
                    <a>
                        <item.icon />
                    </a>
                </Link>
            </li>
        );
    });

    return <ul className={socialClass}>{socialsList}</ul>;
};

export default Social;
