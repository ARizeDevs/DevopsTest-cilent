import React from 'react';
import Image, { StaticImageData } from 'next/image';
import classConcatnation from '../../utils/classes';
import defaultAvatarImage from '@/assets/images/defaultProfile.png';
import Verify from 'assets/icons/verify.svg';
import styles from './profile.module.css';
import Link from 'next/link';
import { randomAvatar } from '@/utils/randomAvatar';

interface profileProps {
    userName: string;
    status?: string;
    className?: string;
    avatar: string;
    linkUrl?: string;
}

const Profile = ({ className, userName, avatar, linkUrl = '#' }: profileProps) => {
    const profileClassName = classConcatnation(['flex items-center w-full', className!]);

    return (
        <Link href={linkUrl}>
            <a>
                <div className={profileClassName}>
                    <div className={styles.avatar}>
                        <Image src={!!avatar ? avatar : randomAvatar()} alt={userName} layout="fill" />
                        <Verify className={styles.status} />
                    </div>
                    <div className="ml-2 flex items-center">
                        <p className="text-semiBold font-semiBold text-white">{userName}</p>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default Profile;
