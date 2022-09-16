import Like from 'assets/icons/like.svg';
// import Nft from 'assets/images/nft.jpg';
// import Image from 'next/image';
import classes from '../../../utils/classes';
import styles from './activityCard.module.css';

interface ActivityCardProps {
    className?: string;
    info: {
        from?: string;
        to?: string;
        date: string;
        title: string;
        src?: string;
        link?: string;
        type: string;
    };
}

const ActivityCard = (props: ActivityCardProps) => {
    const { info, className } = props;
    const activityCardClasses = classes([styles.wrapper, className!]);
    return (
        <div className={activityCardClasses}>
            <div className={styles.pictureWrapper}>
                {/* <Image src={Nft} alt="" className={styles.picture} /> */}
                <Like className={styles.typeIcon} />
            </div>
            <div className={styles.info}>
                <p className={styles.title}>{info.title}</p>
                <p className={styles.type}>
                    <span>{info.type}</span>
                </p>
                <p className={styles.date}>{info.date}</p>
            </div>
        </div>
    );
};

export default ActivityCard;
