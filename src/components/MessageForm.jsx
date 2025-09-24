import PropTypes from 'prop-types';

export default function MessageForm({ mensaje, onChange }) {
    return (
        <div className="form-group">
            <label>Mensaje a enviar:</label>
            <textarea
                value={mensaje}
                onChange={e => onChange(e.target.value)}
                rows={3}
                placeholder="Escribe el mensaje aqui"
            />
        </div>
    );
}

MessageForm.propTypes = {
    mensaje: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
