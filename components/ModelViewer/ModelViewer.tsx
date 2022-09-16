// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QRModal from '@/components/QRModal';

import ARViewIcon from '@/assets/icons/arViewIcon2.svg';
import ViewIcon from '@/assets/icons/view.svg';
import LikeIcon from '@/assets/icons/like2.svg';

import styles from './ModelViewer.module.css';
import { likeNft, unlikeNft } from '@/data/nft';
import LikeNFT from '../LikeNFT';
import { getDomain } from '@/utils/general';
import useDomain from '@/utils/hooks/useDomain';
interface IProps {
    id: number;
    title: string;
    glbURL: string;
    usdzURL: string;
    allowScaling: boolean;
    solidBackgroundColor: string;
    poster: string;
    openAr?: boolean;
    showQR?: boolean;
    viewCount: number;
    likeCount: number;
    isLikedByUser: boolean;
}

const ModelViewer = (props: IProps) => {
    const {
        id,
        title,
        glbURL,
        usdzURL,
        solidBackgroundColor,
        poster,
        allowScaling,
        openAr,
        showQR,
        viewCount,
        likeCount,
        isLikedByUser
    } = props;

    const [isAppBrowser, setIsAppBrowser] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [arViewAdded, setArViewAdded] = useState(false);
    const [qrModalOpen, setQRModalOpen] = useState(false);
    const domain = useDomain();

    useEffect(() => {
        checkBrowser();
    }, [openAr]);

    const checkBrowser = () => {
        if (
            navigator.userAgent.includes('Instagram') ||
            navigator.userAgent.includes('instagram') ||
            navigator.userAgent.includes('twitter') ||
            navigator.userAgent.includes('Twitter') ||
            navigator.userAgent.includes('linkedin') ||
            navigator.userAgent.includes('Linkedin')
        ) {
            setIsAppBrowser(true);
        }

        if (typeof window !== 'undefined' && window.navigator) {
            const mobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
            setIsMobile(mobile);
        }
    };

    const addARView = async () => {
        if (id) {
            if (!arViewAdded) {
                setArViewAdded(true);
                try {
                    // @ts-ignore
                    // await viewARPost(id);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const copyToClipBoard = (text) => {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData('Text', text);
        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            var textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand('copy'); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    const toggleLike = (event) => {
        event.preventDefault();
        if (!isLikedByUser) {
            unlikeNft(id);
        } else {
            likeNft(id);
        }
    };
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: solidBackgroundColor ? solidBackgroundColor : 'transparent'
            }}
            className={styles.container}
        >
            <model-viewer
                title={title}
                alt={title}
                src={glbURL}
                ios-src={usdzURL}
                ar
                
                ar-modes="webxr scene-viewer quick-look"
                poster={poster}
                seamless-poster
                shadow-intensity="1"
                camera-controls
                enable-pan
                ar-scale={allowScaling ? 'auto' : 'fixed'}
                loading="lazy"
                autoPlay
                environment-image="neutral"
                style={{
                    width: '100%',
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                }}
            >
            <button slot="ar-button" className={styles.myArBtn}>
                {isAppBrowser ? (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <h3 onClick={() => copyToClipBoard(window.location.href)} style={{ marginLeft: '10px' }}>
                            Copy Link
                        </h3>
                    </div>
                ) : (
                    <div
                        onClick={() => addARView()}
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ARViewIcon fill={'#F1F0F4'} />
                        <h3 style={{ marginLeft: '10px' }}>View AR</h3>
                    </div>
                )}
            </button>
            </model-viewer>
            {!isMobile && id && showQR ? (
                <button onClick={() => setQRModalOpen(true)} className={styles.myArBtn}>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ARViewIcon fill={'#F1F0F4'} />
                        <h3
                            style={{
                                marginLeft: '10px',
                                color: '#F1F0F4'
                            }}
                        >
                            View AR
                        </h3>
                    </div>
                </button>
            ) : null}
            <div className="flex absolute bottom-4 right-4">
                <div className="flex rounded w-16 bg-dark-raisin-black text-manatee justify-start items-center p-2 m-2 font-semibold">
                    <ViewIcon />
                    <span className="ml-1 flex-1 text-center">{viewCount}</span>
                </div>
                <LikeNFT nftId={id} isLikedByUser={isLikedByUser} initialLikeCount={likeCount} />
            </div>

            <QRModal
                isOpen={qrModalOpen}
                onRequestClose={() => setQRModalOpen(false)}
                text="Scan to view AR"
                url={`${domain}/model-viewer/${id}`}
            />
        </div>
    );
};

export default ModelViewer;
