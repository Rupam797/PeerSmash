# ⚡ PeerSmash — P2P Browser File Sharing App

PeerSmash is a high-performance, zero-server peer-to-peer file sharing application. Files transfer **directly between two browser sessions** via WebRTC DataChannels. The Node.js backend serves strictly as a lightweight signaling server to exchange connection metadata (SDP offers/answers & ICE candidates). **Zero bytes of file data are ever sent to, processed by, or stored on any server.**

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
- **👥 Real-Time Visitor Metrics**: Live user and room status badges broadcasted across clients.
- **📱 Instant Mobile Pairing (QR Code)**: Built-in QR code modal allowing mobile devices to scan and join room links instantly.
- **📊 Real-Time Metrics**: Live speed calculation (MB/s), percentage progress bar, and estimated time remaining (ETA).
- **📂 Multi-File Queue**: Supports dragging and dropping multiple files with progress tracking per file.
- **💎 Dark Electric Blue UI**: Sleek dark aesthetic with glassmorphic cards and electric blue (`#2A7FFF`) glow highlights.

---

## 📁 Project Structure

```
peersmash/
├── client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectionStatus.jsx  # Connection badge & room link
│   │   │   ├── FileQueue.jsx         # Multi-file queue & downloads list
│   │   │   ├── FileTransfer.jsx      # Drag & drop upload area
│   │   │   ├── Header.jsx            # Top navbar & live visitor stats
│   │   │   ├── ProgressBar.jsx       # Real-time speed & progress bar
│   │   │   ├── QRCodeModal.jsx       # Mobile QR pairing modal
│   │   │   └── RoomJoin.jsx          # Room creation & live usage banner
│   │   ├── hooks/
│   │   │   ├── useSocket.js          # Socket.IO connection & stats handler
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
├── render.yaml             # Render single-service deployment spec
└── README.md
```

---

## ⚙️ Local Installation & Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Run Both Frontend & Server
```bash
npm run build
npm start
```
Open **http://localhost:4000** to view the app!

---

## 📜 License
MIT License. Built as an open-source portfolio application demonstrating WebRTC DataChannels and modern real-time Web standards.
