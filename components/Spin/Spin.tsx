import React from 'react';
import Image from 'next/image';
import LoaderCoral from '@/assets/images/loaderCoral.png';
interface SpinProps {
    width?: string;
    height?: string;
}

function Spin({ height = '32px', width = '32px' }: SpinProps) {
    return <Image width={width} height={height} layout="fixed" src={LoaderCoral} alt="" className="animate-spin" />;
}

export default Spin;
