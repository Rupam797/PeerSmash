/**
 * Room Manager Service
 * Handles in-memory P2P signaling room state.
 * Restricts rooms to max 2 peers (1 initiator, 1 joiner).
 */

class RoomManager {
  constructor() {
    // Map<roomId, { peers: Set<socketId>, initiatorId: string, createdAt: number }>
    this.rooms = new Map();
    // Map<socketId, roomId>
    this.socketToRoom = new Map();
    this.totalConnectionsCount = 0;
    this.totalTransfersCompleted = 0;
  }

  generateRoomCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars like O, 0, I, 1
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(socketId) {
    // Remove from existing room if any
    this.leaveRoom(socketId);

    let roomId = this.generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = this.generateRoomCode();
    }

    this.rooms.set(roomId, {
      peers: new Set([socketId]),
      initiatorId: socketId,
      createdAt: Date.now()
    });

    this.socketToRoom.set(socketId, roomId);
    return roomId;
  }

  joinRoom(roomId, socketId) {
    const formattedRoomId = roomId.trim().toUpperCase();
    const room = this.rooms.get(formattedRoomId);

    if (!room) {
      return { success: false, reason: 'NOT_FOUND', message: 'Room code not found or expired.' };
    }

    if (room.peers.size >= 2) {
      return { success: false, reason: 'FULL', message: 'This room is already full (max 2 peers).' };
    }

    // Leave any existing room first
    this.leaveRoom(socketId);

    room.peers.add(socketId);
    this.socketToRoom.set(socketId, formattedRoomId);

    return {
      success: true,
      roomId: formattedRoomId,
      initiatorId: room.initiatorId,
      peerCount: room.peers.size
    };
  }

  leaveRoom(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;

    this.socketToRoom.delete(socketId);
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.peers.delete(socketId);

    if (room.peers.size === 0) {
      // Room empty, clean up
      this.rooms.delete(roomId);
      return { roomId, empty: true, remainingPeerId: null };
    } else {
      // Promote remaining peer if initiator left
      const remainingPeerId = Array.from(room.peers)[0];
      if (room.initiatorId === socketId) {
        room.initiatorId = remainingPeerId;
      }
      return { roomId, empty: false, remainingPeerId };
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId?.toUpperCase()) || null;
  }

  getStats() {
    return {
      activeRooms: this.rooms.size,
      connectedPeers: this.socketToRoom.size,
      totalConnections: this.totalConnectionsCount
    };
  }
}

export const roomManager = new RoomManager();
