import { User, UserTier } from '@/data/user/types';
import { UserTierEnum } from '@/data/user/types';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import api from 'data/api';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { RootStore, useRootStore } from './RootStore';
import { verifyEmail, deleteConfirmEmail, getUserById } from '@/data/user';
import { getBalances } from '@/data/web3/wallet';
import { TokenBalance } from '@/data/web3/wallet/types';
const Web3 = require('web3');

export type AuthStoreHydration = {
    user?: User | null;
    userTier?: UserTierEnum;
    walletAddress: string;
    balances: TokenBalance[];
};

export enum LoginStatus {
    NotStarted = 'NotStarted',
    Pending = 'Pending',
    Success = 'Success'
}
export enum ProcessStatus {
    NotStarted = 'NotStarted',
    Loading = 'Loading',
    Success = 'Success',
    Failed = 'Failed'
}

export class AuthStore {
    root: RootStore;
    user?: User | null = null;
    userTier: UserTierEnum = UserTierEnum.NoTier;
    loginStatus = LoginStatus.NotStarted;
    walletAddress: string = '';
    balances: TokenBalance[] = [];
    loadingBalacesStatus: ProcessStatus = ProcessStatus.NotStarted;
    isWalletConnected: boolean = false;
    isWalletSignedForLogin: boolean = false;
    strictChainId: number = 97;
    currentChainId: number = 0;
    currentNetwork: string = '';
    isChainIdValid: boolean = true;
    chainIdMapping = {
        1: 'eth',
        56: 'bsc',
        97: 'bsctestnet',
        137: 'polygon'
    };

    constructor(root: RootStore) {
        this.root = root;

        makeObservable(this, {
            user: observable,
            userTier: observable,
            loginStatus: observable,
            walletAddress: observable,
            balances: observable,
            loadingBalacesStatus: observable,
            currentChainId: observable,
            currentNetwork: observable,
            isChainIdValid: observable,
            isWalletConnected: observable,
            isWalletSignedForLogin: observable,
            updateChainIdValidityStatus: action,
            updateWalletAddress: action,
            getUserTokenBalances: action,
            signInWithMetaMask: action,
            continueWithMetaMask: action,
            switchMetamaskChainToBscTestnet: action,
            switchMetamaskChainToBscMainnet: action,
            updateNetwork: action,
            detectNetwork: action,
            signInWithWalletConnect: action,
            verifyUserEmail: action,
            signOut: action
        });
    }

    hydrate(data?: AuthStoreHydration) {
        if (data) {
            this.user = data.user;
            this.userTier = data.userTier || UserTierEnum.NoTier;
            // @ts-ignore
            this.loginStatus = data.loginStatus;
            this.walletAddress = data.walletAddress;
        }
    }

    updateWalletAddress = async (newWalletAddress: string) => {
        runInAction(() => {
            this.walletAddress = newWalletAddress;
        });
    };

    updateNetwork = async (chainId: number) => {
        type T = keyof typeof this.chainIdMapping;
        runInAction(() => {
            if (
                Object.keys(this.chainIdMapping)
                    .map((item) => parseInt(item))
                    .includes(chainId)
            ) {
                this.currentChainId = chainId;
                this.currentNetwork = this.chainIdMapping[chainId as T];
            }
        });
    };

    detectNetwork = async () => {
        if (!!window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const chainId = await web3.eth.getChainId();
            type T = keyof typeof this.chainIdMapping;
            runInAction(() => {
                if (
                    Object.keys(this.chainIdMapping)
                        .map((item) => parseInt(item))
                        .includes(chainId)
                ) {
                    this.currentChainId = chainId;
                    this.currentNetwork = this.chainIdMapping[chainId as T];
                }
            });
        } else {
            if (this.currentChainId === 0) {
                const chainId = parseInt(process.env.web3ChainId);
                type T = keyof typeof this.chainIdMapping;
                runInAction(() => {
                    if (
                        Object.keys(this.chainIdMapping)
                            .map((item) => parseInt(item))
                            .includes(chainId)
                    ) {
                        this.currentChainId = chainId;
                        this.currentNetwork = this.chainIdMapping[chainId as T];
                    }
                });
            }
        }
    };

