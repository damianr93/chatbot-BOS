import PropTypes from 'prop-types';

export default function NumberList({ numeros, resumen, onRemove }) {
    if (numeros.length === 0) {
        return <p className="number-list-empty">Sin numeros cargados.</p>;
    }

    return (
        <div className="number-list">
            {resumen ? <h5>{resumen}</h5> : null}
            <ul>
                {numeros.map((num, i) => (
                    <li key={`${num}-${i}`}>
                        <span>{num}</span>
                        <button type="button" onClick={() => onRemove(i)}>Quitar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

NumberList.propTypes = {
    numeros: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    resumen: PropTypes.string,
    onRemove: PropTypes.func.isRequired
};
