import { Web3Service, ReserveAddress, getRawABI, getProvider } from '../web3service';
import { Token, TokenBalance } from './types';
import { ethers } from 'ethers';

export const getNonce = async (address: string): Promise<number> => {
    const w3Service = new Web3Service();
    const w3 = await w3Service.w3;
    const nonce = await w3.eth.getTransactionCount(address);
    return nonce;
};

export const getNativeBalance = async (address: string): Promise<number> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    return parseFloat(balanceInEth);
};

export const getERC20Balance = async (tokenAddress: string, address: string): Promise<Number> => {
    const provider = await getProvider(parseInt(process.env.web3ChainId));
    const signer = await provider.getSigner(address);
    const erc20Abi = await getRawABI(`${process.env.apiEndpoint}static/abi/ERC20Token.json`);
    const erc20Interface: any = new ethers.utils.Interface(erc20Abi);
    const erc20 = new ethers.Contract(tokenAddress, erc20Interface, signer);
    let balance = await erc20.balanceOf(address);
    balance = ethers.utils.formatEther(balance);
    return parseFloat(balance);
};

export const getTokenBalances = async (tokens: Token[] = [], address: string): Promise<TokenBalance[]> => {
    const result: TokenBalance[] = [];
    for (const token of tokens) {
        let balance =
            token.address === ReserveAddress
                ? await getNativeBalance(address)
                : await getERC20Balance(token.address, address);
        result.push(
            {
                address: token.address,
                symbol: token.symbol,
                balance: +balance
            });
    }
    return result;
};

export const getBalances = async (tokens: Token[], walletAddress: string): Promise<TokenBalance[]> => {
    return await getTokenBalances(tokens, walletAddress);
};