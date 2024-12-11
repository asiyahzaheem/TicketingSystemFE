import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private isConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private connectionReady = new Subject<void>();

  constructor() {
    this.connect();
  }

  private connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket connected');
        this.isConnectedSubject.next(true);
        this.connectionReady.next();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnectedSubject.next(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });
    this.stompClient.activate();
  }

  isConnected(): Observable<boolean> {
    return this.isConnectedSubject.asObservable();
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (this.stompClient) {
      console.log("SUBSCRIBE WEB SOCKET: ")
      this.stompClient.subscribe(destination, (message) => callback(JSON.parse(message.body)));
    }
  }

  send(destination: string, body: any) {
    if (this.stompClient && this.stompClient.connected) {
      console.log("SEND")
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }
}
