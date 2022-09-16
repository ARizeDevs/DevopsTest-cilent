import { StreamingControlService } from '@monkeyway/streaming-control-lib/dist/control';
import { StreamingService } from '@monkeyway/streaming-lib/dist/streaming/streaming';
import { StreamInfo } from '@monkeyway/streaming-lib/dist/types/stream-info';
import { useRef, useState } from 'react';
import BaseButton from '../Buttons/BaseButton/BaseButton';
import styles from './streamRenderer.module.css';

const streamingOptions: any = process.env.StreamingOptions;

const StreamRenderer = (props: any) => {
    const streamingControlService = useRef<StreamingControlService>(new StreamingControlService());
    const streamingService = useRef<StreamingService>(new StreamingService(streamingOptions));
    const streamSubscription = useRef<any>();
    const streamInfo = useRef<StreamInfo>();

    const [loadingVisibility, setLoadingVisibility] = useState(false);
    const [sessionButtonEnabled, setSessionButtonEnabled] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [errors] = useState(0);
    const streamElement = useRef<any>();

    const startSession = () => {
        if (streamSubscription.current) {
            return;
        }

        onConnecting();

        const streamInfo$ = streamingService.current.start({});

        streamSubscription.current = streamInfo$.subscribe(
            (info) => {
                if (!info) {
                    // session ended
                    onDisconnected();

                    if (streamSubscription.current) {
                        streamSubscription.current.unsubscribe();
                        streamSubscription.current = null;
                    }
                } else if (!streamInfo.current || streamInfo.current.stream !== info.stream) {
                    // session established
                    const options = streamingControlService.current.createOptions(info);
                    streamingControlService.current.connect(streamElement.current, options).subscribe(
                        (_) => {
                            streamInfo.current = info;
                            onConnected();
                        },
                        async (err) => {
                            console.error(`error connecting to renderer: ${err}`);
                            streamInfo.current = info; // TODO
                            onConnected();
                            await stopSession();
                        }
                    );
                }
            },
            async (error) => {
                // TODO: handle no available session gracefully (will follow with an updated streaming library)
                if (error instanceof Error) {
                    console.error((error as Error).message);
                } else {
                    console.error('connection to stream failed');
                }

                onDisconnected();

                streamSubscription.current = null;
            }
        );
    };

    const stopSession = async () => {
        if (!streamSubscription.current) {
            return;
        }

        await streamingService.current.stop();
    };

    const onConnecting = () => {
        setLoadingVisibility(true);
        setSessionButtonEnabled(false);
    };

    const onConnected = () => {
        streamElement.current.srcObject = streamInfo.current?.stream!;
        streamElement.current.play();

        setShowVideo(true);
        setLoadingVisibility(false);
        setSessionButtonEnabled(true);
    };

    const onDisconnected = () => {
        setShowVideo(false);
        setLoadingVisibility(true);
        setSessionButtonEnabled(true);
        streamingControlService.current.close();

        streamElement.current.pause();
        streamElement.current.srcObject = null;
    };

    return (
        <>
            <div className={styles.centeredContainer}>
                <div className={styles.videoWrapper}>
                    <video ref={streamElement} tabIndex={0} className={styles.video} playsInline></video>
                </div>
                {!showVideo && (
                    <div className={styles.actionOverlay}>
                        <BaseButton
                            type="text"
                            className={styles.startBtn}
                            onClick={() => startSession()}
                            text="Start"
                        ></BaseButton>
                    </div>
                )}
            </div>
        </>
    );
};

export default StreamRenderer;
