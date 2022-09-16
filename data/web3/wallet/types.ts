export interface Artifact {
    _format: string;
    contractName: string;
    sourceName: string;
    abi: Array<Array<object>>;
    bytecode: string;
    deployedBytecode: string;
    linkReferences: object;
    deployedLinkReferences: object;
}

export interface Token {
    address: string;
    symbol: string;
}

export interface TokenBalance {
    address: string;
    symbol: string;
    balance: number;
}
