import React from 'react';
import styles from './altTab.module.css';
import classes from '../../../utils/classes';

interface AltTabProps {
    items: Array<string>;
    className?: string;
}

interface TabGeneratorProps {
    items: Array<string>;
}

const TabGenerator = (props: TabGeneratorProps) => {
    const { items } = props;
    const tabItems = items.map((item, index) => (
        <li key={index} className={styles.altTabItem}>
            <label htmlFor={item}>{item}</label>
            <input type="radio" id={item} name="tab" hidden />
        </li>
    ));

    return <>{tabItems}</>;
};

const AltTab = (props: AltTabProps) => {
    const { items, className } = props;
    const altTabWrapperClass = classes([styles.altTab, className!]);
    return (
        <ul className={altTabWrapperClass}>
            <TabGenerator items={items} />
        </ul>
    );
};

export default AltTab;
