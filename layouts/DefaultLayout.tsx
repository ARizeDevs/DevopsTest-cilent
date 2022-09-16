import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Activity from 'assets/icons/bolt.svg';
import Create from 'assets/icons/cube.svg';
import Discord from 'assets/icons/discord.svg';
import Explore from 'assets/icons/explore.svg';
import FaceBook from 'assets/icons/facebook.svg';
import Instagram from 'assets/icons/instagram.svg';
import Linkedin from 'assets/icons/linkedin.svg';
import Staking from 'assets/icons/staking.svg';
import Telegram from 'assets/icons/telegram.svg';
import Twitter from 'assets/icons/twitter.svg';
import YouTube from 'assets/icons/youtube.svg';
import api from 'data/api';
import React, { useEffect, useState,useRef } from 'react';
import SignInModal from './components/SignInModal/SignInModal';
import ToastNotification from './components/ToastNotification/ToastNotification';
import styles from './defaultLayouts.module.css';

type DefaultLayoutProps = {
    children: React.ReactNode;
};

export const ExcludedLayoutPaths = ['/exclusives', '/email-confirmed', '/model-viewer'];

const sampleMenuItems = [
    // { title: 'Dashboard', icon: Dashboard, link: '/' },
    { title: 'Explore', icon: Explore, link: '/explore' },
    { title: 'Staking', icon: Staking, link: 'https://staking.arize.io/', isExternalLink: true },
    { title: 'Create', subTitle: 'Coming Soon', icon: Create, link: '' },
    { title: 'Activity', subTitle: 'Coming Soon', icon: Activity, link: '' }
];

const socialItems = [
    { link: 'https://t.me/arize_ann', icon: Telegram },
    { link: 'https://twitter.com/Official_ARize', icon: Twitter },
    { link: 'https://discord.gg/UJkWpgMgTp', icon: Discord },
    { link: 'https://www.instagram.com/arize.global/', icon: Instagram },
    { link: 'https://www.facebook.com/arizeplatform/', icon: FaceBook },
    { link: 'https://www.linkedin.com/company/officialarize/', icon: Linkedin },
    { link: 'https://www.youtube.com/channel/UCFJw6U1pGVB_6VTcCH1yFfA', icon: YouTube }
];

export default function DefaultLayout({ children }: DefaultLayoutProps) {
    const [randomNft, setRandomNft] = useState();
    const [fetchedRandomNft, setFetchedRandomNft] = useState(false);
    const bodyRef=useRef(null);

    useEffect(() => {
        if (!fetchedRandomNft) {
            api.get(`/nft/random/all/1`).then((res) => {
                setRandomNft(res.data);
                setFetchedRandomNft(true);
            });
        }
    }, []);

    useEffect(() => {
        bodyRef.current.scrollTop = 0;
    }, [children])

    return (
        <main className={styles.container}>
            <Sidebar menuItems={sampleMenuItems} socialItemsList={socialItems} />
            <div className={styles.body} >
                <Navbar menuItems={sampleMenuItems} socialItemsList={socialItems} />
                <main className={styles.childContainer} ref={bodyRef}>{children}</main>
                <ToastNotification />
            </div>
            <SignInModal thumbnail={randomNft} />
        </main>
    );
}
