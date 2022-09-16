export interface ListingItem {
    id: number;
    createdAt: Date;
    status: ListingStatus;
    nftId: number;
    ownerId: number;
    marketItemId: number | null;
}

export enum ListingStatus {
    PRE_LISTING = 'PRE_LISTING',
    LISTED = 'LISTED',
    UNLISTED = 'UNLISTED',
    PENDING = 'PENDING'
}

export enum MarketplaceStatus {
    NOT_LISTED = 'NOT_LISTED',
    INITIAL = 'INITIAL',
    PRE_LISTING = 'PRE_LISTING',
    LISTED = 'LISTED',
    PRE_STARTING = 'PRE_STARTING',
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    ENDED = 'ENDED',
    PRE_CLAIMED = 'PRE_CLAIMED',
    CLAIMED = 'CLAIMED',
    PRE_CANCELED="PRE_CANCELED",
    CANCELED="CANCELED",
    UNLISTED="UNLISTED",
  }

  export enum BidStatus {
    INITIAL = 'INITIAL',
    PENDING = 'PENDING',
    PLACED = 'PLACED',
    ACCEPTED = 'ACCEPTED',
    OUTBID = 'OUTBID',
    CLAIMED = 'CLAIMED',
    PAID_BACK = 'PAID_BACK',
    FAILED = 'FAILED',
  }