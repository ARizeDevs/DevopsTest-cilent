import React, { Fragment, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './avatarTier.module.css';
import classes from '@/utils/classes';
import IconUnion from '@/assets/icons/union.svg';
import OwnProfile from '@/components/OwnProfile';
import { Menu, Popover, Transition } from '@headlessui/react';
import { AuthStore, useAuthStore } from 'store/AuthStore';
import { observer } from 'mobx-react-lite';
import { UserTierEnum } from '@/data/user/types';
import DefaultAvatarImage from 'assets/images/defaultProfile.png';

interface IAvatarTier {
    image: string | StaticImageData;
    tier: UserTierEnum;
}
const AvatarTier = () => {
    // @ts-ignore
    const authStore: AuthStore = useAuthStore();
    const { user, userTier } = authStore;

    const tier: UserTierEnum = userTier ?? UserTierEnum.NoTier;

    return (
        <Popover>
            <Popover.Button as="button">
                <div>
                    <div
                        className={classes([
                            styles.ring,
                            styles[`border-${tier.replace(/[^a-z]/gi, '').toLowerCase()}`]
                        ])}
                    >
                        <Image
                            className={classes([styles.photo])}
                            src={user?.avatarUrl && user?.avatarUrl !== '' ? user?.avatarUrl! : DefaultAvatarImage}
                            alt="Arize.io"
                            width="40"
                            height="40"
                            layout="fixed"
                        />
                    </div>
                    <div
                        className={classes([
                            styles.label,
                            styles[`background-${tier.replace(/[^a-z]/gi, '').toLowerCase()}`]
                        ])}
                    >
                        {tier && tier !== UserTierEnum.NoTier && <IconUnion />}
                        <span>{tier.replace(/[^a-z]/gi, ' ')}</span>
                    </div>
                </div>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel className="z-50 absolute right-0 -bottom-2">
                    {({ close }) => <OwnProfile close={close} />}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default observer(AvatarTier);
