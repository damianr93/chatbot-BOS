import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function useSocket() {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));

    socket.on('qr', code => {
      setQrCode(code);
      setStatus('waiting_qr');
    });

    socket.on('ready', () => {
      setStatus('ready');
      setQrCode(null);
    });

    socket.on('authenticated', () => setStatus('authenticated'));

    socket.on('auth_failure', ({ message }) => {
      setStatus('auth_failure');
      setQrCode(null);
      alert(`Autenticacion fallida. ${message || ''}`.trim());
    });

    socket.on('logged_out', ({ reason }) => {
      setStatus('logged_out');
      setQrCode(null);
      alert(`Sesion cerrada. ${reason ? `Motivo: ${reason}` : 'Escanee el QR nuevamente.'}`.trim());
    });

    socket.on('state_change', state => {
      setStatus(`state:${state}`);
    });

    socket.on('connect_error', error => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onLogout = async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/logout`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Solicitud fallida');
      }
    } catch (error) {
      console.error('No se pudo cerrar la sesion:', error);
      alert('Error al cerrar la sesion.');
    }
  };

  return { qrCode, status, onLogout };
}
