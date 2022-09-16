import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
    () => {
        return import('../../components/StreamRenderer/StreamRenderer');
    },
    {
        ssr: false
    }
);

const DynamicStreamRendering = () => {
    return <DynamicComponentWithNoSSR />;
};

export default DynamicStreamRendering;
