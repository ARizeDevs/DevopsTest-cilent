import React, { useEffect, useState } from 'react';
import { getNftData, likeNft, unlikeNft } from '@/data/nft';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import LikeIcon from '@/assets/icons/like2.svg';
import { observer } from 'mobx-react';

interface LikeNFTProps {
    nftId: number;
    initialLikeCount: number;
    isLikedByUser: boolean;
}
function LikeNFT({ nftId, initialLikeCount, isLikedByUser }: LikeNFTProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [liked, setLike] = useState(isLikedByUser);
    const [pendingLiked, setPendingLiked] = useState(false);

    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { loginStatus } = authStore;
    // @ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const { changeSignInModalState, changeToastNotificationState } = globalStore;

    useEffect(() => {
        if (loginStatus === LoginStatus.Success) {
            reloadLikeData(nftId);
            if (pendingLiked) {
                handleLikeNft();
            }
        }

        if (loginStatus !== LoginStatus.Success) {
            setLike(false);
        }
    }, [loginStatus]);

    const reloadLikeData = async (nftId: number) => {
        const { data } = await getNftData(nftId);
        console.log(data);
        
        setLike(data.isLikedNft);
        setLikeCount(data.likeCount);
    };
    const handleLikeNft = () => {
        if (loginStatus === LoginStatus.NotStarted || loginStatus === LoginStatus.Pending) {
            setPendingLiked(true);
            changeSignInModalState(true);
        } else {
            if (liked) {
                unlikeNft(nftId)
                    .then((res) => {
                        setLike(res.isLikedByUser);
                        setLikeCount(res.likeCount);
                    })
                    .catch((err) => {
                        changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
                    });
            } else {
                likeNft(nftId)
                    .then((res) => {
                        setLike(res.isLikedByUser);
                        setLikeCount(res.likeCount);
                    })
                    .catch((err) => {
                        changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
                    });
            }
        }
    };

    return (
        <div
            className="flex rounded w-16 bg-dark-raisin-black text-manatee justify-start items-center p-2 m-2 font-semibold cursor-pointer"
            onClick={handleLikeNft}
        >
            <LikeIcon fill={liked ? '#FF714D' : '#A6A4BC'} />
            <span className="ml-1 flex-1 text-center">{likeCount}</span>
        </div>
    );
}

export default observer(LikeNFT);
