import { observer } from 'mobx-react';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import BaseInput from '@/components/Inputs/BaseInput/BaseInput';
import IconBolt from '@/assets/icons/bolt-circle.png';
import Image from 'next/image';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import { useEffect, useState } from 'react';

const Sent = () => {
    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { user, verifyUserEmail } = authStore;

    const [inProgress, setInProgress] = useState<boolean>(false);

    const handleResend = async () => {
        setInProgress(true);

        await verifyUserEmail(user?.email!);
        setInProgress(false);
    };
    console.log(user);

    return (
        <div>
            <div className="text-smallText p-2 pb-5 pt-0 flex">
                <div className="!h-10 !w-10 flex justify-center items-center flex-none">
                    <Image src={IconBolt} alt="Arize" className="!h-10 !w-10" />
                </div>
                <div className="ml-2 !w-auto">
                    <span className="text-manatee">{`Verification email sent to ${user?.email}.`}</span>
                    <div className="text-manatee">
                        {user?.otp?.sendRetry! < 3 && (
                            <>
                            <span>Did not receive it yet? </span>
                                <BaseButton
                                    type="text"
                                    text="Resend"
                                    size="small"
                                    isDisabled={inProgress}
                                    className="bg-transparent contents text-white text-smallSemiBold"
                                    onClick={handleResend}
                                />
                                <span> ({user?.otp?.sendRetry}/3)</span>
                            </>
                        )}                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(Sent);
