import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { formatCurrency, unitFormat } from '@/utils/stringFormat';

interface RevenueProps {
    revenue: number;
    nftCount: number;
    royalty: number;
}

const people = [
    { id: 1, name: '1 Day', unavailable: false },
    { id: 3, name: '3 Days', unavailable: false },
    { id: 7, name: '7 Days', unavailable: false },
    { id: 30, name: '30 Days', unavailable: true }
];

const MyListbox = () => {
    const [selectedPerson, setSelectedPerson] = useState(people[0]);

    return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <Listbox.Button>{selectedPerson.name}</Listbox.Button>
            <Listbox.Options>
                {people.map((person) => (
                    <Listbox.Option
                        key={person.id}
                        value={person}
                        disabled={person.unavailable}
                    >
                        {person.name}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
};

const Revenue = (props: RevenueProps) => {
    const { revenue, nftCount, royalty } = props;
    return (
        <div className="rounded-lg p-3 lg:p-4 bg-dark-raisin-black">
            <div className="flex">
                <p className="text-h4 lg:text-semiBold font-extrabold text-white">
                    Revenue
                </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:items-center lg:justify-start mt-1.5 lg:mt-5">
                <p className="text-h2 font-extrabold text-coral">
                    ${unitFormat(revenue)}
                </p>
                <div className="lg:mt-4">
                    <p className="font-bold text-semiBold text-coral">
                        {formatCurrency(nftCount)}
                        <span className="text-white ml-1">NFTs Sold</span>
                    </p>
                    <p className="mt-2 lg:mt-4 font-bold text-semiBold text-carribean-green">
                        ${unitFormat(royalty)} Royalty earned
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Revenue;
