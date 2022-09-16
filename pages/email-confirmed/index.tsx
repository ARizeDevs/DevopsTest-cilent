import React from 'react';
import Link from 'next/link';
import BaseButton from '@/components/Buttons/BaseButton/BaseButton';
import classes from '@/utils/classes';
import styles from './emailConfirmed.module.css';
import Done from '@/assets/icons/done.svg';

const emailConfirmed = () => {
    return (
        <main className="flex flex-col bg-darker-raisin-black items-center justify-center h-screen">
            <Done className="h-24 w-24" />
            <p className="mt-8 text-center text-white font-extrabold text-h4 w-10/12 lg:w-full">Your email has been verified</p>
            <p className="mt-4 text-center font-normal text-white text-paragraph w-10/12 mg:w-9/12 lg:w-2/6">From now on you’ll never miss a thing on ARize.
                You can close this tab and go back to the previous page.
            </p>
            <div className="flex items-center justify-center mt-6">
                <hr className="w-16"/>
                <p className="font-normal text-white text-paragraph px-4">Or</p>
                <hr className="w-16"/>
            </div>
            <Link href="/explore" passHref>
                <a>
                    <BaseButton
                        size="small"
                        type="text"
                        text="Launch ARize"
                        className="bg-coral text-raisin-black font-bold text-paragraph mt-6"
                    />
                </a>
            </Link>
        </main>
    );
};

export default emailConfirmed;