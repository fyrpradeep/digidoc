import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors:{origin:'*'}, namespace:'/call' })
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string,{socketId:string;userId:string;role:string;name:string}>();
  private rooms = new Map<string,{patientId:string;doctorId:string}>();

  handleConnection(s: Socket)    { console.log('🔌 Connect:', s.id); }
  handleDisconnect(s: Socket) {
    for (const [id,u] of this.users) {
      if (u.socketId===s.id) {
        this.users.delete(id);
        for (const [rid,r] of this.rooms) {
          if (r.patientId===id||r.doctorId===id) {
            const pid = r.patientId===id ? r.doctorId : r.patientId;
            const pu  = this.users.get(pid);
            if (pu) this.server.to(pu.socketId).emit('call:ended',{reason:'disconnected'});
            this.rooms.delete(rid);
          }
        }
        console.log('🔌 Disconnect:', u.name);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  onRegister(s: Socket, d: {userId:string;role:string;name:string}) {
    this.users.set(d.userId, {socketId:s.id,...d});
    console.log(`✅ Registered: ${d.role} "${d.name}" (${d.userId})`);
    console.log('Online users:', Array.from(this.users.keys()));
    s.emit('registered',{success:true});
  }

  @SubscribeMessage('call:request')
  onCall(s: Socket, d: {roomId:string;patientId:string;patientName:string;doctorId:string;doctorName:string;callType:string}) {
    console.log(`📞 ${d.patientName} → ${d.doctorName} (${d.doctorId})`);
    const doctor = this.users.get(d.doctorId);
    if (!doctor) { s.emit('call:doctor-offline',{message:`${d.doctorName} is offline`}); return; }
    this.rooms.set(d.roomId,{patientId:d.patientId,doctorId:d.doctorId});
    this.server.to(doctor.socketId).emit('call:incoming',{roomId:d.roomId,patientId:d.patientId,patientName:d.patientName,callType:d.callType});
  }

  @SubscribeMessage('call:accept')
  onAccept(s: Socket, d: {roomId:string;doctorId:string;doctorName:string}) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const p = this.users.get(r.patientId);
    if (p) this.server.to(p.socketId).emit('call:accepted',{roomId:d.roomId,doctorName:d.doctorName});
  }

  @SubscribeMessage('call:reject')
  onReject(s: Socket, d: {roomId:string;doctorId:string}) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const p = this.users.get(r.patientId);
    if (p) this.server.to(p.socketId).emit('call:rejected',{});
    this.rooms.delete(d.roomId);
  }

  @SubscribeMessage('call:end')
  onEnd(s: Socket, d: {roomId:string;userId:string}) {
    const r = this.rooms.get(d.roomId); if (!r) return;
    const pid = r.patientId===d.userId ? r.doctorId : r.patientId;
    const pu  = this.users.get(pid);
    if (pu) this.server.to(pu.socketId).emit('call:ended',{});
    this.rooms.delete(d.roomId);
  }

  @SubscribeMessage('webrtc:offer')
  onOffer(s: Socket, d: any) {
    const r=this.rooms.get(d.roomId); if(!r) return;
    const to=r.patientId===d.fromId?r.doctorId:r.patientId;
    const u=this.users.get(to); if(u) this.server.to(u.socketId).emit('webrtc:offer',d);
  }

  @SubscribeMessage('webrtc:answer')
  onAnswer(s: Socket, d: any) {
    const r=this.rooms.get(d.roomId); if(!r) return;
    const to=r.patientId===d.fromId?r.doctorId:r.patientId;
    const u=this.users.get(to); if(u) this.server.to(u.socketId).emit('webrtc:answer',d);
  }

  @SubscribeMessage('webrtc:ice')
  onIce(s: Socket, d: any) {
    const r=this.rooms.get(d.roomId); if(!r) return;
    const to=r.patientId===d.fromId?r.doctorId:r.patientId;
    const u=this.users.get(to); if(u) this.server.to(u.socketId).emit('webrtc:ice',d);
  }
}
