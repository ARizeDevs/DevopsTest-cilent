import { checkAuthentication } from '@/utils/checkAuthentication';
import classes from '@/utils/classes';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import styles from './search.module.css';

const Search = () => {
    const router = useRouter();
    const { value } = router.query;

    const searchTabs = ['Collections', 'Items', 'Creators'];
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
        <div className="px-8">
            <p className="text-h4 pt-4 pb-8 text-manatee">
                Search results for
                <span className="text-white ml-1">{value}</span>
            </p>
            <Tab.Group>
                <Tab.List className="flex border-b-2 border-dark-raisin-black">{tabsItem}</Tab.List>
                <Tab.Panels className="pt-6 h-full">
                    <Tab.Panel className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8">
                        {/* <CollectionCard
                            name="Cool Fluffy Guy"
                            sale="5580000"
                            isFollowing={false}
                            profileImage={Profile}
                            sampleItem={[
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                }
                            ]}
                        />
                        <CollectionCard
                            name="Cool Fluffy Guy"
                            sale="5580000"
                            isFollowing={false}
                            profileImage={Profile}
                            sampleItem={[
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                }
                            ]}
                        /> */}
                    </Tab.Panel>
                    <Tab.Panel className="lg:grid lg:grid-cols-3 flex flex-col gap-8">
                        {/* <NftCard
                            id={1}
                            token="ERC721"
                            deadline="2022-02-26T14:34:25Z"
                            name="The Listed NFT Name Here"
                            description="Minumum Bid 1.5 ETH 1/1"
                            likeCount={230}
                        />
                        <NftCard
                            id={1}
                            token="ERC721"
                            deadline="2022-02-26T14:34:25Z"
                            name="The Listed NFT Name Here"
                            description="Minumum Bid 1.5 ETH 1/1"
                            likeCount={230}
                        /> */}
                    </Tab.Panel>
                    <Tab.Panel className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8">
                        {/* <CollectionCard
                            name="Cool Fluffy Guy"
                            sale="5580000"
                            isFollowing={false}
                            profileImage={Profile}
                            sampleItem={[
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                }
                            ]}
                        />
                        <CollectionCard
                            name="Cool Fluffy Guy"
                            sale="5580000"
                            isFollowing={false}
                            profileImage={Profile}
                            sampleItem={[
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                },
                                {
                                    name: 'test',
                                    src: SampleNft
                                }
                            ]}
                        /> */}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export const getServerSideProps = checkAuthentication((context:any) => {
    return {};
});

export default Search;
