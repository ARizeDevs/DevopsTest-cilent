import { observer } from 'mobx-react';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import BaseInput from '@/components/Inputs/BaseInput/BaseInput';
import IconBolt from '@/assets/icons/bolt-circle.png';
import Image from 'next/image';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ErrorMessage } from '@/utils/errorMessages';
import InputFeedback from '@/components/InputFeedback';


const EmailConfirmationSchema = yup.object({
    email: yup.string().email(ErrorMessage.InvalidEmail).required(ErrorMessage.Required)
});

const NotVerified = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ resolver: yupResolver(EmailConfirmationSchema) });

    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { user, verifyUserEmail } = authStore;
    //@ts-ignore
    const globalStore: GlobalStore = useGlobalStore();
    const { changeToastNotificationState } = globalStore;

    useEffect(() => {
        user?.email && reset({ email: user?.email });
    }, []);

    const [inProgress, setInProgress] = useState<boolean>(false);

    const handleSubmitForm = async (formData: FieldValues) => {
        setInProgress(true);

        try {
            await verifyUserEmail(formData.email);
        } catch (err: any) {
            changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
        } finally {
            setInProgress(false);
        }
    };
    return (
        <div>
            <div className="text-smallText p-2 pb-2 pt-0 flex items-center">
                <div className="!h-10 !w-10 flex justify-center items-center flex-none">
                    <Image src={IconBolt} alt="Arize" className="!h-10 !w-10" />
                </div>
                <div className="ml-2 !w-auto">
                    <span className="font-extrabold">Confirm your email</span>
                    <span className="text-manatee"> to get all the important notifications into your inbox</span>
                </div>
            </div>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="m-2 flex flex-col">
                    <div
                        className={`p-1.5 pl-2 h-11 bg-dark-raisin-black rounded-lg flex items-center ${
                            errors.email && 'border border-outrageous-orange'
                        }`}
                    >
                        <input
                            type="text "
                            className="bg-transparent text-white placeholder-rhythm text-semiBold mr-1 flex-1"
                            placeholder="Your email"
                            {...register('email')}
                        />
                        <BaseButton
                            type="text"
                            text="Verify"
                            size="small"
                            isDisabled={inProgress}
                            className="!bg-coral w-16 text-raisin-black text-smallText font-bold flex items-center rounded-md"
                            inputType="submit"
                        />
                    </div>
                    {errors.email && <InputFeedback type="failed">{errors.email.message}</InputFeedback>}
                </div>
            </form>
        </div>
    );
};

export default observer(NotVerified);
