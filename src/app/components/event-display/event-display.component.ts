import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event';
import { CommonModule } from '@angular/common';
import { EventListingComponent } from '../event-listing/event-listing.component';
import { NzCardModule } from 'ng-zorro-antd/card';  // For nz-card
import { NzGridModule } from 'ng-zorro-antd/grid'; 
import { EventFormComponent } from '../event-form/event-form.component';


@Component({
  selector: 'app-event-display',
  standalone: true,
  imports: [
    CommonModule, 
    EventListingComponent,
    NzCardModule,
    NzGridModule,
    // EventWindowComponent,
    // ConfigurationWindowComponent,
    EventFormComponent
  ],
  templateUrl: './event-display.component.html',
  styleUrl: './event-display.component.css'
})


export class EventDisplayComponent implements OnInit {
  events: Event[] = [];
  user: any;
  constructor(private eventService: EventService) {}
  clickedAddEvent = false
  

  ngOnInit() {
    // Wait for the WebSocket connection to be established
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user.id); // Output: John Doe
    
    this.eventService.isConnected().subscribe((connected) => {
      if (connected) {
        console.log('WebSocket connected. Fetching events...');
        
        // Subscribe to vendor updates
        this.eventService.getEvents().subscribe((events) => {
          console.log("Event subscribe");
          this.events = events;
        });
  
        // Request all events
        this.eventService.requestAllEvents();
      } else {
        console.log('Waiting for WebSocket connection...');
      }
    });
  }

  toggleAddEvent(): void {
    this.clickedAddEvent = !this.clickedAddEvent; // Toggle the state
  }

  getVendorEvents() {
    if(this.user.userType === "vendor") {
      console.log("IAMVENDRO")
      this.eventService.requestEventsByVendorId();
    }
  }

  addEvent() {
    const newEvent: Event = {
        eventName: "Concert",        
        description: "Halftime show",    
        location: "Sofi Stadium",      
        time: "2023",       
        vendorId: "6757e4170ca3e60e41474b8f", 
        ticketpoolId: ""    
        // ticketpoolId: "ticketpoolid",     // CHANGE
    };
    console.log(newEvent)
    this.eventService.addEvent(newEvent);
  }
}
