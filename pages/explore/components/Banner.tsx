import React from 'react';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import styles from '../explore.module.css';
import classes from '@/utils/classes';
import Link from 'next/link';
interface BannerProps {
    background: string;
}

const Banner = (props: BannerProps) => {
    const { background } = props;
    return (
        <div className={classes(['rounded-2xl bg-no-repeat bg-cover px-4 py-14 lg:px-8', styles.banner])}>
            <p className="text-white text-h3 font-extrabold py-1.5">Mark Mallia</p>
            <p className="text-white text-h3 font-extrabold py-1.5">NFT Collection</p>
            <p className="text-white text-h3 font-extrabold py-1.5">Coming Soon...</p>
            {/* <div className="lg:flex lg:mt-6 mt-4">
                <Link href="/exclusives/mark-mallia">
                    <a className={styles.link}>
                        <BaseButton
                            type="text"
                            size="large"
                            text="Enter the Metaverse"
                            className="lg:mr-2 bg-coral font-bold text-raisin-black max-w-fit"
                        />
                    </a>
                </Link>

                <Link href="/collection/1">
                    <a className={styles.link}>
                        <BaseButton
                            type="text"
                            size="large"
                            text="Learn more"
                            className="bg-white font-bold text-raisin-black max-w-fit mt-4 lg:mt-0"
                        />
                    </a>
                </Link>
            </div> */}
        </div>
    );
};

export default Banner;
