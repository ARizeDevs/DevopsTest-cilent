import IconBinance from '@/assets/icons/binance.svg';
import TokenLogo from '@/components/TokenLogo';
import { TokenBalance } from '@/data/web3/wallet/types';

interface ListTokenBalanceProps {
    balances: TokenBalance[];
}

function ListTokenBalance({balances = []}: ListTokenBalanceProps) {
    return (
        <div className="flex flex-col">
            {balances &&
                balances.map((item: TokenBalance, idx: number) => {
                    return (
                        <div className="mb-4 flex" key={idx}>
                            <div className="h-10 w-10 flex justify-center alight-center">
                                <TokenLogo name={item.symbol} />
                            </div>
                            <div className="ml-2 flex flex-col">
                                <span className="text-paragraphAlt text-rhythm">Balance</span>
                                <span className="text-semiBold font-bold text-white">
                                    {item.balance} {item.symbol}
                                </span>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default ListTokenBalance;
