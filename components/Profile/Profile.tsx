import React from 'react';
import Image from 'next/image';
import classes from '../../utils/classes';
import avatar from 'assets/icons/150.jpeg';
import Badge from 'assets/icons/profileBadge.svg';
import styles from './profile.module.css';

interface profileProps {
    userName: string;
    bio?: string;
    status?: string;
    className?: string;
}

const Profile = (props: profileProps) => {
    const { className, userName, bio, status } = props;
    const profileClassName = classes([styles.wrapper, className!]);
    return (
        <div className={profileClassName}>
            <div className={styles.avatar}>
                <Image src={avatar} alt={userName} />
                <Badge className={styles.status} />
            </div>
            <div className={styles.profileData}>
                <p className={styles.userName}>{userName}</p>
                <p className={styles.bio}>{bio}</p>
            </div>
        </div>
    );
};

export default Profile;
