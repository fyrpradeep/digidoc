import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User { socketId: string; userId: string; role: string; name: string; }

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/call' })
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string, User>();  // userId → user
  private rooms = new Map<string, { patientId: string; doctorId: string }>();

  handleConnection(s: Socket) { console.log('🔌 Connected:', s.id); }

  handleDisconnect(s: Socket) {
    for (const [id, u] of this.users) {
      if (u.socketId === s.id) {
        this.users.delete(id);
        // Notify partner
        for (const [roomId, r] of this.rooms) {
          if (r.patientId === id || r.doctorId === id) {
            const pid = r.patientId === id ? r.doctorId : r.patientId;
            const p = this.users.get(pid);
            if (p) this.server.to(p.socketId).emit('call:ended', { reason: 'disconnected' });
            this.rooms.delete(roomId);
          }
        }
        console.log('🔌 Disconnected:', u.name);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(s: Socket, d: { userId: string; role: string; name: string }) {
    this.users.set(d.userId, { socketId: s.id, ...d });
    console.log(`✅ Registered: ${d.role} "${d.name}" (${d.userId})`);
    s.emit('registered', { success: true, userId: d.userId });
  }

  @SubscribeMessage('call:request')
  handleCall(s: Socket, d: { roomId: string; patientId: string; patientName: string; doctorId: string; doctorName: string; callType: string }) {
    console.log(`📞 Call: ${d.patientName} → ${d.doctorName} (doctorId: ${d.doctorId})`);
    console.log('Online users:', Array.from(this.users.keys()));
    
    const doctor = this.users.get(d.doctorId);
    if (!doctor) {
      s.emit('call:doctor-offline', { message: `${d.doctorName} is offline` });
      return;
    }
    this.rooms.set(d.roomId, { patientId: d.patientId, doctorId: d.doctorId });
    this.server.to(doctor.socketId).emit('call:incoming', {
      roomId: d.roomId, patientId: d.patientId, patientName: d.patientName, callType: d.callType,
    });
  }

  @SubscribeMessage('call:accept')
  handleAccept(s: Socket, d: { roomId: string; doctorId: string; doctorName: string }) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const patient = this.users.get(r.patientId);
    if (patient) this.server.to(patient.socketId).emit('call:accepted', { roomId: d.roomId, doctorName: d.doctorName });
  }

  @SubscribeMessage('call:reject')
  handleReject(s: Socket, d: { roomId: string; doctorId: string }) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const patient = this.users.get(r.patientId);
    if (patient) this.server.to(patient.socketId).emit('call:rejected', {});
    this.rooms.delete(d.roomId);
  }

  @SubscribeMessage('call:end')
  handleEnd(s: Socket, d: { roomId: string; userId: string }) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const pid = r.patientId === d.userId ? r.doctorId : r.patientId;
    const p   = this.users.get(pid);
    if (p) this.server.to(p.socketId).emit('call:ended', {});
    this.rooms.delete(d.roomId);
  }

  @SubscribeMessage('webrtc:offer')
  handleOffer(s: Socket, d: any) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const to = r.patientId === d.fromId ? r.doctorId : r.patientId;
    const u  = this.users.get(to);
    if (u) this.server.to(u.socketId).emit('webrtc:offer', d);
  }

  @SubscribeMessage('webrtc:answer')
  handleAnswer(s: Socket, d: any) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const to = r.patientId === d.fromId ? r.doctorId : r.patientId;
    const u  = this.users.get(to);
    if (u) this.server.to(u.socketId).emit('webrtc:answer', d);
  }

  @SubscribeMessage('webrtc:ice')
  handleIce(s: Socket, d: any) {
    const r = this.rooms.get(d.roomId);
    if (!r) return;
    const to = r.patientId === d.fromId ? r.doctorId : r.patientId;
    const u  = this.users.get(to);
    if (u) this.server.to(u.socketId).emit('webrtc:ice', d);
  }
}
