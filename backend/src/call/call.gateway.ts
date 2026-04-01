import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ConnectedUser {
  socketId: string;
  userId:   string;
  role:     'patient' | 'doctor';
  name:     string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/call',
})
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // userId → socket mapping
  private users = new Map<string, ConnectedUser>();

  // roomId → [patientId, doctorId]
  private rooms = new Map<string, { patientId: string; doctorId: string }>();

  handleConnection(socket: Socket) {
    console.log(`✅ Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    // Remove user and notify room partner
    for (const [userId, user] of this.users.entries()) {
      if (user.socketId === socket.id) {
        this.users.delete(userId);
        // Notify any active room
        for (const [roomId, room] of this.rooms.entries()) {
          if (room.patientId === userId || room.doctorId === userId) {
            const partnerId = room.patientId === userId ? room.doctorId : room.patientId;
            const partner   = this.users.get(partnerId);
            if (partner) {
              this.server.to(partner.socketId).emit('call:ended', { reason: 'disconnected' });
            }
            this.rooms.delete(roomId);
          }
        }
        break;
      }
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  }

  // ── Register user (call after login) ────────────────────────────
  @SubscribeMessage('register')
  handleRegister(socket: Socket, data: { userId: string; role: 'patient'|'doctor'; name: string }) {
    this.users.set(data.userId, { socketId: socket.id, ...data });
    console.log(`📱 Registered: ${data.role} ${data.name} (${data.userId})`);
    socket.emit('registered', { success: true });
  }

  // ── Patient calls doctor ────────────────────────────────────────
  @SubscribeMessage('call:request')
  handleCallRequest(socket: Socket, data: {
    patientId: string; patientName: string;
    doctorId:  string; doctorName:  string;
    roomId: string;    callType: 'video' | 'audio';
  }) {
    const doctor = this.users.get(data.doctorId);
    if (!doctor) {
      socket.emit('call:doctor-offline', { message: 'Doctor is currently offline' });
      return;
    }

    // Store room
    this.rooms.set(data.roomId, { patientId: data.patientId, doctorId: data.doctorId });

    // Notify doctor
    this.server.to(doctor.socketId).emit('call:incoming', {
      roomId:      data.roomId,
      patientId:   data.patientId,
      patientName: data.patientName,
      callType:    data.callType,
    });

    console.log(`📞 Call request: ${data.patientName} → ${data.doctorName}`);
  }

  // ── Doctor accepts ──────────────────────────────────────────────
  @SubscribeMessage('call:accept')
  handleCallAccept(socket: Socket, data: { roomId: string; doctorId: string; doctorName: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;

    const patient = this.users.get(room.patientId);
    if (patient) {
      this.server.to(patient.socketId).emit('call:accepted', {
        roomId:     data.roomId,
        doctorName: data.doctorName,
      });
    }
    console.log(`✅ Call accepted: room ${data.roomId}`);
  }

  // ── Doctor rejects ──────────────────────────────────────────────
  @SubscribeMessage('call:reject')
  handleCallReject(socket: Socket, data: { roomId: string; doctorId: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;

    const patient = this.users.get(room.patientId);
    if (patient) {
      this.server.to(patient.socketId).emit('call:rejected', { roomId: data.roomId });
    }
    this.rooms.delete(data.roomId);
    console.log(`❌ Call rejected: room ${data.roomId}`);
  }

  // ── End call ────────────────────────────────────────────────────
  @SubscribeMessage('call:end')
  handleCallEnd(socket: Socket, data: { roomId: string; userId: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;

    const partnerId = room.patientId === data.userId ? room.doctorId : room.patientId;
    const partner   = this.users.get(partnerId);
    if (partner) {
      this.server.to(partner.socketId).emit('call:ended', { roomId: data.roomId });
    }
    this.rooms.delete(data.roomId);
    console.log(`📵 Call ended: room ${data.roomId}`);
  }

  // ── WebRTC Signaling ─────────────────────────────────────────────
  @SubscribeMessage('webrtc:offer')
  handleOffer(socket: Socket, data: { roomId: string; offer: any; fromId: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;
    const toId   = room.patientId === data.fromId ? room.doctorId : room.patientId;
    const toUser = this.users.get(toId);
    if (toUser) this.server.to(toUser.socketId).emit('webrtc:offer', data);
  }

  @SubscribeMessage('webrtc:answer')
  handleAnswer(socket: Socket, data: { roomId: string; answer: any; fromId: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;
    const toId   = room.patientId === data.fromId ? room.doctorId : room.patientId;
    const toUser = this.users.get(toId);
    if (toUser) this.server.to(toUser.socketId).emit('webrtc:answer', data);
  }

  @SubscribeMessage('webrtc:ice')
  handleIce(socket: Socket, data: { roomId: string; candidate: any; fromId: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;
    const toId   = room.patientId === data.fromId ? room.doctorId : room.patientId;
    const toUser = this.users.get(toId);
    if (toUser) this.server.to(toUser.socketId).emit('webrtc:ice', data);
  }
}
