import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { Event } from '../interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSubject = new BehaviorSubject<Event[]>([]);
  user: any;

  constructor(private webSocketService: WebSocketService) {
    this.subscribeToEventUpdates();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  private subscribeToEventUpdates() {
    this.webSocketService.isConnected().subscribe((connected) => {
      if (connected) {
        this.webSocketService.subscribe('/topic/events', (message: any) => {
          console.log('Received Event message:', message);
  
          if (Array.isArray(message)) {
            this.eventSubject.next(message);
          } else {
            const currentEvents = this.eventSubject.value;
            this.eventSubject.next([...currentEvents, message.event]);
            // if (message.action === 'DELETE') {
            //   this.eventSubject.next(
            //     currentEvents.filter((v) => v.id !== message.Event.id)
            //   );
            // } else {
            //   this.eventSubject.next([...currentEvents, message.Event]);
            // }
          }
        });
      } else {
        console.error('WebSocket is not connected. Cannot subscribe to Event updates.');
      }
    });
  }
  
  isConnected(): Observable<boolean> {
    return this.webSocketService.isConnected();
  }
  

  getEvents(): Observable<Event[]> {
    return this.eventSubject.asObservable();
  }

  requestAllEvents() {
    console.log("requesting events")
    this.webSocketService.send('/app/events/read', null);
  }

  requestEventsByVendorId() {
    console.log(this.user)
    console.log("requesting vendor events")
    this.webSocketService.send(`/app/events/read/vendor/${this.user.id}`, null);
  }

  addEvent(event: Event) {
    console.log("ADD EVENT:", event)
    this.webSocketService.send('/app/events/add', { action: 'ADD', event });
  }

  updateEvent(event: Event) {
    console.log("UPDATE EVENT", event)
    this.webSocketService.send('/app/events/update', { action: 'UPDATE', event });
  }

  deleteEvent(eventId: string) {
    this.webSocketService.send('/app/events/delete', { action: 'DELETE', event: { id: eventId } });
  }
}
