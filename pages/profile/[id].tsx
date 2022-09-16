import DefaultBanner from '@/assets/images/defaultBanner.png';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import IconButton from '@/components/Buttons/IconButton/IconButton';
import { checkAuthentication } from '@/utils/checkAuthentication';
import classes from '@/utils/classes';
import { Tab } from '@headlessui/react';
import ETH from 'assets/icons/eth.svg';
import Pencil from 'assets/icons/pencil.svg';
import Share from 'assets/icons/share.svg';
import Verify from 'assets/icons/verify.svg';
import DefaultProfile from 'assets/images/defaultProfile.png';
import api from 'data/api';
import { observer } from 'mobx-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore, LoginStatus } from 'store/AuthStore';
import OnSalesNFTs from './OnSalesNFTs';
import OwnedNFTs from './OwnedNFTs';
import styles from './profile.module.css';

const Profile = (props: any) => {
    const searchTabs = ['On Sale', 'Owned', 'Like', 'Activity'];
    const { user, loginStatus } = useAuthStore();

    // @ts-ignore
    const {
        id,
        firstName,
        lastName,
        isActive,
        publicAddress,
        nonce,
        displayName,
        customUrl,
        bio,
        portfolio,
        email,
        isVerifiedEmail,
        avatarUrl,
        avatarUploadStatus
    } = props.data;
    // @ts-ignore
    const isOwnedProfile = loginStatus === LoginStatus.Success && user?.id === id;

    const splitPublicAddress = publicAddress.split('');
    let eclipsesPublicAddress;
    if (splitPublicAddress.length > 13) {
        const rightEclipsesPublicAddress = splitPublicAddress.slice(0, 6).join('');
        const leftEclipsesPublicAddress = splitPublicAddress
            .slice(splitPublicAddress.length - 4, splitPublicAddress.length)
            .join('');
        eclipsesPublicAddress = rightEclipsesPublicAddress + '...' + leftEclipsesPublicAddress;
    } else {
        eclipsesPublicAddress = publicAddress;
    }
    const tabsItem = searchTabs.map((item) => {
        return (
            <Tab
                className={({ selected }) =>
                    classes([`${styles.tab}`, selected ? `${styles.activeTab}` : `${styles.deactiveTab}`])
                }
                key={item}
            >
                {item}
            </Tab>
        );
    });
    
 
    return (
        <main className="px-3.5 lg:px-8 py-4">
            <Head>
                <title>{displayName || 'Profile'}</title>
                <meta name="description" content={bio} />
            </Head>

            <div className="relative">
                <div
                    style={{
                        backgroundImage: `url(${DefaultBanner.src})`
                    }}
                    className={classes(['rounded-2xl', styles.banner])}
                ></div>
                <div className="lg:ml-4 absolute left-4 lg:left-0 -bottom-9 rounded-full border-4 border-darker-raisin-black">
                    <div className="relative h-24 w-24">
                        <Image
                            src={avatarUrl ? avatarUrl : DefaultProfile}
                            alt={displayName}
                            className="rounded-full"
                            layout="fill"
                        />
                        {isVerifiedEmail && <Verify className="absolute bottom-0 right-0" />}
                    </div>
                </div>
            </div>
            {isOwnedProfile && (
                <div className="mt-4 flex justify-end">
                    <IconButton
                        beforeIcon={true}
                        icon={Share}
                        text=""
                        size="small"
                        externalClass="max-w-fit text-white bg-dark-raisin-black rounded-md mr-2 items-center"
                    />
                    <Link href="/profile/edit" passHref>
                        <IconButton
                            beforeIcon={true}
                            icon={Pencil}
                            text="Edit Profile"
                            size="small"
                            externalClass="max-w-fit text-white bg-dark-raisin-black rounded-md items-center"
                        />
                    </Link>
                </div>
            )}
            <div className={classes(['mb-6', isOwnedProfile ? 'mt-4' : 'mt-16'])}>
                <p className="text-white text-h4 font-extrabold">{displayName}</p>
                <div className="mt-2.5 flex !items-center">
                    {/* <p className="text-h6 font-bold text-lavender-floral mr-2">@christianacrypto</p> */}
                    <div className="px-2 py-1 text-manatee bg-dark-raisin-black rounded-md flex">
                        <ETH />
                        <span className="ml-2">{eclipsesPublicAddress}</span>
                    </div>
                </div>
                <div className="mt-4 lg:w-1/2">
                    <p className="text-manatee font-normal text-semiBold">
                        {bio ||
                            (isOwnedProfile && (
                                <Link href={'/profile/edit'}>Add a bio to get the most out of your profile</Link>
                            ))}
                    </p>
                </div>
                {!isOwnedProfile && (
                    <div>
                        {/* <div className="flex gap-x-4 mt-4">
                        <Twitter />
                        <Telegram />
                        <Discord />
                        <Instagram />
                        <Medium />
                        <YouTube />
                        <Reddit />
                    </div> */}
                        <div className="flex mt-6">
                            <IconButton
                                beforeIcon={true}
                                icon={Share}
                                text=""
                                size="small"
                                externalClass="max-w-fit bg-dark-raisin-black rounded-md mr-2 items-center"
                            />
                            <BaseButton
                                className="max-w-fit bg-dark-raisin-black rounded-md"
                                type="text"
                                text="Report"
                                size="small"
                            />
                        </div>
                    </div>
                )}
            </div>
            <Tab.Group >
                <Tab.List className="flex border-b-2 border-dark-raisin-black whitespace-nowrap">{tabsItem}</Tab.List>
                <Tab.Panels className="pt-6">
                    <Tab.Panel>
                        <OnSalesNFTs userId={id} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <OwnedNFTs userId={id} />
                    </Tab.Panel>
                    <Tab.Panel className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {/* <NftCard
                            id={1}
                            token="ERC721"
                            name="The Listed NFT Name Here"
                            description="Minumum Bid 1.5 ETH 1/1"
                            likeCount={0}
                        /> */}
                    </Tab.Panel>
                    <Tab.Panel className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {/* <NftCard
                            id={1}
                            token="ERC721"
                            name="The Listed NFT Name Here"
                            description="Minumum Bid 1.5 ETH 1/1"
                            likeCount={0}
                        /> */}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </main>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    interface dataObjectType {
        [key: string]: any;
    }
    const userId = context.params.id;
    let data: dataObjectType = {};
    try {
        const userData = await api.get(`/users/${userId}`);
        data = userData.data || {};
    } catch (err) {
        console.log(err, 'error');
    }
    return { props: { data } };
});

export default observer(Profile);
