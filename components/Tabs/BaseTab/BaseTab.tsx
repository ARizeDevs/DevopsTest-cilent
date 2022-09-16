import React from 'react';
import styles from './baseTab.module.css';
import classes from '../../../utils/classes';

interface BaseTabProps {
    items: Array<string>;
    className?: string;
}

interface TabGeneratorProps {
    items: Array<string>;
}

const TabGenerator = (props: TabGeneratorProps) => {
    const { items } = props;
    const tabItems = items.map((item, index) => (
        <li className={styles.baseTabItem} key={index}>
            <label htmlFor={item}>{item}</label>
            <input
                className={styles.radioButton}
                type="radio"
                id={item}
                name="tab"
                hidden
            />
        </li>
    ));

    return <>{tabItems}</>;
};

const BaseTab = (props: BaseTabProps) => {
    const { items, className } = props;
    const baseTabWrapperClass = classes([styles.baseTab, className!]);
    return (
        <ul className={baseTabWrapperClass}>
            <TabGenerator items={items} />
        </ul>
    );
};

export default BaseTab;
