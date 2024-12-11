/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
// import { Ticket } from '../interfaces/ticket';
import { TicketPool } from '../interfaces/ticketpool';

@Injectable({
  providedIn: 'root',
})

export class TicketPoolService {
  private ticketPoolSubject = new BehaviorSubject<TicketPool[]>([]);
  // private ticketPoolSubject = new BehaviorSubject<TicketPool | null>(null);
  user: any;

  constructor(private webSocketService: WebSocketService) {
    this.subscribeToTicketPoolUpdates();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  private subscribeToTicketPoolUpdates(ticketPoolId?: string) {
    this.webSocketService.isConnected().subscribe((connected) => {
      if (connected) {
        this.webSocketService.subscribe('/topic/ticketpool', (message: any) => {
          console.log('Received Ticket pool message:', message);
  
          if (Array.isArray(message)) {
            this.ticketPoolSubject.next(message);
          } else {
            const currentTicketPools = this.ticketPoolSubject.value;
            console.log(message)
            this.ticketPoolSubject.next([...currentTicketPools, message.ticketPool]);
            // if (message.action === 'DELETE') {
            //   this.ticketPoolSubject.next(
            //     currentTicketPools.filter((v) => v.id !== message.Ticket.id)
            //   );
            // } else {
            //   this.ticketPoolSubject.next([...currentTicketPools, message.Ticket]);
            // }
          }
        });
      } else {
        console.error('WebSocket is not connected. Cannot subscribe to TicketPool updates.');
      }
    });
  }
  
  isConnected(): Observable<boolean> {
    return this.webSocketService.isConnected();
  }
  

  getTicketPools(): Observable<TicketPool[]> {
    return this.ticketPoolSubject.asObservable();
  }

  requestTicketPoolById(id: string) {
    this.webSocketService.send(`/app/ticketpool/read/${id}`, id);
    this.subscribeToTicketPoolUpdates(id);
  }

  requestTicketPoolByEventId(eventId: string) {
    this.webSocketService.send(`/app/ticketpool/read/event/${eventId}`, eventId);
  }


  addTickePool(ticketPool: TicketPool) {
    console.log("ADD Ticket:", ticketPool)
    this.webSocketService.send('/app/ticketpool/add', { action: 'ADD', ticketPool });
  }

  // getTicketPoolUpdates(): Observable<TicketPool | null> {
  //   return this.ticketPoolSubject.asObservable();
  // }

  


}
*/ 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { TicketPool } from '../interfaces/ticketpool';

@Injectable({
  providedIn: 'root',
})
export class TicketPoolService {
  private ticketPoolSubject = new BehaviorSubject<TicketPool | null>(null);
  private ticketPool$ = this.ticketPoolSubject.asObservable()
  user: any;

  constructor(private webSocketService: WebSocketService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.subscribeToTicketPoolUpdates();

  }

  private subscribeToTicketPoolUpdates() {
    this.webSocketService.isConnected().subscribe((connected) => {
      if (connected) {
        this.webSocketService.subscribe('/topic/ticketpool', (message: any) => {
          console.log('Received Ticketpool message:', message);
  
          // Check if the message is a valid TicketPool (not an array)
          if (message && message.ticketPool) {
            // If you have only one ticket pool, just update the subject with that pool
            this.ticketPoolSubject.next(message.ticketPool);
          }

        });
      } else {
        console.error('WebSocket is not connected. Cannot subscribe to Event updates.');
      }
    });
  }
 
  /**
   * Requests a ticket pool by its ID and subscribes to updates for that ticket pool.
   */
  requestTicketPoolById(ticketPoolId: string): void {
    this.webSocketService.send(`/app/ticketpool/read/${ticketPoolId}`, {});
    // this.subscribeToSpecificTicketPoolUpdates(ticketPoolId);
  }


  /**
   * Exposes the current ticket pool as an observable.
   * The getTicketPoolUpdates method in TicketPoolService returns an observable that emits updates whenever a TicketPool is sent by the backend.
   */
  getTicketPoolUpdates(): Observable<TicketPool | null > {
    return this.ticketPoolSubject.asObservable();
  }

  /**
   * Requests a ticket pool by an event ID.
   */
  requestTicketPoolByEventId(eventId: string): void {
    this.webSocketService.send(`/app/ticketpool/read/event/${eventId}`, eventId);
    console.log(`Requested ticket pool for event ID: ${eventId}`);
    // this.subscribeToTicketPoolUpdates(eventId); solution ??
  }

  /**
   * Adds a new ticket pool.
   */
  addTicketPool(ticketPool: TicketPool): void {
    console.log('ADD TicketPool:', ticketPool);
    this.webSocketService.send('/app/ticketpool/add', { action: 'ADD', ticketPool });
  }
}
