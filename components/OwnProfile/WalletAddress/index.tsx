import IconCopy from '@/assets/icons/copy.svg';
import IconSelected from '@/assets/icons/selected.svg';
import { useMemo, useState } from 'react';
import { stringShorter } from '@/utils/stringFormat';

interface WalletAddressProps {
    address: string;
}
const WalletAddress = ({ address }: WalletAddressProps) => {
    const shortAddress = useMemo(() => {
        return stringShorter(address);
    }, [address]);
    const [isCopied, setIsCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
    };

    return (
        <div
            className="m-4 p-2 flex justify-between h-8 rounded bg-space-cadet hover:bg-independence"
            onClick={copyAddress}
        >
            {!isCopied && (
                <>
                    <span className="text-semiBold text-white leading-5 font-bold leading-none">{shortAddress}</span>
                    <IconCopy />
                </>
            )}
            {isCopied && (
                <>
                    <span className="text-semiBold text-white leading-5 font-bold leading-none">Copied!</span>
                    <span className="-m-1">
                        <IconSelected fill="#FFF" />
                    </span>
                </>
            )}
        </div>
    );
};

export default WalletAddress;
