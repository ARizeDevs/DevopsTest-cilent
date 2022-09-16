import { Collection } from "@/data/collection/types";
import { User } from "@/data/user/types";
import { MarketplaceStatus } from "@/data/marketplace/types";

export interface Nft {
    id: number;
    createdAt: Date;
    name: string;
    description: string;
    mintingStatus: MintingStatus;
    mintingType: MintingType;
    mintingMessage: string;
    contractAddress: string;
    tokenId: number;
    creator: User;
    creatorId: number;
    metaData: NftMetaData;
    ipfsPlatform: IpfsPlatforms;
    ipfsGatewayUrl: string;
    ipfsNftUploadStatus: UploadingStatus;
    ipfsMetaDataUploadStatus: UploadingStatus;
    ipfsNftHash: string;
    ipfsMetaDataHash: string;
    cloudStorage: CloudStorages;
    cloudUploadStatus: UploadingStatus;
    artCloudUrl: string;
    usdzCloudUrl:string;
    thumbnailCloudUrl:string;
    isEditable: boolean;
    tokenStandard: TokenStandard;
    localPath: string;
    uploadStatus: UploadingStatus;
    mintingTxHash: string;
    owner: User;
    ownerId: number;
    collection: Collection;
    collectionId: number;
    marketplace: MarketPlace;
    likeCount: number;
    viewCount: number;
    marketItemId: number;
    isLikedNft:boolean;
    serviceFee:number;
    bids:any[], 
  }

  export enum TokenStandardEnum{
    'ERC20'='ETH'
  }
export interface NftMetaData {
    name: string;
    description?: string;
    url: string;    
}

export type IpfsPlatforms = 'PINATA' | 'MORALIS' | 'NFT_Storage' | null;
export type CloudStorages = 'GCP' | null;
export type Status = 'PENDING' | 'COMPLETED' | 'FAILED' | 'NO_ACTION' | 'INITIAL';
export type UploadingStatus = Status;
export type MintingStatus = Status;
export type MintingType = 'NORMAL' | 'LAZY' | 'CENTRALIZED';
export type TokenStandard = 'ERC721' | 'ERC1155';
export type Mainnet = 'BSC';
export type Testnet = 'BSC_TESTNET';
export type Network = Mainnet | Testnet;

export interface MarketPlace {
  id: number;
  createdAt: Date;
  basePrice: number;
  serviceFee: number;
  isActive: boolean;
  sellingType: SellingType;
  status: MarketplaceStatus;
  startDate: Date;
  expirationDate: Date;
  token: string; //Todo: token is not a string
  finalPrice: number;
  nft: Nft;
  nftId: number;
  owner: User;
  ownerId: number;
  marketItemId: number;
}

export enum SellingType { AUCTION = 'AUCTION', FIXED = 'FIXED'}