    getUserTokenBalances = async () => {
        runInAction(() => {
            this.loadingBalacesStatus = ProcessStatus.Loading;
        });
        const netwrorkName = this.chainIdMapping[this.currentChainId as keyof typeof this.chainIdMapping];
        const tokenOnNetwroks = {
            bsc: [
                { symbol: 'BNB', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
                { symbol: 'BUSD', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56' },
                { symbol: 'ARZ', address: '0xc10375092343fA84B80D4BdCA94488fe3C52101F' }
            ],
            bsctestnet: [
                { symbol: 'BNB', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
                { symbol: 'BUSD', address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee' },
                { symbol: 'ARZ', address: '0x7f6d4f519bc926d8dd6d7e9b8e9bf5aa2c7ba931' }
            ],
            eth: [
                { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
                { symbol: 'WETH', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
                { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' }
            ],
            polygon: [
                { symbol: 'MATIC', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
                { symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' },
                { symbol: 'USDT', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' }
            ]
        };
        const tokens = tokenOnNetwroks[netwrorkName as keyof typeof tokenOnNetwroks];
        const tokenBalances = await getBalances(tokens, this.walletAddress);
        runInAction(() => {
            this.balances = tokenBalances;
            this.loadingBalacesStatus = ProcessStatus.Success;
        });
    };

    continueWithMetaMask = async () => {
        const { ethereum } = window;

        if (!(ethereum && ethereum.isMetaMask)) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        runInAction(() => {
            this.loginStatus = LoginStatus.Pending;
        });

        const web3 = new Web3(window.ethereum);
        const chainId = await web3.eth.getChainId();
        await this.updateNetwork(chainId);
        const publicAddress = (await web3.eth.requestAccounts())[0];
        const { data: user } = await api.post('auth/register', {
            publicAddress
        });

        runInAction(() => {
            this.user = user;
            this.walletAddress = publicAddress;
        });
        // DO NOT CHANGE THIS STRING
        // ANY CHANGE TO THIS STRING ALSO SHOULD BE APPLIED TO THE BACKEND
        // OR THE AUTHENTICATION WOULD FAIL
        const message = ["Please sign this message so that we can verify it's you :)", user.nonce].join('\n');
        // -------------------------------------------------------------------------
        // @ts-ignore
        const signature = await web3.eth.personal.sign(message, publicAddress);
        let acc = await web3.eth.requestAccounts();
        console.log(acc, signature);

        const {
            data: { accessToken, tier }
        } = await api.post('auth/login', {
            publicAddress,
            signature
        });

        const { data: userData }: any = await getUserById(user.id);

        localStorage.setItem('ACCESS_TOKEN', accessToken);
        runInAction(() => {
            this.user = userData;
            this.userTier = tier;
            this.loginStatus = LoginStatus.Success;
        });

        console.log(this.user);
    };

    updateChainIdValidityStatus = async (newStatus: boolean) => {
        this.getUserTokenBalances();
        runInAction(() => {
            this.isChainIdValid = newStatus;
        });
    };

    signInWithMetaMask = () => {
        if (window.ethereum) {
            this.continueWithMetaMask();
        } else {
            // eslint-disable-next-line no-undef
            window.addEventListener('ethereum#initialized', this.continueWithMetaMask, {
                once: true
            });
            // If the event is not dispatched by the end of the timeout,
            // the user probably doesn't have MetaMask installed.
            // @ts-ignore
            // eslint-disable-next-line no-undef
            setTimeout(continueWithMetaMask, 3000); // 3 seconds
        }
    };

    switchMetamaskChainToBscTestnet = async (): Promise<boolean> => {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(97) }]
            });
        } catch (err: any) {
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'BSC Testnet',
                            chainId: web3.utils.toHex(97),
                            nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
                        }
                    ]
                });
                return true;
            } else if (err.code === 4001) {
                return false;
            }
        }
        return true;
    };

