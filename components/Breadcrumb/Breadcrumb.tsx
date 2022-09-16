import React from 'react';
import styles from './breadcrumb.module.css';

interface BreadcrumbProps {
    items: Array<any>;
}

interface ItemGenerator {
    items: Array<any>;
}

const BreadcrumbGenerator = (props: ItemGenerator) => {
    const { items } = props;
    const ListItems = items.map((item, index) => {
        const hideItems =
            items.length > 6 && index > 0 && index < items.length - 1;
        const showSeparator =
            (index !== items.length - 1 && !hideItems) ||
            (hideItems && index === 2);
        return (
            <li className={styles.breadcrumbItem} key={index}>
                {item?.beforeIcon && (
                    <item.beforeIcon className={styles.breadcrumbBeforeIcon} />
                )}
                {!hideItems && item.title}
                {hideItems && index === 1 && '...'}
                {item.afterIcon && (
                    <item.afterIcon className={styles.breadcrumbAfterIcon} />
                )}
                {showSeparator && (
                    <span className={styles.breadcrumbSeparator}>/</span>
                )}
            </li>
        );
    });

    return <>{ListItems}</>;
};

const Breadcrumb = (props: BreadcrumbProps) => {
    const { items } = props;
    return (
        <ul className={styles.breadcrumb}>
            <BreadcrumbGenerator items={items} />
        </ul>
    );
};

export default Breadcrumb;
