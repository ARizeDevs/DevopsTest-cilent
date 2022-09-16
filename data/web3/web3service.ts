import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import axios from 'axios';
import { ethers } from "ethers";
import { Artifact } from './wallet/types';
const Web3 = require('web3');

export class Web3Service {
    w3Instance: any;
    constructor() {
        let rpcUrls: Array<string>;
        if (process.env.web3Network === 'bsc') {
            rpcUrls = process.env.web3BscMainnetRpcs as any;
        } else if (process.env.web3Network.toLowerCase() === 'bsctestnet') {
            rpcUrls = process.env.web3BscTestnetRpcs as any;
        } else if (process.env.web3Network.toLowerCase() === 'ethereum') {
            rpcUrls = process.env.web3EthMainnetRpcs as any;
        } else if (process.env.web3Network.toLowerCase() === 'rinkeby') {
            rpcUrls = process.env.web3RinkebyRpcs as any;
        } else if (process.env.web3Network.toLowerCase() === 'polygon') {
            rpcUrls = process.env.web3MaticMainnetRpcs as any;
        }
        const promises = rpcUrls.map((rpcUrl: string) => {
            const w3Instance = new Web3(new Web3.providers.HttpProvider(rpcUrl));
            return w3Instance.eth.getBlockNumber().then(() => w3Instance);
        });
        this.w3Instance = Promise.race(promises).then((w3Instance) => w3Instance);
    }

    get w3() {
        return this.w3Instance;
    }
}

export const ReserveAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const getABI = async (abiUrl: string): Promise<Array<Array<object>>> => {
    const response = await axios.get(abiUrl);
    const artifact: Artifact = await response.data;
    const abi = artifact.abi;
    return abi;
};

export const getRawABI = async (abiUrl: string): Promise<string> => {
    const response = await axios.get(abiUrl);
    let rawAbi = await response.data;
    rawAbi = JSON.stringify(rawAbi.abi);
    return rawAbi;
};

export const getRpc = async (chainId: number): Promise<string> => {
    let rpcUrls: string[] = [];
    if (chainId === 56) {
        rpcUrls = process.env.web3BscMainnetRpcs as any;
    } else if (chainId === 97) {
        rpcUrls = process.env.web3BscTestnetRpcs as any;
    } else if (chainId === 137) {
        rpcUrls = process.env.web3MaticMainnetRpcs as any;
    } else if (chainId === 1) {
        rpcUrls = process.env.web3EthMainnetRpcs as any;
    }
    const promises = rpcUrls.map((rpcUrl: string) => {
        const w3Instance = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        return w3Instance.eth.getBlockNumber().then(() => rpcUrl);
    });
    const rpcUrl = Promise.race(promises).then((rpcUrl: string) => rpcUrl);
    return rpcUrl;
};

export const getProvider = async (chainId?: number): Promise<Web3Provider | JsonRpcProvider> => {
    let provider: any = null;
    if (!chainId) {
        if (!!window.ethereum) {
            const web3 = new Web3(window.ethereum);
            chainId = await web3.eth.getChainId();
        }
    }
    if (!!window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
        const rpcUrl = await getRpc(chainId);
        provider = new ethers.providers.JsonRpcProvider({
            url: rpcUrl
        });
    }
    return provider;
}; 