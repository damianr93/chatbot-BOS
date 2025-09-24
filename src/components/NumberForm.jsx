import { useState } from 'react';
import PropTypes from 'prop-types';

export default function NumberForm({ onAdd }) {
    const [input, setInput] = useState('');

    const submit = e => {
        e.preventDefault();
        const value = input.trim();
        if (!value) {
            return;
        }
        onAdd(value);
        setInput('');
    };

    return (
        <form onSubmit={submit} className="form-inline">
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Numero (sin 549)"
            />
            <button type="submit">Agregar</button>
        </form>
    );
}

NumberForm.propTypes = {
    onAdd: PropTypes.func.isRequired
};
