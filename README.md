# ⚡ DropBeam — P2P Browser File Sharing App

DropBeam is a high-performance, zero-server peer-to-peer file sharing application. Files transfer **directly between two browser sessions** via WebRTC DataChannels. The Node.js backend serves strictly as a lightweight signaling server to exchange connection metadata (SDP offers/answers & ICE candidates). **Zero bytes of file data are ever sent to, processed by, or stored on any server.**

---

## 🎨 Architectural Overview

```
+-------------------+                           +-------------------+
|  Browser Peer A   |                           |  Browser Peer B   |
|   (File Sender)   |                           |  (File Receiver)  |
+---------+---------+                           +---------+---------+
          |                                               |
          | 1. Join Room (Socket.IO)                      | 1. Join Room (Socket.IO)
          v                                               v
+-------------------------------------------------------------------+
|               Node.js Express + Socket.IO Server                  |
|                      (Signaling Only)                             |
+-------------------------------------------------------------------+
          |                                               |
          | 2. Relay SDP Offer / Answer & ICE Candidates  |
          +-----------------------------------------------+
          
          =================================================
          3. Direct P2P WebRTC DataChannel established ⚡
          =================================================
          
+-------------------+   16KB Binary Stream Chunks   +-------------------+
|  Browser Peer A   |==============================>|  Browser Peer B   |
| (Backpressure ON) |   (No server intermediate)    |  (Blob Assembly)  |
+-------------------+                               +-------------------+
```

---

## 🚀 Key Features & Highlights

- **⚡ Direct P2P Data Channels**: Native WebRTC `RTCDataChannel` streaming for direct peer transfers.
- **🛡️ 100% Client-Side Privacy**: Server never touches file binary data or file names.
- **🔄 Backpressure Control**: Implements `bufferedAmountLowThreshold` with 16KB chunking to prevent memory leaks and tab crashes during large file transfers.
- **📱 Instant Mobile Pairing (QR Code)**: Built-in QR code modal allowing mobile devices to scan and join room links instantly.
- **📊 Real-Time Metrics**: Live speed calculation (MB/s), percentage progress bar, and estimated time remaining (ETA).
- **📂 Multi-File Queue**: Supports dragging and dropping multiple files with progress tracking per file.
- **💎 Dark Electric Blue UI**: Sleek dark aesthetic with glassmorphic cards and electric blue (`#2A7FFF`) glow highlights.

---

## 📁 Project Structure

```
dropbeam/
├── client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectionStatus.jsx  # Connection badge & room link
│   │   │   ├── FileQueue.jsx         # Multi-file queue & downloads list
│   │   │   ├── FileTransfer.jsx      # Drag & drop upload area
│   │   │   ├── Header.jsx            # Top navbar & server indicator
│   │   │   ├── ProgressBar.jsx       # Real-time speed & progress bar
│   │   │   ├── QRCodeModal.jsx       # Mobile QR pairing modal
│   │   │   └── RoomJoin.jsx          # Room creation & join screen
│   │   ├── hooks/
│   │   │   ├── useSocket.js          # Socket.IO connection & event handler
│   │   │   └── useWebRTC.js          # WebRTC RTCPeerConnection lifecycle
│   │   ├── services/
│   │   │   └── signaling.js          # Socket factory service
│   │   ├── utils/
│   │   │   ├── fileChunker.js        # 16KB chunking & backpressure stream logic
│   │   │   └── formatters.js         # Bytes, speed, and time formatters
│   │   ├── App.jsx                   # Main React entry component
│   │   ├── index.css                 # Global CSS & dark theme tokens
│   │   └── main.jsx                  # React DOM mount point
│   ├── .env                          # Client environment variables
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express + Socket.IO signaling server
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                # Server configuration helper
│   │   ├── services/
│   │   │   └── roomManager.js        # In-memory room & peer limit manager (Max 2)
│   │   └── index.js                  # Express app & Socket.IO signaling handlers
│   ├── .env                          # Server environment variables
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Installation & Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The signaling server will start on **http://localhost:4000** with health checks available at **http://localhost:4000/health**.

### 3. Frontend Setup
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
The React Vite app will launch on **http://localhost:5173**.

---

## 🌐 Deployment Instructions

### Frontend (Deploy to Vercel or Netlify)
1. Push `client/` to your Git repository.
2. In Vercel, set Root Directory to `client`.
3. Add Environment Variable:
   ```env
   VITE_SIGNALING_SERVER_URL=https://your-signaling-server.onrender.com
   ```
4. Deploy!

### Backend (Deploy to Render or Railway)
> [!IMPORTANT]
> **Do not deploy the server to Vercel Serverless Functions.** Socket.IO requires a persistent long-running process for room management and WebRTC signaling.
1. Push `server/` to your Git repository.
2. In Render or Railway, create a new **Web Service**.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables:
   ```env
   PORT=4000
   CLIENT_URL=https://your-dropbeam-app.vercel.app
   ```
6. Deploy!

---

## 🌊 Technical Transfer Protocol & Flow

1. **Room Allocation**:
   - Sender creates a room. `roomManager.js` assigns a random 6-character code (e.g. `BEAM88`).
   - Receiver joins using the code or direct QR code link (`?room=BEAM88`).
   - Server restricts room occupancy to max 2 peers.

2. **WebRTC Peer Negotiation**:
   - Host peer creates `RTCPeerConnection` and `RTCDataChannel("file-transfer")`.
   - Signaling server relays `offer` SDP -> Receiver generates `answer` SDP -> ICE candidates exchanged (`stun:stun.l.google.com:19302`).

3. **Backpressure Streaming**:
   - Files are sliced into 16,384 byte (16KB) `ArrayBuffer` chunks.
   - Sender monitors `dataChannel.bufferedAmount`. If buffer exceeds 64KB, sending pauses until the `bufferedamountlow` event fires.
   - Receiver concatenates incoming `ArrayBuffer` chunks into a single `Blob` object and triggers browser file download.

---

## 📜 License
MIT License. Built as an open-source portfolio application demonstrating WebRTC DataChannels and modern real-time Web standards.
