// src/components/OneToOneCall.tsx
import React from 'react';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useChat,
  ChatEntry,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

interface Props {
  token: string;
  serverUrl: string;
  onDisconnect?: () => void;
}

function VideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: true },
  ]);

  return (
    <GridLayout
      tracks={tracks}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#020617',
      }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

function ChatPanel() {
  const { chatMessages, send } = useChat();
  const [text, setText] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  };

  return (
    <div
      style={{
        width: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #111827',
        background: '#020617',
      }}
    >
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #111827',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        Chat
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
        }}
      >
        {chatMessages.map((m: ChatEntry) => (
          <div key={m.id} style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, color: '#22c55e' }}>{m.from?.name ?? m.from?.identity}</div>
            <div style={{ color: '#e5e7eb' }}>{m.message}</div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        style={{
          padding: '0.75rem 0.75rem 0.75rem 0.75rem',
          borderTop: '1px solid #111827',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: '#020617',
            color: '#e5e7eb',
            fontSize: '0.85rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 0.9rem',
            borderRadius: '999px',
            border: 'none',
            background: '#22c55e',
            color: '#020617',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export const OneToOneCall: React.FC<Props> = ({ token, serverUrl, onDisconnect }) => {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      video
      audio
      onDisconnected={onDisconnect}
      style={{
        height: '100vh',
        width: '100vw',
        background: '#050816',
        color: '#e5e7eb',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <RoomAudioRenderer />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '1rem',
          boxSizing: 'border-box',
          gap: '0.75rem',
        }}
      >
        {/* zona superior: video + chat */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: '0.75rem',
            minHeight: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <VideoGrid />
          </div>
          <ChatPanel />
        </div>

        {/* control bar */}
        <div
          style={{
            borderRadius: '999px',
            background: '#020617',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            paddingInline: '1.5rem',
          }}
        >
          <ControlBar />
        </div>
      </div>
    </LiveKitRoom>
  );
};
