import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Head from 'next/head';
import CardList from './components/CardList';
import { checkAuthentication } from '@/utils/checkAuthentication';
import api from 'data/api';
import Banner from './components/Banner';
import styles from './explore.module.css';

const Explore = (props: any) => {
    const exploreItems = props.data;

    return (
        <main className="px-3.5 py-4 lg:p-8 s:p-8">
            <Head>
                <title>Explore NFT</title>
                <meta name="description" content="ARize nft marketplace platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p className="text-white lg:hidden font-extrabold text-h4 mb-4">Explore</p>
            <Banner background="banner.png" />

            <CardList items={exploreItems} />
        </main>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    interface dataObjectType {
        [key: string]: any;
    }

    let data: dataObjectType = {};
    try {
        const collectionData = await api.get(`/nft/all-nfts/explore`);
        data = collectionData.data || {};
    } catch (err) {
        console.log(err, 'error');
    }
    return { props: { data } };
});

export default Explore;
