import { User } from "@/data/user/types";
import {  Nft } from "@/data/nft/types";

export interface Collection {
  id: number;
  tokenId: number;
  name: string;
  description?: string;
  address: string;
  thumbnail:string;
  urlPath?: string;
  isActive?: boolean;
  network: Network;
  networkId: number;
  owner: User;
  ownerId: number;
  contractAddress: string;
  nft: Nft[];
}

export interface Network {
  chain: number;
  name: string;
  nativeToken: string;
  logoUrl: string;
  isActive: boolean;
}