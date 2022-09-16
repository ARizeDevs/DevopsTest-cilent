import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classes from '../../utils/classes';
import avatar from 'assets/icons/150.jpeg';
import styles from './topCollections.module.css';
import Verify from 'assets/icons/verify.svg';
import Arrow from 'assets/icons/arrow.svg';

interface TopCollectionsProp {
    collections: Array<any>;
    className?: string;
}

interface CollectionGeneratorProps {
    collections: Array<any>;
}

const CollectionGenerator = (props: CollectionGeneratorProps) => {
    const { collections } = props;
    const collectionList = collections.map((item, index) => {
        return (
            <li key={index} className={styles.collection}>
                <span>{index + 1}</span>
                <div className={styles.avatar}>
                    <Image src={avatar} alt={item.name} />
                    {item.isVerified && (
                        <Verify className={styles.verifiedCollection} />
                    )}
                </div>
                <div className={styles.collectionData}>
                    <p className={styles.collectionName}>{item.name}</p>
                    <p className={styles.collectionValue}>${item.value}</p>
                </div>
            </li>
        );
    });

    return <>{collectionList}</>;
};

const TopCollections = (props: TopCollectionsProp) => {
    const { collections, className } = props;
    const topCollectionsClassName = classes([styles.wrapper, className!]);
    return (
        <section className={topCollectionsClassName}>
            <div className={styles.header}>
                <p className={styles.title}>Top Collections</p>
                <p className={styles.moreCollection}>
                    See all <Arrow />
                </p>
            </div>
            <ul className={styles.collectionsWrapper}>
                <CollectionGenerator collections={collections} />
            </ul>
        </section>
    );
};

export default TopCollections;
