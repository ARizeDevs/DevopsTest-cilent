import { MintingStatus } from "@/data/nft/types";

export const formatCurrency = (currency: number | string) => {
    return String(currency).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const unitFormat = (currency: number | string) => {
    if (Math.floor(Number(currency) / 1000000) > 0) {
        return `${Number(currency) / 1000000}M`;
    } else if (Math.floor(Number(currency) / 1000) > 0) {
        return `${Number(currency) / 1000}K`;
    } else {
        return Number(currency);
    }
};

export const stringShorter = (string: string, beginingLength: number = 6, endingLength: number = 4) => {
    if (string.length < beginingLength + 3) return string;

    if (string.length < beginingLength + 3 + endingLength) return string.slice(0, beginingLength) + '...';

    return string.slice(0, beginingLength) + '...' + string.slice(-endingLength);
};

export interface IRemainingTime {
    day: number;
    hour: number;
    minute: number;
    second: number;
}
export const getRemainingTime = (deadline: Date): IRemainingTime => {
    const milsecOfDay = 86400000;
    const milsecOfHour = 3600000;
    const milsecOfMinute = 60000;
    const timeleft = Number(new Date(deadline)) - Number(new Date());
    let day = Math.floor(timeleft / milsecOfDay);
    let hour = Math.floor((timeleft % milsecOfDay) / milsecOfHour);
    let minute = Math.floor((timeleft % milsecOfHour) / milsecOfMinute);
    let second = Math.floor((timeleft % milsecOfMinute) / 1000);
    return {
        day: day < 0 ? 0 : day,
        hour: hour < 0 ? 0 : hour,
        minute: minute < 0 ? 0 : minute,
        second: second < 0 ? 0 : second
    };
};

export const replaceSpaceWithUnderline = (status: MintingStatus) => status.split('_').join(' ')
