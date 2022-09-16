import React, { ChangeEventHandler } from 'react';
import classes from '../../../utils/classes';
import styles from './slider.module.css';

interface SliderProps {
    max: number;
    min: number;
    step: number;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    value?: number;
    dataList?: Array<any>;
    className?: string;
}

interface DataListProps {
    dataList: Array<any>;
}

const DataListGenerator = (props: DataListProps) => {
    const { dataList } = props;
    const listOfData = dataList.map((item, index) => {
        return (
            <option value={item.value} label={item.label} key={index}></option>
        );
    });

    return <>{listOfData}</>;
};

const Slider = (props: SliderProps) => {
    const { max, min, step, onChange, value, dataList, name, className } =
        props;
    const sliderClassName = classes([styles.Slider, className!]);
    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                step={step}
                onChange={onChange}
                className={sliderClassName}
                list={name}
            />
            {dataList && (
                <datalist id={name}>
                    <DataListGenerator dataList={dataList} />
                </datalist>
            )}
        </>
    );
};

export default Slider;
