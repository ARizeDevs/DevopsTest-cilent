import React from 'react';
// @ts-ignore
import QRCode from 'qrcode.react';
// @ts-ignore
import Modal from 'react-modal';
import styles from './QRModal.module.css';
import BaseButton from '../Buttons/BaseButton/BaseButton';

interface IProps {
    isOpen: boolean;
    onRequestClose: () => void;
    url: string;
    text: string;
}

const QRModal = (props: IProps) => {
    const { isOpen, onRequestClose, text, url } = props;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.qrModal}
            overlayClassName={styles.overlay}
            contentLabel="Example Modal"
        >
            <div className={styles.column}>
                <p className={styles.title}>{text}</p>

                <div className={styles.cointainer}>
                    <QRCode value={url} size={256} bgColor="#353446" fgColor='#fff' />
                </div>

                <BaseButton
                    type="text"
                    text="Cancel"
                    size="small"
                    className={styles.button}
                    onClick={onRequestClose}
                />
            </div>
        </Modal>
    );
};

export default QRModal;
