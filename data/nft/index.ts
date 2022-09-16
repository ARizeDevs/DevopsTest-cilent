import api from 'data/api';
import { Nft } from './types';

export const getNftData = (id: number) => {
    return api.get(`/nft/${id}`);
};

export const likeNft = async (id: number) => {
    await api.post('/nft/like', { nftId: id });
    return getNftData(id).then((res) => {
        return { likeCount: res.data.likeCount, isLikedByUser: res.data.isLikedNft };
    });
};
export const unlikeNft = async (id: number) => {
    await api.post('/nft/unlike', { nftId: id });
    return getNftData(id).then((res) => {
        return { likeCount: res.data.likeCount, isLikedByUser: res.data.isLikedNft };
    });
};

export const NftDataMapper = (nftData: any): Nft => {
    let nft: Nft = {
        ...nftData.nft,
        likeCount: nftData.likeCount,
        viewCount: nftData.viewCount,
        isLikedNft: nftData.isLikedNft,
        serviceFee: nftData.serviceFee,
        marketplace: nftData.marketplace,
        bids: nftData.bids
    };
    return nft;
};

export const getNftByOwnerId = (userId: number) => {
    return api.get(`/nft/owned/${userId}`);
};
export const getNftOnSaleByOwnerId = (userId: number) => {
    return api.get(`/nft/owned/on-sale/${userId}`);
};