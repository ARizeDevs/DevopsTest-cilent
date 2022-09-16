import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import classes from '@/utils/classes';
import Image from 'next/image';
import { useState } from 'react';
import styles from './collectionCard.module.css';

interface CollectionCardProps {
    name: string;
    profileImage: any;
    sale: number | string;
    isFollowing: boolean;
    sampleItem: Array<any>;
    className?: string;
}

interface SampleItemGeneratorProps {
    items: Array<any>;
}

const SampleItemGenerator = (props: SampleItemGeneratorProps) => {
    const { items } = props;
    const itemsList = items.map((item, index) => {
        return (
            <Image
                src={item.src}
                alt={item.name}
                width="96px"
                height="80px"
                layout="responsive"
                className={styles.nftImage}
                key={index}
            />
        );
    });
    return <div className={styles.itemsWrapper}>{itemsList}</div>;
};

const CollectionCard = (props: CollectionCardProps) => {
    const { name, profileImage, sale, isFollowing, sampleItem, className } =
        props;
    const [isFollow, setIsFollow] = useState(isFollowing);

    const changeFollowingStatus = () => {
        setIsFollow(!isFollow);
    };

    return (
        <div className={classes([styles.wrapper, className!])}>
            <div className={styles.info}>
                <div className={styles.collectionProfile}>
                    <Image
                        src={profileImage}
                        alt={name}
                        width="56px"
                        height="56px"
                        className={styles.profileImage}
                    />
                    <div className={styles.collectionData}>
                        <p className={styles.name}>{name}</p>
                        <p className={styles.sale}>Sales: ${sale}</p>
                    </div>
                </div>
                {/* <BaseButton
                    type="text"
                    size="small"
                    text={isFollow ? 'Following' : 'Follow'}
                    className={isFollow ? styles.following : styles.follow}
                    onClick={changeFollowingStatus}
                /> */}
            </div>
            <SampleItemGenerator items={sampleItem} />
        </div>
    );
};

export default CollectionCard;
