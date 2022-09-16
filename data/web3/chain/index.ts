import { Contract } from 'ethers';
import { Web3Service } from "../web3service";

export const getChainId = async () => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const chainId = await w3.eth.getChainId();
    return chainId;
};

export const getBlockNumber = async () : Promise<number> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const blockNumber = await w3.eth.getBlockNumber();
    return blockNumber;
};

export const getNonce = async (address: string) : Promise<number> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const nonce = await w3.eth.getTransactionCount(address);
    return nonce;
};

export const getGasPrice = async (): Promise<string> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const gasPrice = await w3.eth.getGasPrice();
    return gasPrice;
};

export const estimateGasRaw = async (from: string, nonce: number, to: string, data: string = "") : Promise<number> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const gasEstimation = await w3.eth.estimateGas({ from, nonce, to, data });
    return gasEstimation;
}

export const getContract = async (contractAbi: object, contractAddress: string): Promise<Contract> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const contract = new w3.eth.Contract(contractAbi, contractAddress);
    return contract;
};