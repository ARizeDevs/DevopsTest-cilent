import React, { useState } from 'react';

export default function useToggle(status = true) {
    const [value, setValue] = useState(status);

    function handelToggle() {
        setValue(!value);
    }

    return [value, handelToggle];
}
