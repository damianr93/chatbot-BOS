import PropTypes from 'prop-types';

export default function SendControls({ loading, onSend, onLogout }) {
    return (
        <div className="controls">
            <button type="button" className="send" onClick={onSend} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensajes'}
            </button>
            <button type="button" className="logout" onClick={onLogout} disabled={loading}>
                Cerrar sesion
            </button>
        </div>
    );
}

SendControls.propTypes = {
    loading: PropTypes.bool.isRequired,
    onSend: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};
