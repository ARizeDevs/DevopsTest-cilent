import { getProvider, getRawABI } from '../web3service';
import { ethers } from 'ethers';

export const startTimingAuction = async (
    marketItemId: number,
    startTime: number,
    endTime: number,
    reservePrice: number
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.startTimingAuction(marketItemId, startTime, endTime, reservePrice);
    }
    catch (e) {
        return false;
    }
};

export const addNewBidWithFund = async (
    marketItemId: number,
    bidValue: number
): Promise<any> => {
    function toNumberString(num: number) {
        if (Number.isInteger(num)) {
            return num + ".0";
        } else {
            return num.toString();
        }
    }
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        const amountInEth = ethers.utils.parseEther(toNumberString(bidValue));
        const options = { value: amountInEth };
        return await marketplace.addNewBidForTimingAuctionWithFund(marketItemId, amountInEth, options);
    }
    catch (e) {
        return false;
    }
};

export const acceptBidWithFund = async (
    marketItemId: number,
    serviceFee: number
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.acceptBidForTimingAuctionWithFund(marketItemId, serviceFee);
    }
    catch (e) {
        return false;
    }
};

export const cancelAuctionWithFund = async (
    marketItemId: number,
    withdrawal: boolean
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.cancelTimingAuctionWithFund(marketItemId, withdrawal);
    }
    catch (e) {
        return false;
    }
};

export const cancelAuctionForEth = async (
    marketItemId: number,
    withdrawal: boolean
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.cancelTimingAuctionForETH(marketItemId, withdrawal);
    }
    catch (e) {
        return false;
    }
};