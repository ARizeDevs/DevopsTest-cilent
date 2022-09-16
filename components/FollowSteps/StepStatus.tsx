import React from 'react';
import LoaderCoral from '@/assets/images/loaderCoral.png';
import LoaderGray from '@/assets/images/loaderGray.png';
import ErrorIcon from '@/assets/icons/proccessError.svg';
import SuccessIcon from '@/assets/icons/proccessDone.svg';
import { EnumStepStatus } from './FollowSteps';
import Image from 'next/image';

 const StepStatus = ({ status }: { status: EnumStepStatus; }) => {
    switch (status) {
        case EnumStepStatus.NotStarted:
            return <Image width="32px" height="32px" layout='fixed' src={LoaderGray} alt=''/>
            case EnumStepStatus.InProgress:
                return <Image width="32px" height="32px" layout='fixed' src={LoaderCoral} alt=''  className="animate-spin"/>
        case EnumStepStatus.Success:
            return <SuccessIcon/>;
        case EnumStepStatus.Fail:
            return <ErrorIcon  style={{width:"50px"}}/>;
        default:
            <></>;
    }
};

export default StepStatus;