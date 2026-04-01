import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/call' })
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // userId → socket info
  private users = new Map<string, { socketId: string; userId: string; role: string; name: string }>();
  // roomId → participants
  private rooms = new Map<string, { patientId: string; doctorId: string }>();

  handleConnection(s: Socket)    { console.log('🔌 Connected:', s.id); }
  handleDisconnect(s: Socket) {
    for (const [id, u] of this.users) {
      if (u.socketId === s.id) {
        this.users.delete(id);
        for (const [rid, r] of this.rooms) {
          if (r.patientId === id || r.doctorId === id) {
            const partnerId = r.patientId === id ? r.doctorId : r.patientId;
            const partner   = this.users.get(partnerId);
            if (partner) this.server.to(partner.socketId).emit('call:ended', { reason: 'Partner disconnected' });
            this.rooms.delete(rid);
          }
        }
        console.log('🔌 Disconnected:', u.name);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  onRegister(s: Socket, d: { userId: string; role: string; name: string }) {
    this.users.set(d.userId, { socketId: s.id, ...d });
    console.log(`✅ ${d.role} registered: "${d.name}" (${d.userId})`);
    console.log('🟢 Online users:', Array.from(this.users.keys()));
    s.emit('registered', { success: true });
  }

  @SubscribeMessage('call:request')
  onCallRequest(s: Socket, d: {
    roomId: string; patientId: string; patientName: string;
    doctorId: string; doctorName: string; callType: string;
  }) {
    console.log(`📞 Call: ${d.patientName} → ${d.doctorName} (doctorId: ${d.doctorId})`);
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
  onAccept(s: Socket, d: { roomId: string; doctorId: string; doctorName: string }) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const patient = this.users.get(r.patientId);
    if (patient) this.server.to(patient.socketId).emit('call:accepted', { roomId: d.roomId });
  }

  @SubscribeMessage('call:reject')
  onReject(s: Socket, d: { roomId: string }) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const patient = this.users.get(r.patientId);
    if (patient) this.server.to(patient.socketId).emit('call:rejected', {});
    this.rooms.delete(d.roomId);
  }

  @SubscribeMessage('call:end')
  onEnd(s: Socket, d: { roomId: string; userId: string }) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const partnerId = r.patientId === d.userId ? r.doctorId : r.patientId;
    const partner   = this.users.get(partnerId);
    if (partner) this.server.to(partner.socketId).emit('call:ended', {});
    this.rooms.delete(d.roomId);
  }
}
