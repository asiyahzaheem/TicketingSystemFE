import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { Event } from '../interfaces/event';
import { Ticket, TicketType } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root',
})

export class TicketService {
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  user: any;

  constructor(private webSocketService: WebSocketService) {
    this.subscribeToTicketUpdates();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  private subscribeToTicketUpdates() {
    this.webSocketService.isConnected().subscribe((connected) => {
      if (connected) {
        this.webSocketService.subscribe('/topic/tickets', (message: any) => {
          console.log('Received Ticket message:', message);
  
          if (Array.isArray(message)) {
            this.ticketSubject.next(message);
          } else {
            const currentTickets = this.ticketSubject.value;
            this.ticketSubject.next([...currentTickets, message.ticket]);
            // if (message.action === 'DELETE') {
            //   this.ticketSubject.next(
            //     currentTickets.filter((v) => v.id !== message.Event.id)
            //   );
            // } else {
            //   this.ticketSubject.next([...currentTickets, message.Event]);
            // }
          }
        });
      } else {
        console.error('WebSocket is not connected. Cannot subscribe to Ticket updates.');
      }
    });
  }
  
  isConnected(): Observable<boolean> {
    return this.webSocketService.isConnected();
  }
  

  getTickets(): Observable<Ticket[]> {
    return this.ticketSubject.asObservable();
  }

  requestTicketsByEventId(id: string) {
    this.webSocketService.send(`/app/tickets/read/event/${id}`, id);
  }

  requestTicketById(id: string) {
    this.webSocketService.send(`/app/tickets/read/${id}`, id)
  }

  // addTicket(ticket: Ticket) {
  //   console.log("ADD TICKET:", ticket)
  //   this.webSocketService.send('/app/tickets/add', { action: 'ADD', ticket });
  // }

  addTickets(eventId: string, 
    noOfTickets: number, 
    ticketType: TicketType, 
    price: number) {

    console.log("ADD TICKETS")
    const request = {
      eventId,
      noOfTickets,
      ticketType,
      price
    };
    console.log("ADD TICKETS", request)
    this.webSocketService.send('/app/tickets/add', request)
  }

  removeTickets(eventId: string, noOfTickets: number, ticketType: TicketType) {
    
    const request = {
      eventId, noOfTickets, ticketType
    }
    console.log('REMOVE TICKETS', request)
    this.webSocketService.send('/app/tickets/remove', request)
  }
  

}
