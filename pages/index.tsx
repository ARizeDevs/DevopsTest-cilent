import { checkAuthentication } from '@/utils/checkAuthentication';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>ARZ</title>
                <meta name="description" content="ARize nft marketplace platform" />
                <link rel="icon" href="/favicon.ico" />

                <meta name="twitter:card" content="summary" key="twcard" />
                <meta name="twitter:site" content="@Official_ARize" />
                <meta name="twitter:creator" content="ARize" />
                <meta name="twitter:title" content="ARize" />
                <meta name="twitter:description" content="ARize nft marketplace platform" />
                <meta property="og:title" content="ARize"></meta>
                <meta property="og:url" content="https://arize.io/" key="ogurl" />
                {/* og:image change it in the NFT page header and replace nft thumbnail */}
                <meta property="og:image" content="/assets/images/preview.jpg" key="ogimage" />
                <meta property="og:site_name" content="ARize.io" key="ogsitename" />
                <meta property="og:description" content="ARize nft marketplace platform" key="ogdesc" />
            </Head>
        </div>
    );
};

export const getServerSideProps = checkAuthentication((context: any) => {
    return {};
});

export default Home;
