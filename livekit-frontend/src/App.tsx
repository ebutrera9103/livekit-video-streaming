import React, { useState } from 'react';
import { joinRoom } from './api';
import { OneToOneCall } from './components/OneToOneCall';

const App: React.FC = () => {
  const [roomName, setRoomName] = useState('demo-room');
  const [userName, setUserName] = useState('user-' + Math.floor(Math.random() * 1000));
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await joinRoom({ roomName, userName });
      setToken(res.token);
      setServerUrl(res.serverUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error joining room');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    setToken(null);
    setServerUrl(null);
  };

  if (token && serverUrl) {
    return <OneToOneCall token={token} serverUrl={serverUrl} onDisconnect={handleLeave} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050816',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: '#111827',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          width: '400px',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>One-to-One LiveKit Demo</h1>
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>
          Escribe un nombre de sala y un nombre de usuario. Abre esta página en dos navegadores
          (o dos pestañas) con distintos nombres de usuario para probar el 1:1.
        </p>

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Room name
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{
              width: '100%',
              marginTop: '0.25rem',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151',
              background: '#020617',
              color: '#fff',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          User name
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              width: '100%',
              marginTop: '0.25rem',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151',
              background: '#020617',
              color: '#fff',
            }}
          />
        </label>

        {error && (
          <div
            style={{
              background: '#b91c1c',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: loading ? '#4b5563' : '#22c55e',
            color: '#000',
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Connecting...' : 'Join room'}
        </button>
      </div>
    </div>
  );
};

export default App;
