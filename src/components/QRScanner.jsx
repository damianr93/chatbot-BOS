import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';

export default function QRScanner({ qrCode }) {
    return qrCode ? (
        <div className="qr-box">
            <p>Escanea el codigo:</p>
            <QRCode value={qrCode} size={200} />
        </div>
    ) : (
        <p className="waiting">Esperando codigo QR...</p>
    );
}

QRScanner.propTypes = {
    qrCode: PropTypes.string
};
