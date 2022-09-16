import NftCard from '@/components/Cards/NftCard/NftCard';
import { Nft } from '@/data/nft/types';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Check from '@/assets/icons/selected.svg';
import Sort from '@/assets/icons/sort.svg';
import styles from '../explore.module.css';

interface cardListProps {
    items: Nft[];
}

const CardList = ({ items }: cardListProps) => {
    const sortOptions = [
        {
            name: 'Recently added',
            sort: (a, b) => new Date(b.nft.createdAt).getTime() - new Date(a.nft.createdAt).getTime()
        },
        {
            name: 'Price: Low to High',
            sort: (a: Nft, b: Nft) => {
                return a.marketplace?.basePrice - b.marketplace?.basePrice;
            }
        },
        {
            name: 'Price: High to Low',
            sort: (a: Nft, b: Nft) => {
                return b.marketplace?.basePrice - a.marketplace?.basePrice;
            }
        },
        {
            name: 'Auction ending soon',
            sort: (a: Nft, b: Nft) =>
                new Date(b.marketplace?.expirationDate || 0).getTime() -
                new Date(a.marketplace?.expirationDate || 0).getTime()
        }
    ];

    const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);

    if (!items?.length) return <></>;

    const cards = items.sort(selectedSortOption.sort).map(({ nft, likeCount, viewCount, marketplace }: any) => {
        return (
            <NftCard
                nft={nft}
                id={nft.id}
                token={nft.tokenStandard}
                key={nft.id}
                name={nft.name}
                description={nft.description}
                likeCount={likeCount}
                viewCount={viewCount}
                nftThumbnail={nft.thumbnailCloudUrl}
                networkId={nft.collection.networkId}
                marketplace={marketplace}
            />
        );
    });
    
    return (
        <>
            <div className="mt-8 flex justify-end">
                <div className="w-max">
                    <Listbox value={selectedSortOption} onChange={setSelectedSortOption}>
                        <div className="relative">
                            <Listbox.Button className="relative flex items-center w-full cursor-default rounded-md bg-dark-raisin-black py-1.5 px-3 text-left focus:outline-none">
                                <Sort />
                                <span className="text-fade-ghost-white text-smallSemiBold font-bold ml-1">
                                    {selectedSortOption.name}
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="z-50 absolute right-0 !mt-2 overflow-auto rounded-lg bg-raisin-black !py-3 focus:outline-none">
                                    {sortOptions.map((item, index) => (
                                        <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                'relative hover:bg-space-cadet text-white font-normal text-semiBold flex items-center cursor-pointer select-none py-2.5 px-4'
                                            }
                                            value={item}
                                        >
                                            <span className="whitespace-nowrap mr-4">{item.name}</span>
                                            {selectedSortOption.name === item.name ? <Check fill="#FF8766" /> : null}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div className={styles.nftListWrapper}>{cards}</div>
        </>
    );
};

export default CardList;
