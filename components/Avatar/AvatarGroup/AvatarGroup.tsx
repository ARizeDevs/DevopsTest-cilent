import React, { useState } from 'react';
import Image from 'next/image';
import { Tooltip } from "@/components/Tooltip/Tooltip";
import classes from '../../../utils/classes';
import avatar from '../../../assets/images/defaultProfile.png';
import styles from './avatarGroup.module.css';

interface AvatarGroupProps {
    avatars: Array<any>;
    size: string;
    className?: string;
}

interface AvatarGeneratorProps {
    avatars: Array<any>;
    size: string;
}

const AvatarGenerator = (props: AvatarGeneratorProps) => {
    const { avatars, size } = props;
    const moreAvatarsClasses = classes([
        styles.avatar,
        styles.moreAvatars,
        styles[`${size}Avatar`]
    ]);
    const avatarList = avatars.map((item, index) => {
        return (
            <li key={index} className={styles[`${size}Avatar`]}>
                {index > 3 ? (
                    <span className={moreAvatarsClasses}>
                        +{avatars.length - 3}
                    </span>
                ) : (
                    <Tooltip label={item.alt}>
                        <div>
                            <Image
                                src={item.src ? item.src : avatar}
                                height="32"
                                width="32"
                                alt={item.alt}
                                className={styles.avatar}
                            />
                        </div>
                    </Tooltip>
                )}
            </li>
        );
    });

    return <>{avatarList}</>;
};

const AvatarGroup = (props: AvatarGroupProps) => {
    const { avatars, className, size } = props;
    const avatarsClassNames = classes([styles.avatars, className!]);
    return (
        <ul className={avatarsClassNames}>
            <AvatarGenerator avatars={avatars} size={size} />
        </ul>
    );
};

export default AvatarGroup;
