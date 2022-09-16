import ModelViewer from '@/components/ModelViewer';
import { getNftData } from '@/data/nft';
import { Nft } from '@/data/nft/types';
import { checkAuthentication } from '@/utils/checkAuthentication';
import Head from 'next/head';

const ArModelViewer = ({ nft }: { nft: Nft }) => {
    return (
        <>
            <Head>
                <script type="module" async src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js"></script>
            </Head>
            <div className="flex h-screen w-screen">
                <ModelViewer
                    solidBackgroundColor={'white'}
                    title={nft.name}
                    allowScaling={true}
                    id={nft.id}
                    glbURL={nft.artCloudUrl}
                    usdzURL={nft.usdzCloudUrl}
                    poster={nft.thumbnailCloudUrl}
                    showQR={true}
                    openAr={true}
                    viewCount={nft.viewCount}
                    likeCount={nft.likeCount}
                    isLikedByUser={nft.isLikedNft}
                />
            </div>
        </>
    );
};

export const getServerSideProps = checkAuthentication(async (context: any) => {
    try {
        const nftId = context.params.id;
        const { data } = await getNftData(nftId);

        if (!data.nft) {
            return {
                redirect: {
                    permanent: false,
                    destination: `/404`
                }
            };
        }

        const nft: Nft = {
            ...data.nft,
            likeCount: data.likeCount,
            viewCount: data.viewCount,
            isLikedNft: data.isLikedNft
        };

        return {
            props: { nft: nft }
        };
    } catch (error) {
        console.log(error);
    }
});

export default ArModelViewer;
