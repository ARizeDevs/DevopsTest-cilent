import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classes from '../../../utils/classes';
import ExternalLink from '@/assets/icons/link.svg';
import styles from './menu.module.css';

interface menuProps {
    items: Array<any>;
    onItemClick?:()=>void;
}

interface menuItemGeneratorProps {
    items: Array<any>;
    onItemClick?:()=>void;
}

const MenuItemGenerator = (props: menuItemGeneratorProps) => {
    const { items ,onItemClick} = props;
    const router = useRouter();
    const menuItemsList = items.map((item, index) => {
        const isActive = router.pathname === item.link;
        const itemClass = classes([
            styles.item,
            isActive ? styles.activeText : '',
            item.link ? 'cursor-pointer' : 'cursor-default'
        ]);
        const iconClass = classes([styles.icon, isActive ? styles.activeIcon : '']);
        return (
            <li key={index} onClick={onItemClick}>
                {item.isExternalLink ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className={itemClass}>
                        <div className={styles.data}>
                            <item.icon className={iconClass} />
                            <span className="font-semibold">{item.title}</span>
                            {item.subTitle && (
                                <span className="font-normal text-smallSemiBold text-manatee ml-1">
                                    {' '}
                                    - {item.subTitle}
                                </span>
                            )}
                            <ExternalLink className="ml-2" />
                        </div>
                    </a>
                ) : (
                    <Link href={item.link} passHref>
                        <a className={itemClass}>
                            {isActive && <span className={styles.activeItem}></span>}
                            <div className={classes([styles.data, isActive ? '!pl-5' : ''])}>
                                <item.icon className={iconClass} />
                                <span className="font-semibold">{item.title}</span>
                                {item.subTitle && (
                                    <span className="font-normal text-smallSemiBold text-manatee ml-1">
                                        {' '}
                                        - {item.subTitle}
                                    </span>
                                )}
                            </div>
                        </a>
                    </Link>
                )}
            </li>
        );
    });

    return <>{menuItemsList}</>;
};

const Menu = (props: menuProps) => {
    return (
        <ul className={styles.wrapper}>
            <MenuItemGenerator {...props}/>
        </ul>
    );
};

export default Menu;
