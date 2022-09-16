import IconBUSD from '@/assets/icons/tokens/busd.svg';
import IconArz from '@/assets/icons/tokens/arz.svg';
import IconWETH from '@/assets/icons/tokens/weth.svg';
import IconETH from '@/assets/icons/tokens/eth.svg';
import IconMatic from '@/assets/icons/tokens/matic.svg';
import IconBNB from '@/assets/icons/tokens/bnb.svg';
import IconUsdt from '@/assets/icons/tokens/usdt.svg';

enum TokenNameEnum {
    BSC = 'BSC',
    BNB = 'BNB',
    WBNB = 'WBNB',
    BUSD = 'BUSD',
    ARZ = 'ARZ',
    WETH = 'WETH',
    ETH = 'ETH',
    MATIC = 'MATIC',
    WMATIC = 'WMATIC',
    USDT = 'USDT'
}

interface TokenLogoProps {
    name: string;
}
const TokenLogo = ({ name }: TokenLogoProps) => {
    switch (name) {
        case TokenNameEnum.BNB:
            return <IconBNB />;
        case TokenNameEnum.WBNB:
            return <IconBNB />;
        case TokenNameEnum.BSC:
            return <IconBNB />;
        case TokenNameEnum.BUSD:
            return <IconBUSD />;
        case TokenNameEnum.ARZ:
            return <IconArz />;
        case TokenNameEnum.ETH:
            return <IconETH />;
        case TokenNameEnum.WETH:
            return <IconWETH />;
        case TokenNameEnum.MATIC:
            return <IconMatic />;
        case TokenNameEnum.WMATIC:
            return <IconMatic />;
        case TokenNameEnum.USDT:
            return <IconUsdt />;
        default:
            return <></>;
    }
};

export default TokenLogo;
