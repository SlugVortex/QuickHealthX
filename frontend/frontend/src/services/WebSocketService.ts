// src/services/WebSocketService.ts
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Patient, PatientPublicView } from '../types/Patient';

export class WebSocketService {
  private client: Client;
  private isConnected: boolean = false;
  private adminQueueCallback: (queue: Patient[]) => void = () => {};
  private publicQueueCallback: (queue: PatientPublicView[]) => void = () => {};

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/queue-websocket'),
      onConnect: () => {
        this.isConnected = true;
        console.log('WebSocket connected');
        this.subscribeToQueues();
      },
      onDisconnect: () => {
        this.isConnected = false;
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });
  }

  public connect(): void {
    if (!this.isConnected) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.isConnected) {
      this.client.deactivate();
    }
  }

  private subscribeToQueues(): void {
    // Subscribe to admin queue updates
    this.client.subscribe('/topic/admin-queue', (message: IMessage) => {
      const queue: Patient[] = JSON.parse(message.body);
      this.adminQueueCallback(queue);
    });

    // Subscribe to public queue updates
    this.client.subscribe('/topic/public-queue', (message: IMessage) => {
      const queue: PatientPublicView[] = JSON.parse(message.body);
      this.publicQueueCallback(queue);
    });
  }

  public onAdminQueueUpdate(callback: (queue: Patient[]) => void): void {
    this.adminQueueCallback = callback;
  }

  public onPublicQueueUpdate(callback: (queue: PatientPublicView[]) => void): void {
    this.publicQueueCallback = callback;
  }
}

export const webSocketService = new WebSocketService();
