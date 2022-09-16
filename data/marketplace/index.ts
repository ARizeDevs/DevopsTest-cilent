import api from 'data/api';
import { SellingType } from '../nft/types';

export const addToMarketplace = (
    basePrice: number,
    serviceFee: number,
    sellingType: SellingType,
    nftId: number,
    networkId: number,
    expirationDate: string
) => {
    return api.post(`/marketplace/add`, {
        basePrice: basePrice,
        serviceFee: serviceFee,
        sellingType: sellingType,
        nftId: nftId,
        networkId: networkId,
        expirationDate: expirationDate
    });
};

export const removeFromMarkeplace = (nftId: number, marketId: number) => {
    return api.post('/marketplace/remove', { nftId: nftId, marketId: marketId });
};

export const preListOnMarketplace = (nftId: number, networkChainId: number) => {
    return api.post('/listing/init', {
        nftId: nftId,
        networkChainId: networkChainId
    });
};
export const getUnlistedItemById = (id: number) => {
    return api.get(`listing/retrieve/by/${id}`);
};

export const getListedItemById = (id: number) => {
    return api.get(`listing/retrieve/${id}`);
};

export const preStartSellFixedPrice = (
    basePrice: number,
    nftId: number,
    networkId: number,
    marketItemId: number,
    token: string,
    expirationDate: Date
) => {
    return api.post('/marketplace/pre-starting-fixed-price', {
        basePrice,
        nftId,
        networkId,
        marketItemId,
        token,
        expirationDate: expirationDate.toISOString()
    });
};

export const getMarketplaceItemById = (marketplaceId: number) => {
    return api.get(`/marketplace/${marketplaceId}`);
};

export const preCancelSellFixedPrice = (marketplaceId: number) => {
    return api.post('marketplace/pre-cancel-fixed-price-sell', { marketplaceId: marketplaceId });
};

export const preCancelSellTimedAuction = (marketplaceId: number) => {
    return api.post('marketplace/pre-cancel-timing-auction', { marketplaceId: marketplaceId });
};
export const preBuy = (nftId: number, price: number) => {
    return api.post('/marketplace/pre-create-bid', { nftId: nftId, price: price });
};
export const postBuy = (nftId: number, txHash: string) => {
    return api.post('/marketplace/post-create-bid', { nftId: nftId, txHash: txHash });
};
