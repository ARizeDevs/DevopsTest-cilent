import IconBsc from '@/assets/icons/networks/bsc-network.svg';


enum NetworkIdEnum {
    BSC_MAINNET = 56,
    BSC_TESTNET = 97,
}

interface NetworkLogoProps {
    id: NetworkIdEnum;
}
const NetworkLogo = ({ id }: NetworkLogoProps) => {
    switch (id) {
        case NetworkIdEnum.BSC_MAINNET:
        case NetworkIdEnum.BSC_TESTNET:
            return <IconBsc />;
        default:
            return <></>;
    }
};

export default NetworkLogo;
