import { useMemo, useState } from 'react';
import QRScanner from './components/QRScanner.jsx';
import MessageForm from './components/MessageForm.jsx';
import NumberForm from './components/NumberForm.jsx';
import NumberList from './components/NumberList.jsx';
import SendControls from './components/SendControls.jsx';
import ExcelUploader from './components/ExcelUploader.jsx';
import useSocket from './hooks/useSockets.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const { qrCode, status, onLogout } = useSocket();
  const [mensaje, setMensaje] = useState('');
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(false);

  const addNumbers = nums => {
    setNumeros(prev => {
      const set = new Set(prev);
      nums.map(n => String(n).trim()).filter(Boolean).forEach(n => set.add(n));
      return Array.from(set);
    });
  };

  const resumenCantidad = useMemo(() => {
    return `Total cargados: ${numeros.length}`;
  }, [numeros.length]);

  const sendAll = async () => {
    const trimmedMessage = mensaje.trim();
    if (!trimmedMessage) {
      alert('Escribe un mensaje.');
      return;
    }
    if (numeros.length === 0) {
      alert('Agrega al menos un numero.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/enviar-mensaje`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeros, mensaje: trimmedMessage })
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo enviar el mensaje.');
      }

      const fallidos = Array.isArray(data.fallidos) ? data.fallidos : [];
      if (fallidos.length > 0) {
        const muestra = fallidos.slice(0, 5).map(item => item.original || item.numero).join(', ');
        const extra = fallidos.length > 5 ? '...' : '';
        alert(`Se enviaron ${data.enviados?.length ?? 0} mensajes. Fallaron ${fallidos.length}: ${muestra}${extra}`);
      } else {
        alert('Mensajes enviados correctamente.');
      }

      setMensaje('');
      setNumeros([]);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al enviar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>WhatsApp Disparador</h1>

      <div className="status">Estado: {status}</div>

      <QRScanner qrCode={qrCode} />
      <MessageForm mensaje={mensaje} onChange={setMensaje} />

      <NumberForm onAdd={n => addNumbers([n])} />
      <ExcelUploader onExtract={addNumbers} />

      <NumberList numeros={numeros} resumen={resumenCantidad} onRemove={idx => setNumeros(prev => prev.filter((_, i) => i !== idx))} />

      <SendControls loading={loading} onSend={sendAll} onLogout={onLogout} />
    </div>
  );
}

export default App;
