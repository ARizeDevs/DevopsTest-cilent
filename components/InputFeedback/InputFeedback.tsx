import React from 'react';
import WrongIcon from '@/assets/icons/wrong.svg';
import SuccessIcon from '@/assets/icons/success.svg';

interface InputFeedbackProps {
    type: 'failed' | 'success';
    children: any;
}
function InputFeedback({ type, children }: InputFeedbackProps) {
    const icon = type === 'failed' ? <WrongIcon /> : <SuccessIcon />;
    console.log(icon);
    const color = type === 'failed' ? 'text-outrageous-orange' : 'text-carribean-green';
    return (
        <div className={`text-smallText pt-1 flex ${color}`}>
            <div className="mr-0.5 flex items-center">{icon}</div>
            {children}
        </div>
    );
}

export default InputFeedback;
