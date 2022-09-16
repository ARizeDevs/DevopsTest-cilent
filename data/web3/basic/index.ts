import { getProvider, getRawABI } from '../web3service';
import { ethers } from 'ethers';
// import { } from './types';

export const listItem = async (collection: string, tokenId: number): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    let marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.addItemToMarketplace(collection, tokenId);
        // const result = await w3.eth.getTransactionReceipt(tx) // read the tx events
    } catch (e) {
        return false;
    }
};

export const unlistItem = async (marketItemId: number): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    let marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.unlistItemFromMarketplace(marketItemId);
    } catch (e) {
        return false;
    }
};
