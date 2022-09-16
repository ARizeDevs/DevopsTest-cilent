import React from 'react';
import Image from 'next/image';
import classes from '../../utils/classes';
import styles from './topCreators.module.css';
import avatar from 'assets/icons/150.jpeg';
import Award from 'assets/icons/award.svg';
import ArrowLeft from 'assets/icons/arrowLeft.svg';

interface TopCreatorsProps {
    creators: Array<any>;
    className?: string;
}

interface CreatorsGeneratorProps {
    creators: Array<any>;
}

const CreatorsGenerator = (props: CreatorsGeneratorProps) => {
    const { creators } = props;
    const creatorsList = creators.map((item, index) => {
        return (
            <li key={index} className={styles.creator}>
                <div className={styles.avatar}>
                    <Image src={avatar} alt={item.name} />
                </div>
                <p className={styles.creatorName}>{item.name}</p>
                <p className={styles.creatorValue}>
                    <Award className={styles.awardBage} />${item.value}
                </p>
            </li>
        );
    });

    return <>{creatorsList}</>;
};

const TopCreators = (props: TopCreatorsProps) => {
    const { creators, className } = props;
    const topCreatorsClassName = classes([styles.wrapper, className!]);
    return (
        <section className={topCreatorsClassName}>
            <p className={styles.title}>
                <ArrowLeft className={styles.back} />
                Top Collections
            </p>
            <ul className={styles.creatorsWrapper}>
                <CreatorsGenerator creators={creators} />
            </ul>
        </section>
    );
};

export default TopCreators;
