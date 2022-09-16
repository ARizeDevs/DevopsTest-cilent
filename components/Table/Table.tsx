import React from 'react';
import Image from 'next/image';
import classes from '../../utils/classes';
import { formatCurrency } from '../../utils/stringFormat';
import styles from './table.module.css';
import Mars from 'assets/icons/mars.jpg';

interface tableProps {
    className?: string;
    rows: Array<any>;
    headers: Array<any>;
}

interface headerProps {
    headers: Array<any>;
}

interface rowProps {
    rows: Array<any>;
}

const HeaderGenerator = (props: headerProps) => {
    const { headers } = props;
    const headersList = headers.map((item, index) => {
        return (
            <th scope="col" key={index}>
                {item.title}
            </th>
        );
    });
    return (
        <thead className={styles.header}>
            <tr>{headersList}</tr>
        </thead>
    );
};

const RowGenerator = (props: rowProps) => {
    const { rows } = props;
    const rowsList = rows.map((item, index) => {
        return (
            <tr key={index} className={styles.rowContainer}>
                <td className={styles.row}>
                    <div className={styles.poolName}>
                        <div className={styles.poolImage}>
                            <Image
                                src={Mars}
                                alt="sample"
                                className={styles.poolImage}
                            />
                        </div>
                        {item.name}
                    </div>
                </td>
                <td className={styles.row}>{item.period}</td>
                <td className={styles.row}>{item.reward}</td>
                <td className={styles.row}>{formatCurrency(item.capacity)}</td>
                <td className={styles.row}>{item.maxStake}</td>
                <td className={styles.row}>{formatCurrency(item.yourStake)}</td>
                <td className={styles.row}>{item.action}</td>
            </tr>
        );
    });
    return <tbody>{rowsList}</tbody>;
};

const Table = (props: tableProps) => {
    const { className, rows, headers } = props;
    const tableClassName = classes([styles.wrapper, className!]);
    return (
        <div className={tableClassName}>
            <table className={styles.table}>
                <HeaderGenerator headers={headers} />
                <RowGenerator rows={rows} />
            </table>
        </div>
    );
};

export default Table;
