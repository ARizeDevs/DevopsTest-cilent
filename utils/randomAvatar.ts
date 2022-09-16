import Image01 from '@/assets/images/avatars/1.png';
import Image02 from '@/assets/images/avatars/2.png';
import Image03 from '@/assets/images/avatars/3.png';
import Image04 from '@/assets/images/avatars/4.png';
import Image05 from '@/assets/images/avatars/5.png';
import Image06 from '@/assets/images/avatars/6.png';
import Image07 from '@/assets/images/avatars/7.png';
import Image08 from '@/assets/images/avatars/8.png';
import Image09 from '@/assets/images/avatars/9.png';
import Image10 from '@/assets/images/avatars/10.png';
import Image11 from '@/assets/images/avatars/11.png';
import Image12 from '@/assets/images/avatars/12.png';

export const randomAvatar = () => {
    const randomNumber = Math.floor(Math.random() * (12 - 1 + 1) + 1);
    switch (randomNumber) {
        case 1:
            return Image01;
        case 2:
            return Image02;
        case 3:
            return Image03;
        case 4:
            return Image04;
        case 5:
            return Image05;
        case 6:
            return Image06;
        case 7:
            return Image07;
        case 8:
            return Image08;
        case 9:
            return Image09;
        case 10:
            return Image10;
        case 11:
            return Image11;
        case 12:
            return Image12;
        default:
            return Image01;
    }
};
