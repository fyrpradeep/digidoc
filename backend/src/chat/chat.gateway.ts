import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string, string>();
  handleConnection(s: Socket) {}
  handleDisconnect(s: Socket) { for(const [id,sid] of this.users){if(sid===s.id){this.users.delete(id);break;}} }
  @SubscribeMessage('chat:register')
  onRegister(s: Socket, d: {userId:string}) { this.users.set(d.userId,s.id); s.emit('chat:registered',{success:true}); }
  @SubscribeMessage('chat:send')
  onMessage(s: Socket, d: {toId:string;fromId:string;fromName:string;message:string;type:string}) {
    const toSocket=this.users.get(d.toId);
    const msg={...d,timestamp:new Date().toISOString()};
    if(toSocket) this.server.to(toSocket).emit('chat:message',msg);
    s.emit('chat:message',msg);
  }
  @SubscribeMessage('chat:typing')
  onTyping(s: Socket, d: {toId:string;isTyping:boolean}) {
    const toSocket=this.users.get(d.toId);
    if(toSocket) this.server.to(toSocket).emit('chat:typing',d);
  }
}
