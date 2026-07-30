import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * R4 — WebSocket Gateway للتتبع الحي
 *
 * Events (client → server):
 *   track:join  { orderNumber: string }  → ينضم لغرفة الطلب ويستقبل تحديثاته
 *   track:leave { orderNumber: string }  → يغادر غرفة الطلب
 *
 * Events (server → client):
 *   track:update  { orderNumber, status, statusLabel, lastLocation? }
 *   track:error   { message }
 */
@WebSocketGateway({
  namespace: 'tracking',
  cors: {
    origin: (process.env.CORS_ORIGIN || '*').split(',').map((o: string) => o.trim()),
    credentials: true,
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  handleConnection(client: Socket) {
    this.logger.debug(`WS connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`WS disconnected: ${client.id}`);
  }

  @SubscribeMessage('track:join')
  handleJoin(@MessageBody() data: { orderNumber: string }, @ConnectedSocket() client: Socket) {
    if (!data?.orderNumber) {
      client.emit('track:error', { message: 'orderNumber مطلوب' });
      return;
    }
    const room = `order:${data.orderNumber}`;
    client.join(room);
    this.logger.debug(`${client.id} joined room ${room}`);
    client.emit('track:joined', { orderNumber: data.orderNumber, room });
  }

  @SubscribeMessage('track:leave')
  handleLeave(@MessageBody() data: { orderNumber: string }, @ConnectedSocket() client: Socket) {
    if (!data?.orderNumber) return;
    const room = `order:${data.orderNumber}`;
    client.leave(room);
    this.logger.debug(`${client.id} left room ${room}`);
  }

  /**
   * يُستدعى من OrdersService عند تغيير حالة الطلب لإشعار جميع المتابعين.
   */
  broadcastStatusUpdate(payload: {
    orderNumber: string;
    status: string;
    statusLabel: string;
    lastLocation?: { latitude: number; longitude: number; at: Date } | null;
  }) {
    const room = `order:${payload.orderNumber}`;
    this.server.to(room).emit('track:update', payload);
  }
}
