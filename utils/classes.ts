
const classes = (items: Array<string>) => {
    const finalClassName = items.reduce((prev, current) => {
        return prev + ' ' + current;
    }, '');

    return finalClassName.trim();
};

export default classes;