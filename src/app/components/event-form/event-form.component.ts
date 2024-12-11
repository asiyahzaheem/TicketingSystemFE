import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event'; // Import Event interface
import { Configuration } from '../../interfaces/configuration'; // Import Event interface
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { TicketPoolService } from '../../services/ticket-pool.service';
import { TicketPool } from '../../interfaces/ticketpool';
import { tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { WebSocketService } from '../../services/web-socket.service';
import { switchMap, mergeMap } from 'rxjs/operators';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n'

@Component({
  selector: 'app-event-form',
  standalone: true,
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  imports: [
    FormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSpaceModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})


export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  user: any;
  mode: string = 'date';
  date = null;
  // modeControl = this.fb.control('date');

  constructor(private fb: FormBuilder, 
    private eventService: EventService, 
    private ticketPoolService: TicketPoolService, 
    private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user)
    this.eventForm = this.fb.group({
      event: this.fb.group({
        eventName: [null, [Validators.required]],
        description: [null],
        location: [null, [Validators.required]],
        time: [null, [Validators.required]],
      }),
      configuration: this.fb.group({
        totalTickets: [null, [Validators.required, Validators.min(0)]],
        maxTicketCapacity: [null, [Validators.required, Validators.min(1)]],
        ticketReleaseRate: [null, [Validators.required, Validators.min(1)]],
        customerRetrievalRate: [null, [Validators.required, Validators.min(1)]]
      })

    });
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  // Access event controls safely
  get eventGroup() {
    return this.eventForm.get('event') as FormGroup;
  }

  // Access configuration controls safely
  get configurationGroup() {
    return this.eventForm.get('configuration') as FormGroup;
  }
  

  onSubmit() {
    if (this.eventForm.valid) {
      const eventFormData = this.eventForm.get('event')?.value;
      const configFormData = this.eventForm.get('configuration')?.value;
      eventFormData.vendorId = this.user.id

      if (!eventFormData || !configFormData) {
        console.error('Failed to extract form data');
        return;
      }

      console.log("Event form data", eventFormData)
      console.log("Config form data", configFormData)

      const event: Event = {
        eventName: eventFormData.eventName,
        description: eventFormData.description,
        location: eventFormData.location,
        time: eventFormData.time,
        vendorId: eventFormData.vendorId, // Assume vendorId is set from localStorage
        ticketpoolId: undefined, // Optional, set as needed
      };

      this.eventService.addEvent(event)
      
      // Subscribe to event addition acknowledgment
      this.eventService.getEvents().subscribe((events) => {
        const createdEvent = events.find((e) => e.eventName === event.eventName);

        if (createdEvent) {
          // Construct TicketPool
          const ticketPool: TicketPool = {
            eventId: createdEvent.id || "",
            config: configFormData,
            tickets: [], // Initially no tickets
          };

          console.log('TicketPool Data:', ticketPool);

          
          this.ticketPoolService.addTicketPool(ticketPool);

          // // NOT WORKING
          // this.ticketPoolService.getTicketPools().subscribe((ticketpools) => {
          //   console.log(ticketPool)
          //   const createdTicketPool = ticketpools.find((t) => t.eventId === ticketPool.eventId);
          //   if(createdTicketPool) {
          //     console.log("CREATED TICKET POOL", createdTicketPool)
          //     createdEvent.ticketpoolId = createdTicketPool.id
          //     console.log("UPDATED EVENT", createdEvent)
          //     this.eventService.updateEvent(createdEvent)
          //   }
          
          // })

            

            

          // Reset the form after successful submission
          this.eventForm.reset();
        }
      });

      // Handle the data as needed
      this.eventForm.reset();
    } else {
      console.error('Form is invalid!');
    }
  } 


/*
onSubmit() {
  if (this.eventForm.valid) {
    const eventFormData = this.eventForm.get('event')?.value;
    const configFormData = this.eventForm.get('configuration')?.value;
    eventFormData.vendorId = this.user.id;

    if (!eventFormData || !configFormData) {
      console.error('Failed to extract form data');
      return;
    }

    console.log("Event form data", eventFormData);
    console.log("Config form data", configFormData);

    const event: Event = {
      eventName: eventFormData.eventName,
      description: eventFormData.description,
      location: eventFormData.location,
      time: eventFormData.time,
      vendorId: eventFormData.vendorId, // Assume vendorId is set from localStorage
      ticketpoolId: undefined, // Optional, set as needed
    };

    // Step 1: Add Event
    this.eventService.addEvent(event);

    // Step 2: Subscribe to event addition acknowledgment
    this.eventService.getEvents().subscribe((events) => {
      const createdEvent = events.find((e) => e.eventName === event.eventName);
      console.log(createdEvent)

      if (createdEvent && !createdEvent.ticketpoolId) {  // Check if ticketpoolId is already set
        // Step 3: Construct TicketPool
        const ticketPool: TicketPool = {
          eventId: createdEvent.id || "",
          config: configFormData,
          tickets: [], // Initially no tickets
        };

        console.log('TicketPool Data:', ticketPool);

        // Step 4: Add TicketPool
        this.ticketPoolService.addTicketPool(ticketPool);

        // Step 5: Subscribe to TicketPool creation acknowledgment
        this.ticketPoolService.getTicketPoolUpdates().subscribe((ticketpools) => {
          const createdTicketPool = ticketpools.find((t) => t.eventId === ticketPool.eventId);
          if (createdTicketPool) {
            console.log("CREATED TICKET POOL", createdTicketPool);

            // Step 6: Update Event with TicketPool ID
            createdEvent.ticketpoolId = createdTicketPool.id;
            console.log("UPDATED EVENT", createdEvent);

            this.eventService.updateEvent(createdEvent);
          }

          // Step 7: Reset the form after successful submission
          this.eventForm.reset();
        });
      }
    });
  } else {
    console.error('Form is invalid!');
  }
} */

}