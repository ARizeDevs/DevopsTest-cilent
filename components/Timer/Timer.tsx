import React, { useState, useEffect } from 'react';

interface timerProps {
    className?: string;
    deadline: string;
}

const Timer = (props: timerProps) => {
    const { deadline, className } = props;
    const difference = Number(new Date(deadline)) - Number(new Date());
    let hourCalculation = Math.round(difference / (1000 * 60 * 60));
    let minuteCalculation = Math.round(
        hourCalculation * 60 - difference / (1000 * 60)
    );
    let secondCalculation = Math.round(
        minuteCalculation * 60 - difference / 1000
    );

    const [hour, setHour] = useState(hourCalculation);
    const [minute, setMinute] = useState(minuteCalculation);
    const [second, setSecond] = useState(secondCalculation);

    useEffect(() => {
        setTimeout(() => {
            countDown();
        }, 1000);
    });
    const countDown = () => {
        if (second > 0) {
            setSecond(second - 1);
        } else {
            if (minute > 0) {
                setSecond(59);
                setMinute(minute - 1);
            } else {
                if (hour > 0) {
                    setHour(hour - 1);
                    setSecond(59);
                    setMinute(59);
                } else {
                    setHour(0);
                    setSecond(59);
                    setMinute(59);
                }
            }
        }
    };
    return (
        <p className={className}>{`${hour < 10 ? 0 : ''}${hour}:${
            minute < 10 ? 0 : ''
        }${minute}:${second < 10 ? 0 : ''}${second}`}</p>
    );
};

export default Timer;
