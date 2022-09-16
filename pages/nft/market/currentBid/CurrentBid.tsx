import React, { useEffect, useState } from 'react';
import FireIcon from '@/assets/icons/fire.svg';
import { getRemainingTime,IRemainingTime } from '@/utils/stringFormat';
import { Nft } from '@/data/nft/types';


function CurrentBid({ nft }: { nft: Nft }) {
    const [remainingTime, setRemainingTime] = useState<IRemainingTime>({ day: 0, hour: 0, minute: 0, second: 0 });

    useEffect(() => {
        calculateTimes();
        setTimeout(() => {
            calculateTimes();
        }, 1000);
    });

    function calculateTimes() {
        const remainingTime = getRemainingTime(nft.marketplace.expirationDate);
        setRemainingTime(remainingTime);
    }

    return (
        <div className="flex justify-between mb-3.5">
            <div>
                <p className="font-semibold text-smallSemiBold text-manatee">Current bid</p>
                <p className="font-bold text-semiBold text-white">0.05 WETH</p>
                <p className="font-semibold text-paragraphAlt mt-0.5 text-manatee">$587.58</p>
            </div>
            <div className="flex items-center gap-x-3 border border-coral rounded-lg px-2.5 py-3.5">
                <FireIcon />
                <div>
                    <p className="font-bold text-semiBold text-white">{remainingTime.day}</p>
                    <p className="font-semibold text-paragraphAlt text-manatee mt-0.5">Days</p>
                </div>
                <div>
                    <p className="font-bold text-semiBold text-white">{remainingTime.hour}</p>
                    <p className="font-semibold text-paragraphAlt text-manatee mt-0.5">Hours</p>
                </div>
                <div>
                    <p className="font-bold text-semiBold text-white">{remainingTime.minute}</p>
                    <p className="font-semibold text-paragraphAlt text-manatee mt-0.5">Minutes</p>
                </div>
                <div>
                    <p className="font-bold text-semiBold text-white">{remainingTime.second}</p>
                    <p className="font-semibold text-paragraphAlt text-manatee mt-0.5">Seconds</p>
                </div>
            </div>
        </div>
    );
}

export default CurrentBid;
