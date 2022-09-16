import React from 'react';
import Image from 'next/image';
import classes from '../../utils/classes';
import styles from './topCreators.module.css';
import avatar from 'assets/icons/150.jpeg';

interface ExploreCreatorsProps {
    creators: Array<any>;
    className?: string;
}

interface CreatorGeneratorProps {
    creators: Array<any>;
}

const CreatorGenerator = (props: CreatorGeneratorProps) => {
    const { creators } = props;
    const creatorsList = creators.map((item, index) => {
        return (
            <li key={index} className={styles.creator}>
                <div className={styles.avatar}>
                    <Image src={avatar} alt={item.name} />
                </div>
                <p className={styles.creatorName}>{item.name}</p>
                <p className={styles.creatorValue}>${item.value}</p>
            </li>
        );
    });

    return <>{creatorsList}</>;
};

const ExploreCreators = (props: ExploreCreatorsProps) => {
    const { creators, className } = props;
    const topCreatorsClassNames = classes([styles.wrapper, className!]);
    return (
        <section className={topCreatorsClassNames}>
            <p className={styles.title}>Explore Collections</p>
            <ul className={styles.creatorsWrapper}>
                <CreatorGenerator creators={creators} />
            </ul>
        </section>
    );
};

export default ExploreCreators;
