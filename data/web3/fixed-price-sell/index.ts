import { getProvider, getRawABI } from '../web3service';
import { ethers } from 'ethers';

function toNumberString(num: number) {
    if (Number.isInteger(num)) {
        return num + ".0";
    } else {
        return num.toString();
    }
}

export const priceMeet = async (
    marketItemId: number,
    collection: string,
    tokenId: number,
    amount: number,
    serviceFee: number
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const escrowAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/EscrowNFT.json`);
    const escrowInterface: any = new ethers.utils.Interface(escrowAbi);
    const escrow = new ethers.Contract(process.env.web3EscrowAddress as string, escrowInterface, signer);
    try {
        const amountInEth = ethers.utils.parseEther(toNumberString(amount));
        const options = { value: amountInEth };
        return await escrow.priceMeetForFixedPriceSell(marketItemId, collection, tokenId, amountInEth, serviceFee, options);
    }
    catch (e) {
        return false;
    }
};

export const startSell = async (
    marketItemId: number,
    sellPrice: number,
    startTime: number,
    endTime: number
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.startFixedPriceSell(marketItemId, ethers.utils.parseEther(toNumberString(sellPrice)), startTime, endTime);
    }
    catch (e) {
        return false;
    }
};

export const cancelSell = async (
    marketItemId: number
): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const marketplaceAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/NFTMarketplace.json`);
    const marketplaceInterface: any = new ethers.utils.Interface(marketplaceAbi);
    const marketplace = new ethers.Contract(process.env.web3MarketplaceAddress as string, marketplaceInterface, signer);
    try {
        return await marketplace.cancelFixedPriceSell(marketItemId);
    }
    catch (e) {
        return false;
    }
};