import { observer } from 'mobx-react';
import Link from 'next/link';
import { AuthStore, useAuthStore, ProcessStatus } from 'store/AuthStore';
import EmailConfirmation from './EmailConfirmation';
import ListTokenBalance from './ListTokenBalance';
import WalletAddress from './WalletAddress';
import Spin from '@/components/Spin';

interface Props {
    close: () => void;
}
function OwnProfile({ close }: Props) {
    const { user, signOut, walletAddress, balances, loadingBalacesStatus }: AuthStore = useAuthStore();

    return (
        <div className="absolute w-72 rounded-lg right-0 flex flex-col bg-dark-raisin-black z-50">
            {walletAddress && <WalletAddress address={walletAddress} />}
            <EmailConfirmation />
            <div>
                <div className="p-4 pb-0 flex">
                    {loadingBalacesStatus === ProcessStatus.Loading && (
                        <div className="flex items-center w-full">
                            <Spin height="16px" width="16px" />
                            <div className="text-semiBold text-manatee ml-1">Getting tokens balance</div>
                        </div>
                    )}
                    <ListTokenBalance balances={balances} />
                </div>
            </div>
            <div className="p-4 pt-0">
                <div className="flex flex-col justify-items-start">
                    <Link href={`/profile/${user?.id!}`} passHref>
                        <a className="mt-4 flex text-white items-center text-semiBold" onClick={close}>
                            <span>My profile</span>
                        </a>
                    </Link>
                    <Link href={'/profile/edit'} passHref>
                        <a className="mt-4 flex text-white items-center text-semiBold" onClick={close}>
                            <span>Edit profile</span>
                        </a>
                    </Link>
                    <button
                        className="mt-4 flex text-white items-center text-semiBold"
                        onClick={() => {
                            close();
                            signOut();
                        }}
                    >
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default observer(OwnProfile);
