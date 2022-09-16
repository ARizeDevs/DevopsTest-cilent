import DefaultBanner from '@/assets/images/defaultBanner.png';
import IconButton from '@/components/Buttons/IconButton/IconButton';
import { checkAuthentication } from '@/utils/checkAuthentication';
import classes from '@/utils/classes';
import { Tab } from '@headlessui/react';
import Discord from 'assets/icons/discord.svg';
import Instagram from 'assets/icons/instagram.svg';
import Medium from 'assets/icons/medium.svg';
import IconMore from 'assets/icons/more.svg';
import Pencil from 'assets/icons/pencil.svg';
import IconPrice from 'assets/icons/price.svg';
import IconProperties from 'assets/icons/properties.svg';
import IconSales from 'assets/icons/sales.svg';
import { default as IconShare, default as Share } from 'assets/icons/share.svg';
import Telegram from 'assets/icons/telegram.svg';
import Twitter from 'assets/icons/twitter.svg';
import YouTube from 'assets/icons/youtube.svg';
import avatar from 'assets/images/defaultProfile.png';
import api from 'data/api';
import { observer } from 'mobx-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore, LoginStatus } from 'store/AuthStore';
import styles from './collection.module.css';
import CardList from './components/CardList';

const socialItems = [
    { link: 'https://blog.arize.io/', icon: Medium },
    { link: 'https://t.me/arize_ann', icon: Telegram },
    { link: 'https://www.instagram.com/arize.io_official/', icon: Instagram },
    {
        link: 'https://www.youtube.com/channel/UCFJw6U1pGVB_6VTcCH1yFfA',
        icon: YouTube
    },
    { link: 'https://twitter.com/Official_ARize', icon: Twitter },
    { link: 'https://discord.gg/UJkWpgMgTp', icon: Discord }
];


