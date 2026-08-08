import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/env.js';
import { roomManager } from './services/roomManager.js';

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Serve static frontend files in production
app.use(express.static(clientDistPath));

// Health Check Endpoint (for Render / Railway uptime checks)
app.get('/health', (req, res) => {
  const stats = roomManager.getStats();
  res.status(200).json({
    status: 'ok',
    service: 'DropBeam Signaling Server',
    timestamp: new Date().toISOString(),
    activeRooms: stats.activeRooms,
    connectedPeers: stats.connectedPeers
  });
});

// Visitor / Active Room Stats Endpoint
app.get('/api/stats', (req, res) => {
  res.status(200).json(roomManager.getStats());
});

// SPA fallback routing for client
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});


// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from deployed Vercel apps or local dev
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

function broadcastStats() {
  io.emit('stats-update', roomManager.getStats());
}

io.on('connection', (socket) => {
  roomManager.totalConnectionsCount++;
  console.log(`[Socket] Connected: ${socket.id}`);
  broadcastStats();

  // Create Room
  socket.on('create-room', () => {
    const roomId = roomManager.createRoom(socket.id);
    socket.join(roomId);
    console.log(`[Room] Created: ${roomId} by ${socket.id}`);
    socket.emit('room-created', {
      roomId,
      peerId: socket.id,
      isInitiator: true
    });
    broadcastStats();
  });

  // Join Room
  socket.on('join-room', ({ roomId }) => {
    if (!roomId) {
      return socket.emit('join-error', { message: 'Room code is required.' });
    }

    const result = roomManager.joinRoom(roomId, socket.id);
    if (!result.success) {
      console.log(`[Room] Join failed for ${socket.id} on ${roomId}: ${result.message}`);
      return socket.emit('join-error', { message: result.message, reason: result.reason });
    }

    const formattedRoomId = result.roomId;
    socket.join(formattedRoomId);
    console.log(`[Room] ${socket.id} joined room ${formattedRoomId}`);

    // Notify joiner
    socket.emit('room-joined', {
      roomId: formattedRoomId,
      peerId: socket.id,
      isInitiator: false,
      initiatorId: result.initiatorId
    });

    // Notify initiator that joiner has arrived
    socket.to(formattedRoomId).emit('peer-joined', {
      peerId: socket.id
    });
    broadcastStats();
  });

  // Relay WebRTC Offer
  socket.on('offer', ({ roomId, offer }) => {
    console.log(`[Signaling] Relaying Offer from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit('offer', {
      offer,
      senderId: socket.id
    });
  });

  // Relay WebRTC Answer
  socket.on('answer', ({ roomId, answer }) => {
    console.log(`[Signaling] Relaying Answer from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit('answer', {
      answer,
      senderId: socket.id
    });
  });

  // Relay ICE Candidate
  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', {
      candidate,
      senderId: socket.id
    });
  });

  // Manual Leave Room
  socket.on('leave-room', () => {
    handleDisconnect(socket);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    handleDisconnect(socket);
  });
});

function handleDisconnect(socket) {
  const result = roomManager.leaveRoom(socket.id);
  if (result && !result.empty && result.remainingPeerId) {
    console.log(`[Room] Peer ${socket.id} left room ${result.roomId}. Notifying ${result.remainingPeerId}`);
    io.to(result.roomId).emit('peer-left', { peerId: socket.id });
  }
  broadcastStats();
}


// Start Server
server.listen(config.port, () => {
  console.log(`
⚡ DropBeam Signaling Server running!
🚀 Server listening on port ${config.port}
🔗 Health Check: http://localhost:${config.port}/health
  `);
});
