import { getProvider, getRawABI } from '../web3service';
import { ethers } from 'ethers';

export const isApprovedForAll = async (
    owner: string
): Promise<boolean> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    const arizeNftAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/ARizeNFT.json`);
    const arizeNftInterface: any = new ethers.utils.Interface(arizeNftAbi);
    const arizeNft = new ethers.Contract(process.env.web3ARizeNFTAddress as string, arizeNftInterface, signer);
    const isApprovedForAll = await arizeNft.isApprovedForAll(owner, process.env.web3EscrowAddress as string);
    return isApprovedForAll
};

export const getApprovalForAll = async (): Promise<any> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const arizeNftAbi = await getRawABI(`${process.env.apiEndpoint}static/abi/ARizeNFT.json`);
    const arizeNftInterface: any = new ethers.utils.Interface(arizeNftAbi);
    const arizeNft = new ethers.Contract(process.env.web3ARizeNFTAddress as string, arizeNftInterface, signer);
    try {
        return await arizeNft.setApprovalForAll(process.env.web3EscrowAddress as string, true);
    } catch (e) {
        return false;
    }
};