const Collection = (props: any) => {
  const tabs = ["Items", "Activity"];
  // @ts-ignore
  const { id, name, description, ownerId, floorPrice, highestSale, marketCap, totalVolume, avatarUrl, coverUrl } = props.data.profile;
  // @ts-ignore
  const collectionNFTs = props.data.nfts;
  // @ts-ignore
  const isOwnedCollection = props?.hydrationData?.authStore?.user?.sub === ownerId;
  const tabsItem = tabs.map((item) => {
    return (
      <Tab
        className={({ selected }) =>
          classes([
            `${styles.tab}`,
            selected ? `${styles.activeTab}` : `${styles.deactiveTab}`
          ])
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
                <title>{name || 'Collection Profile'}</title>
                <meta name="description" content={description} />
            </Head>
            <div className="relative">
                <div
                    style={{
                        backgroundImage: `url(${coverUrl ? coverUrl : DefaultBanner.src})`
                    }}
                    className={classes(['rounded-2xl', styles.banner])}
                ></div>
                <div className="lg:ml-4 absolute left-4 lg:left-0 -bottom-9 rounded-full border-4 border-darker-raisin-black">
                    <div className="relative h-24 w-24">
                        <Image
                            src={avatarUrl ? avatarUrl : avatar}
                            width="96"
                            height="96"
                            layout="fill"
                            alt={name}
                            className="rounded-full"
                        />
                        {/* <Verify className="absolute h-6 w-6 bottom-0 right-0" /> */}
                    </div>
                </div>
            </div>
            {isOwnedCollection && (
                <div className="mt-4 flex justify-end">
                    <IconButton
                        beforeIcon={true}
                        icon={Share}
                        text=""
                        size="small"
                        externalClass="max-w-fit text-white bg-dark-raisin-black rounded-md mr-2 items-center"
                    />
                    <Link href="#" passHref>
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
            <div className={classes(['mb-6', isOwnedCollection ? 'mt-4' : 'mt-16'])}>
                <p className="text-white text-h4 font-extrabold">{name}</p>
                {/* <div className="mt-2.5 flex !items-center"> */}
                {/* <p className="text-h6 font-bold text-lavender-floral">@coolfluff</p> */}
                {/* <div className="flex">
            <span className="ml-2 mr-4">By</span>
            <span className="flex">
              <Verify className="absolute h-3 w-3 bottom-0 right-0 mr-1" />
              <span className="text-bold">Rolling Balls Lab</span>
            </span>
          </div> */}
                {/* <div className="px-2 py-1 text-manatee bg-dark-raisin-black rounded-md flex">
            <ETH />
            <span className="ml-2">0xbfh6. . .x01k</span>
          </div> */}
                {/* </div> */}
                <div className="font-sm mt-6 p-4 grid grid-cols-3 lg:flex bg-dark-raisin-black rounded-2xl max-w-max">
                    <div className="flex flex-col pr-4 !items-center border-b-2 lg:border-b-0 border-r-2  border-space-cadet">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Highest sale</p>
                        <p className="text-white text-semiBold font-bold">${highestSale}</p>
                    </div>
                    <div className="flex flex-col !items-center px-4 border-b-2 lg:border-b-0 border-r-2  border-space-cadet">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Floor Price</p>
                        <p className="text-white text-semiBold font-bold">${floorPrice}</p>
                    </div>
                    <div className="flex flex-col !items-center px-4 border-b-2 lg:border-b-0 lg:border-r-2  border-space-cadet">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Market Cap</p>
                        <p className="text-white text-semiBold font-bold">${marketCap}</p>
                    </div>
                    <div className="flex flex-col !items-center px-4 border-r-2  border-space-cadet">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Items</p>
                        <p className="text-white text-semiBold font-bold leading-5">{collectionNFTs.length}</p>
                    </div>
                    <div className="flex flex-col !items-center px-4 border-r-2  border-space-cadet">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Owners</p>
                        <p className="text-white text-semiBold font-bold leading-5">1</p>
                    </div>
                    <div className="flex flex-col !items-center pl-4">
                        <p className="text-gray-500 text-smallText leading-5 mb-1">Total Volume</p>
                        <p className="text-white text-semiBold font-bold leading-5">${totalVolume}</p>
                    </div>
                </div>
                <div className="mt-6 lg:w-3/4">
                    <p className="text-manatee font-normal text-semiBold">{description}</p>
                </div>
                {/* <div className="mt-6 max-w-max">
          <Social socialItems={socialItems} />
        </div> */}
                {!isOwnedCollection && (
                    <div className="mt-6 flex justify-start">
                        <IconButton
                            beforeIcon={true}
                            icon={IconShare}
                            text=""
                            size="small"
                            externalClass="max-w-fit bg-dark-raisin-black rounded-md mr-2 items-center"
                        />
                        <IconButton
                            beforeIcon={true}
                            icon={IconMore}
                            text=""
                            size="small"
                            externalClass="max-w-fit bg-dark-raisin-black rounded-md lg:mr-2 items-center"
                        />
                    </div>
                )}
            </div>
            <Tab.Group>
                <Tab.List className="flex border-b-2 border-dark-raisin-black">{tabsItem}</Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="mt-6 flex justify-start">
                            <IconButton
                                beforeIcon={true}
                                icon={IconProperties}
                                text="Properties"
                                size="small"
                                externalClass="max-w-fit text-white bg-dark-raisin-black rounded-md mr-2 items-center font-bold text-bold"
                            />
                            <IconButton
                                beforeIcon={true}
                                icon={IconSales}
                                text="Sale type"
                                size="small"
                                externalClass="max-w-fit font-bold text-white bg-dark-raisin-black rounded-md mr-2 items-center text-bold"
                            />
                            <IconButton
                                beforeIcon={true}
                                icon={IconPrice}
                                text="Price range"
                                size="small"
                                externalClass="max-w-fit font-bold text-white bg-dark-raisin-black rounded-md mr-2 items-center text-bold"
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-6">
                            <CardList items={collectionNFTs} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </main>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    let data;
    const collectionId = context.params.id;
    try {
        const exploreData = await api.get(`/collection/${collectionId}`);
        const collectionsNfts = await api.get(`/nft/collection/${collectionId}`);
        console.log(exploreData.data, 'tttttttt', collectionsNfts.data);
        // data = exploreData.data;
        data = {
            profile: exploreData.data,
            nfts: collectionsNfts.data
        };
    } catch (err) {
        console.log(err, 'error');
    }
    return { props: { data } };
    // return {};
});

export default observer(Collection);
