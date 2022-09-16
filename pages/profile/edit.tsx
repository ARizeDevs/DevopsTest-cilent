import defaultProfile from '@/assets/images/defaultProfile.png';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import GeneralInput from '@/components/Inputs/GeneralInput/GeneralInput';
import SlottedInput from '@/components/Inputs/SlottedInput/SlottedInput';
import { checkAuthentication } from '@/utils/checkAuthentication';
import classes from '@/utils/classes';
import api from 'data/api';
import jwt from 'jsonwebtoken';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import { GlobalStore, useGlobalStore } from 'store/GlobalStore';
import styles from './profile.module.css';

const EditProfile = ({ user }: any) => {
    const router = useRouter();
    const {
        displayName = '',
        customUrl = '',
        bio = '',
        portfolio = '',
        email = '',
        emailVerificationStatus,
        avatarUrl,
        otp
    } = user;
    const [attachedFile, setAttachedFile] = useState(avatarUrl);
    const [isFormValid, setIsFormValid] = useState(false);
    const [fieldsValidity, setFieldsValidity] = useState({
        displayName: true,
        customUrl: true,
        bio: true,
        portfolio: true,
        email: true,
        avatar: true
    });
    const [formFields, setFormFields] = useState({
        displayName: displayName,
        customUrl: customUrl?.split('arize.io/')[1],
        bio: bio,
        portfolio: portfolio?.split('https://')[1],
        email: email,
        avatar: avatarUrl
    });
    const [sentConfirmationStatus, setSentConfirmationStatus] = useState(
        emailVerificationStatus === 'SENT' || emailVerificationStatus === 'EXPIRED'
    );
    const [confirmedEmail, setConfirmedEmail] = useState(emailVerificationStatus === 'CONFIRMED');
    const [sentVerification, setSentVerification] = useState(sentConfirmationStatus === true);
    const [sendRetry, setSendRetry] = useState(otp?.sendRetry ? otp?.sendRetry : 0);
    const { loginStatus }: AuthStore = useAuthStore();
    const { changeSignInModalState, changeToastNotificationState }: GlobalStore = useGlobalStore();

    useEffect(() => {
        setIsFormValid(!Object.values(fieldsValidity).includes(false));
    }, [fieldsValidity]);

    useEffect(
        () =>
            autorun(() => {
                if (loginStatus !== LoginStatus.Success) {
                    router.replace('/explore');
                }
            }),
        [loginStatus, router]
    );

    const checkFieldValidation = (value: any, field: string, isValid: boolean) => {
        setFieldsValidity((prev) => {
            let prevState = { ...prev };

            prevState[field] = isValid;
            return prevState;
        });

        formFields[field] = value;
    };

    const submitEditProfile = (e: any) => {
        console.log(fieldsValidity);

        e.preventDefault();
        if (loginStatus === LoginStatus.NotStarted || loginStatus === LoginStatus.Pending) {
            changeSignInModalState(true);
            return;
        }
        const profileItems = formFields;
        Object.keys(fieldsValidity).map((item) => {
            if (fieldsValidity[item] === false) {
                delete profileItems[item];
            }
        });
        if (!formFields.avatar || formFields.avatar === avatarUrl) delete formFields.avatar;
        if (formFields.customUrl) profileItems.customUrl = `arize.io/${formFields.customUrl}`;
        if (formFields.portfolio) profileItems.portfolio = `https://${formFields.portfolio}`;
        let data = new FormData();
        Object.keys(profileItems).map((item) => {
            if (profileItems[item]) {
                data.append(item, profileItems[item]);
            }
        });
        api.put('/users/edit-profile', data, {
            headers: {
                'Content-Type': formFields.avatar ? `multipart/form-data` : 'application/json'
            }
        })
            .then((response) => {
                formFields.customUrl = response.data.customUrl?.split('arize.io/')[1];
                formFields.portfolio = response.data.portfolio?.split('https://')[1];
                changeToastNotificationState(true, <p>The profile has been updated successfully</p>, 'Success', 5000);
            })
            .catch((error) => {
                changeToastNotificationState(true, <p>{error.response.data.message}</p>, 'Error', 5000);
            });
    };

    const confirmEmail = (e: any) => {
        e.preventDefault();
        api.post('/auth/email-confirmation', {
            email: formFields.email
        })
            .then((response) => {
                if (response.data.status === 'EXPIRED') {
                    changeToastNotificationState(true, <p>Please try 24 hours later</p>, 'Error', 5000);
                } else {
                    changeToastNotificationState(
                        true,
                        <p>Please check the {formFields.email} inbox</p>,
                        'Success',
                        5000
                    );
                }
                setSendRetry(response.data.sendRetry);
                setSentVerification(true);
            })
            .catch((error) => {
                changeToastNotificationState(true, <p>{error.response.data.message}</p>, 'Error', 5000);
                if (error.response.data.message === 'email is already confirmed') {
                    setSentConfirmationStatus(true);
                    setConfirmedEmail(true);
                    setSentVerification(false);
                }
            });
    };

    const removeEmail = (e: any) => {
        e.preventDefault();
        api.delete('/auth/remove-confirmed-email')
            .then((res) => {
                changeToastNotificationState(
                    true,
                    <p>The {formFields.email} has been removed successfully.</p>,
                    'Success',
                    5000
                );
                setFieldsValidity((prev) => {
                    let prevState = { ...prev };
                    // @ts-ignore
                    prevState.email = false;
                    return prevState;
                });

                setFormFields((prev) => {
                    let prevState = { ...prev };
                    // @ts-ignore
                    prevState.email = '';
                    return prevState;
                });

                setSentConfirmationStatus(false);
                setConfirmedEmail(false);
            })
            .catch((err) => {
                changeToastNotificationState(true, <p>{err.response.data.message}</p>, 'Error', 5000);
            });
    };

    const attachFile = (e: any) => {
        const file = e.target.files[0];
        setAttachedFile(URL.createObjectURL(file));
        checkFieldValidation(file, 'avatar', true);
    };
    // px-3.5 py-4 pb-24 lg:p-8 s:p-8
    return (
        <main className={classes(['py-7 px-8 h-auto'])}>
            <div>
                <p className="font-extrabold text-h4 text-white">Edit Profile</p>
                <form
                    className="mt-8 lg:w-5/6 flex flex-col lg:flex-row-reverse items-center lg:items-start lg:justify-end"
                    onSubmit={submitEditProfile}
                >
                    <div className="flex flex-col lg:max-w-fit w-full items-center lg:items-center lg:flex-row lg:pl-10 mb-6 lg:mb-0">
                        <div
                            style={{
                                backgroundImage: `url(${attachedFile ? attachedFile : defaultProfile.src})`,
                                minWidth: '96px'
                            }}
                            className="rounded-full bg-cover h-24 !w-24 lg:mr-4"
                        ></div>
                        <div className="lg:w-fit w-full flex flex-col items-center lg:items-start">
                            <p className="font-normal w-10/12 lg:w-full xl:w-10/12 2xl:w-8/12 text-center lg:text-left text-semiBold text-manatee mt-4 lg:mt-0">
                                We recommend an image of at least 300x300. Gifs work too. Max 5MB.
                            </p>
                            <label htmlFor="profileImage" className="lg:max-w-fit w-full mt-4 lg:mt-0">
                                <p className="lg:max-w-fit w-full whitespace-nowrap cursor-pointer px-3 py-3 lg:py-1.5 text-center text-fade-ghost-white bg-dark-raisin-black font-semibold text-smallSemiBold mt-4 rounded-md">
                                    Choose file
                                </p>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={attachFile}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="w-full lg:w-8/12">
                        <div>
                            <GeneralInput
                                type="text"
                                label="Display Name"
                                value={formFields.displayName}
                                name="displayName"
                                // validation={/^[a-zA-Z0-9,_-]{2,32}$/i}
                                placeholder="Enter your display name"
                                size="large"
                                className="text-manatee font-semibold text-smallSemiBold"
                                inputClassName="mt-1 bg-dark-raisin-black"
                                errorMessage="Name is invalid"
                                onChange={checkFieldValidation}
                                isAutoComplete="off"
                            />
                        </div>
                        <div className="mt-4">
                            <SlottedInput
                                type="text"
                                value={formFields.customUrl}
                                label="Custom URL"
                                name="customUrl"
                                validation={/^[a-zA-Z0-9,_-]{0,32}$/i}
                                beforeChild={<p>arize.io/</p>}
                                placeholder="Enter your custom URL"
                                size="large"
                                className="bg-dark-raisin-black text-manatee flex items-center font-semibold text-smallSemiBold"
                                inputClassName="ml-1 bg-dark-raisin-black"
                                errorMessage="URL is invalid"
                                onChange={checkFieldValidation}
                                isAutoComplete="off"
                            />
                        </div>
                        <div className="mt-4">
                            <GeneralInput
                                value={formFields.bio}
                                type="text"
                                label="Bio"
                                name="bio"
                                // validation={/^[a-z, 0-9, .'-_]+$/i}
                                placeholder="Tell us about yourself"
                                size="large"
                                className="text-manatee font-semibold text-smallSemiBold"
                                inputClassName="mt-1 bg-dark-raisin-black"
                                errorMessage="Bio is invalid"
                                onChange={checkFieldValidation}
                                isAutoComplete="off"
                            />
                        </div>
                        <div className="mt-4">
                            <SlottedInput
                                type="text"
                                value={formFields.portfolio}
                                label="Personal site or Portfolio"
                                name="portfolio"
                                validation={
                                    /[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
                                }
                                beforeChild={<p>https://</p>}
                                size="large"
                                className="bg-dark-raisin-black text-manatee flex items-center font-semibold text-smallSemiBold"
                                inputClassName="bg-dark-raisin-black ml-1"
                                errorMessage="URL is invalid"
                                onChange={checkFieldValidation}
                                isAutoComplete="off"
                            />
                        </div>
                        <div className="mt-4">
                            <SlottedInput
                                type="text"
                                value={formFields.email}
                                label="Email"
                                name="email"
                                validation={/^[a-z0-9.]+@[a-z]+\.[a-z]{2,3}$/i}
                                placeholder="Enter your email"
                                afterChild={
                                    confirmedEmail ? (
                                        <p className="text-carribean-green disabled:opacity-25 text-smallSemiBold font-bold">
                                            Verified
                                        </p>
                                    ) : (
                                        <button
                                            disabled={!sentVerification && !fieldsValidity.email}
                                            className="text-coral disabled:opacity-25 text-smallSemiBold font-bold"
                                            onClick={confirmEmail}
                                        >
                                            Verify
                                        </button>
                                    )
                                }
                                size="large"
                                className="bg-dark-raisin-black text-manatee flex items-center font-semibold text-smallSemiBold"
                                inputClassName="bg-dark-raisin-black mr-1"
                                errorMessage="The Email is invalid"
                                onChange={checkFieldValidation}
                                isAutoComplete="off"
                            />
                            {sentVerification && (
                                <>
                                    <p className="text-manatee font-normal text-smallSemiBold mt-2">
                                        Verification email sent to {formFields.email || email}
                                    </p>
                                    <p className="text-manatee font-normal text-smallSemiBold">
                                        Did not receive it yet? Check your “Spam” inbox or
                                        <button onClick={confirmEmail} className="font-semibold text-white ml-0.5">
                                            Resend
                                        </button>{' '}
                                        ({sendRetry}/3)
                                    </p>
                                </>
                            )}
                            {confirmedEmail && (
                                <>
                                    <p className="text-manatee font-normal text-smallSemiBold mt-2">
                                        Don’t want to receive email notifications? You can{' '}
                                        <button onClick={removeEmail} className="font-semibold text-white">
                                            remove your email!
                                        </button>
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="mt-4">
                            <BaseButton
                                isDisabled={!isFormValid}
                                type="text"
                                inputType="submit"
                                text="Update Profile"
                                size="large"
                                className="bg-coral text-raisin-black font-bold"
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div></div>
        </main>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    interface dataObjectType {
        [key: string]: any;
    }
    const { req, res } = context;
    const token = req.cookies.authorization;
    const jwtPayload = jwt.decode(token);
    const userId = jwtPayload?.sub;
    let user: dataObjectType = {};
    try {
        const userData = await api.get(`/users/${userId}`);
        user = userData.data || {};
    } catch (err) {
        console.log(err, 'error');
    }
    return { props: { user } };
});

export default observer(EditProfile);
