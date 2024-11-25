import { useState } from 'react';
import './App.css';

function App() {
  const [numero, setNumero] = useState('');
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (numero.trim() !== '') {
      setNumeros([...numeros, numero]); // Añadir número a la lista
      setNumero(''); // Limpiar el input
    }
  };

  // Eliminar número individual
  const handleRemove = (index) => {
    const nuevosNumeros = numeros.filter((_, i) => i !== index);
    setNumeros(nuevosNumeros);
  };

  // Enviar todos los números al backend
  const handleSendAll = async () => {
    if (numeros.length > 0) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/enviar-encuesta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ numeros }), // Enviar los números como un array en formato JSON
        });

        const data = await response.json();
        if (response.ok) {
          alert('Encuesta enviada correctamente');
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error al enviar la encuesta:', error);
        alert('Ocurrió un error al enviar la encuesta');
      } finally {
        setLoading(false);
      }
    } else {
      alert('No hay números para enviar');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Cargar Números de Teléfono</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ingresa el número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Agregar Número</button>
      </form>

      <ul style={styles.list}>
        {numeros.map((num, index) => (
          <li key={index} style={styles.listItem}>
            {num}
            <button onClick={() => handleRemove(index)} style={styles.removeButton}>Eliminar</button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSendAll}
        style={styles.sendAllButton}
        disabled={loading} // Desactivar el botón mientras se envían los datos
      >
        {loading ? 'Enviando...' : 'Enviar Todos los Números'}
      </button>
    </div>
  );
}

// Estilos en línea
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '250px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    fontSize: '18px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '4px',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  sendAllButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  }
};

export default App;
