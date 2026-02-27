# LiveKit One-to-One Video Call

A real-time **one-to-one video calling application** with integrated chat, built with React, NestJS, and [LiveKit](https://livekit.io/).

Two users join the same virtual room and can communicate through live video, audio, screen sharing, and text chat — all powered by LiveKit's WebRTC infrastructure.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Usage](#usage)

---

## Features

- **Live Video Calls** — Real-time camera feeds between two participants
- **Audio Communication** — Microphone toggle with speaker output
- **Screen Sharing** — Share your screen with the other participant
- **Real-Time Chat** — Text messaging during the call via LiveKit data channels
- **Room Management** — Automatic room creation with a 2-participant limit
- **Media Controls** — Mute/unmute mic, enable/disable camera, start/stop screen share
- **Dark Theme UI** — Clean, modern interface with dark tones and green accents

---

## Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │  HTTP    │                  │  REST   │                  │
│  React Frontend  │ ──────> │  NestJS Backend  │ ──────> │  LiveKit Cloud   │
│  (Vite + TS)     │         │  (Token Server)  │         │  (Media Server)  │
│                  │         │                  │         │                  │
└────────┬─────────┘         └──────────────────┘         └────────┬─────────┘
         │                                                         │
         │                    WebSocket (WSS)                      │
         └─────────────────────────────────────────────────────────┘
                          WebRTC Media Streams
```

1. The **frontend** asks the **backend** for a token to join a room.
2. The **backend** creates the room on LiveKit Cloud (if it doesn't exist) and returns a signed JWT token.
3. The **frontend** connects directly to **LiveKit Cloud** using the token, establishing a WebRTC session for video/audio/data.

---

## Tech Stack

### Frontend (`livekit-frontend/`)

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Vite 7 | Build tool & dev server |
| `livekit-client` | LiveKit WebRTC client SDK |
| `@livekit/components-react` | Pre-built React components for video calls |
| `@livekit/components-styles` | Default LiveKit component styling |

### Backend (`livekit-backend/`)

| Technology | Purpose |
|---|---|
| NestJS 11 | Server framework |
| TypeScript 5.7 | Type safety |
| `livekit-server-sdk` | Server-side LiveKit SDK (room management + token generation) |
| `@nestjs/config` | Environment variable management |
| Jest 30 | Testing framework |

---

## Project Structure

```
livekit/
├── livekit-frontend/                # React client application
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Login/join screen (room + user name form)
│   │   ├── api.ts                   # HTTP client — calls backend /rooms/join
│   │   └── components/
│   │       └── OneToOneCall.tsx      # Video call UI (video grid, chat panel, controls)
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── livekit-backend/                 # NestJS API server
│   ├── src/
│   │   ├── main.ts                  # App bootstrap (CORS enabled, port config)
│   │   ├── app.module.ts            # Root module (imports ConfigModule + LivekitModule)
│   │   ├── app.controller.ts        # Health check endpoint (GET /)
│   │   └── livekit/
│   │       ├── livekit.module.ts     # LiveKit module definition
│   │       ├── livekit.service.ts    # Core service: room creation + JWT token generation
│   │       └── rooms.controller.ts   # API endpoint: GET /rooms/join
│   ├── .env                         # LiveKit credentials (URL, API key, secret)
│   └── package.json
│
└── README.md                        # This file
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node.js)
- A **LiveKit Cloud** account (free tier available at [livekit.io](https://livekit.io/)) or a self-hosted LiveKit server

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd livekit
```

### 2. Configure the backend

Create or edit `livekit-backend/.env` with your LiveKit credentials:

```env
PORT=3000
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

> You can get these values from the [LiveKit Cloud dashboard](https://cloud.livekit.io/) under your project settings.

### 3. Install dependencies & start the backend

```bash
cd livekit-backend
npm install
npm run start:dev
```

The backend will start on `http://localhost:3000`.

### 4. Install dependencies & start the frontend

```bash
cd livekit-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

### 5. Test it

1. Open `http://localhost:5173` in **Browser Tab 1** — enter a room name and a user name, then click **Join room**.
2. Open `http://localhost:5173` in **Browser Tab 2** — enter the **same room name** but a **different user name**, then click **Join room**.
3. Both tabs will connect to the same room. You should see each other's video, hear audio, and can exchange chat messages.

---

## Configuration

### Backend Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | HTTP server port | `3000` |
| `LIVEKIT_URL` | LiveKit server WebSocket URL | `wss://your-project.livekit.cloud` |
| `LIVEKIT_API_KEY` | API key from LiveKit dashboard | `APIxxxxxxxx` |
| `LIVEKIT_API_SECRET` | API secret from LiveKit dashboard | `your_secret_here` |

### Frontend

The frontend calls the backend at `http://localhost:3000` (hardcoded in `src/api.ts`). If your backend runs on a different host/port, update the fetch URL in that file.

---

## How It Works

### Join Flow

```
User fills form (roomName + userName)
        │
        ▼
Frontend calls GET /rooms/join?roomName=X&userName=Y
        │
        ▼
Backend: LivekitService.ensureOneToOneRoom(roomName)
  └── Creates room on LiveKit Cloud (max 2 participants)
  └── Skips if room already exists
        │
        ▼
Backend: LivekitService.generateToken(roomName, identity)
  └── Creates JWT with VideoGrant permissions
  └── Permissions: join room, publish audio/video, subscribe to tracks
        │
        ▼
Backend returns { token, serverUrl, roomName, identity }
        │
        ▼
Frontend: <LiveKitRoom> connects to LiveKit Cloud via WebSocket
  └── WebRTC media streams established
  └── Video grid renders camera feeds
  └── Chat panel uses LiveKit data channels
```

### Key Components

**`OneToOneCall.tsx`** — The main call interface, composed of:
- `VideoGrid` — Renders camera and screen-share tracks using LiveKit's `GridLayout`
- `ChatPanel` — Real-time text chat using LiveKit's `useChat` hook
- `ControlBar` — Built-in LiveKit control bar (mic, camera, screen share, disconnect)

**`LivekitService`** — Backend service that:
- Manages the `RoomServiceClient` for creating rooms on LiveKit
- Generates signed JWT access tokens with `VideoGrant` permissions
- Converts WSS URLs to HTTPS for REST API communication

---

## API Reference

### `GET /rooms/join`

Joins (or creates) a room and returns a connection token.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `roomName` | string | No | `demo-room` | Name of the room to join |
| `userName` | string | No | `user-{random}` | Display name for the participant |

**Response:**

```json
{
  "token": "eyJhbGciOiJIUz...",
  "serverUrl": "wss://your-project.livekit.cloud",
  "roomName": "demo-room",
  "identity": "userName-1709123456789"
}
```

| Field | Description |
|---|---|
| `token` | Signed JWT for LiveKit connection |
| `serverUrl` | LiveKit WebSocket URL for the client SDK |
| `roomName` | The room that was joined/created |
| `identity` | Unique participant identity (userName + timestamp) |

### `GET /`

Health check endpoint. Returns `"Hello World!"`.

---

## Usage

### During a Call

| Control | Action |
|---|---|
| Microphone button | Mute / unmute your mic |
| Camera button | Enable / disable your camera |
| Screen Share button | Start / stop sharing your screen |
| Chat panel (right side) | Type and send messages in real time |
| Disconnect button | Leave the call and return to the join screen |

### Room Limits

Each room supports a maximum of **2 participants**. If a third user tries to join, LiveKit will reject the connection.
