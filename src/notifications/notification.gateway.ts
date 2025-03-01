import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  sendToAll(payload: any) {
    this.server.emit('notification', payload);
  }
}