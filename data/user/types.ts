import { Nft, UploadingStatus } from 'data/nft/types';
import { Collection } from 'data/collection/types';

export interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    publicAddress: string;
    nonce: string;
    displayName?: string;
    customUrl?: string;
    bio?: string;
    portfolio?: string;
    email?: string;
    emailVerificationStatus: EmailVerificationStatusEnum;
    otp: { sentAt: string; sendRetry: number };
    avatarUrl?: string;
    avatarUploadStatus?: UploadingStatus;
    collection: Collection[];
    nft: Nft[];
    nftViewCount: number;
}

export type UserTier = 'platinum' | 'diamond' | 'gold' | 'silver' | 'bronze' | 'basic' | 'NO_TIER' | string | undefined;

export enum EmailVerificationStatusEnum {
   NotVerified='NOT_VERIFIED',
   Sent='SENT',
   Expired='EXPIRED',
   Confirmed='CONFIRMED'
}
export enum UserTierEnum {
    Platinum = 'platinum',
    Diamond = 'diamond',
    Gold = 'gold',
    Silver = 'silver',
    Bronze = 'bronze',
    Basic = 'basic',
    NoTier = 'notier'
}