    switchMetamaskChainToBscMainnet = async () => {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(56) }]
            });
        } catch (err: any) {
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Smart Chain',
                            chainId: web3.utils.toHex(56),
                            nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                            rpcUrls: ['https://bsc-dataseed.binance.org/']
                        }
                    ]
                });
            }
        }
    };

    // continueWithWalletConnect = async ({
    //   connector, accounts
    // }) => {
    //   const publicAddress = (accounts)[0];

    //   const { data: user } = await api.post('auth/register', {
    //     publicAddress
    //   });

    //   this.user = user;
    //   // DO NOT CHANGE THIS STRING
    //   // ANY CHANGE TO THIS STRING ALSO SHOULD BE APPLIED TO THE BACKEND
    //   // OR THE AUTHENTICATION WOULD FAIL
    //   const message = [
    //     "Please sign this message so that we can verify it's you :)",
    //     user.nonce
    //   ].join("\n");
    //   // -------------------------------------------------------------------------
    //   /* const signature = await */ connector.signPersonalMessage([
    //     // convertUtf8ToHex(message), // Required
    //     message,
    //     publicAddress, // Required
    //   ])
    //     .then(async (result) => {
    //       // Returns signature.
    //       console.log(result);
    //       debugger;
    //       const { data: { accessToken } } = await api.post('auth/login', {
    //         publicAddress,
    //         signature: result
    //       });

    //       localStorage.setItem("ACCESS_TOKEN", accessToken);
    //       this.loginStatus = LoginStatus.Success;

    //     });
    //   // .catch((error) => {
    //   //   // Error returned when rejected
    //   //   console.error(error);
    //   // });

    //   // const { data: { accessToken } } = await api.post('auth/login', {
    //   //   publicAddress,
    //   //   signature
    //   // });

    //   // localStorage.setItem("ACCESS_TOKEN", accessToken);
    //   // this.loginStatus = LoginStatus.Success;
    // };

    signInWithWalletConnect = async () => {
        runInAction(() => {
            this.loginStatus = LoginStatus.Pending;
        });

        // Create a connector
        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });
        if (connector.connected) {
            await connector.killSession();
        }

        // Check if connection is already established
        if (!connector.connected) {
            // create new session
            await connector.createSession();
            console.log('Session Created', connector);
        }
        // Subscribe to connection events
        connector.on('connect', async (error, payload) => {
            if (error) {
                throw error;
            }
            // Get provided accounts and chainId
            const { accounts, chainId } = payload.params[0];
            await this.updateNetwork(chainId);
            console.log('connected', {
                accounts,
                chainId
            });

            const publicAddress = Web3.utils.toChecksumAddress(accounts[0]);
            const { data: user } = await api.post('auth/register', {
                publicAddress
            });

            runInAction(() => {
                this.user = user;
                this.walletAddress = publicAddress;
                this.isWalletConnected = true;
            });

            // this.signWalletForLogin();
        });

        connector.on('session_update', async (error, payload) => {
            if (error) {
                throw error;
            }

            // Get updated accounts and chainId
            const { accounts, chainId } = payload.params[0];
            await this.updateNetwork(chainId);
            console.log('session_update', {
                accounts,
                chainId
            });
        });

        connector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }

            // Delete connector
            this.signOut();
            console.log('disconnect');
        });
    };

    signWalletForLogin = async () => {
        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });
        // DO NOT CHANGE THIS STRING
        // ANY CHANGE TO THIS STRING ALSO SHOULD BE APPLIED TO THE BACKEND
        // OR THE AUTHENTICATION WOULD FAIL
        const message = ["Please sign this message so that we can verify it's you :)", this.user.nonce].join('\n');
        // -------------------------------------------------------------------------
        const signature = await connector.signPersonalMessage([
            // convertUtf8ToHex(message), // Required
            message,
            this.walletAddress // Required
        ]);
        console.log('signature', signature);
        const {
            data: { accessToken, tier }
        } = await api.post('auth/login', {
            publicAddress: this.walletAddress.toString(),
            signature: String(signature)
        });
        const { data: userData }: any = await getUserById(this.user.id);
        localStorage.setItem('ACCESS_TOKEN', accessToken);
        runInAction(() => {
            this.user = userData;
            this.userTier = tier;
            this.loginStatus = LoginStatus.Success;
            this.isWalletSignedForLogin = true;
        });
    };
    verifyUserEmail = async (emailAddress: string) => {
        const {
            data: { sendRetry, isSuccess, status }
        }: any = await verifyEmail(emailAddress);

        if (isSuccess) {
            runInAction(() => {
                this.user = {
                    ...this.user!,
                    emailVerificationStatus: status,
                    otp: { sentAt: this.user?.otp.sentAt!, sendRetry: Number(sendRetry) }
                };
            });
        }
    };

    signOut = async () => {
        await api.post('auth/logout');
        runInAction(() => {
            this.user = undefined;
            this.loginStatus = LoginStatus.NotStarted;
            this.userTier = UserTierEnum.NoTier;
            this.isWalletConnected = false;
            this.isWalletSignedForLogin = false;
        });

        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });

        if (connector.connected) {
            await connector.killSession();
        }
        console.log('Session Rejected', connector);
    };
}

export const useAuthStore: () => AuthStore = () => {
    const { authStore } = useRootStore();
    return authStore;
};
