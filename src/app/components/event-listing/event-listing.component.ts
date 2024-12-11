import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event';
import { NzCardModule } from 'ng-zorro-antd/card';  // For nz-card
import { NzButtonModule } from 'ng-zorro-antd/button';  // For nz-button
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { TicketPoolService } from '../../services/ticket-pool.service';
import { AddTicketFormComponent } from '../add-ticket-form/add-ticket-form.component';
import { BuyTicketFormComponent } from '../buy-ticket-form/buy-ticket-form.component';
import { VendorService } from '../../services/vendor.service';
import { TicketPool } from '../../interfaces/ticketpool';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-listing',
  standalone: true,
  imports: [
    NzButtonModule,
    NzCardModule,
    CommonModule,
    AddTicketFormComponent,
    BuyTicketFormComponent,


  ],

  templateUrl: './event-listing.component.html',
  styleUrl: './event-listing.component.css'
})

export class EventListingComponent implements OnInit  {
  user: any
  isVendor!: boolean ;
  @Input() currentEvent!: Event; 
  ticketPool: TicketPool | null = null
  private ticketPoolSubscription: Subscription | null = null;
 
  constructor(
    private ticketService: TicketService, 
    private ticketPoolService: TicketPoolService, 
    private vendorService: VendorService
  ){}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user.id);
    this.isVendor = this.user.userType === 'vendor';

    // FETCH TICKETPOOL DETAILS
    if (this.currentEvent?.id) {
      // Request ticket pool by event ID
      console.log("IN EVEBT LISTING", this.currentEvent.id)
      this.ticketPoolService.requestTicketPoolByEventId(this.currentEvent.id)

      // Subscribe to ticket pool updates
      this.ticketPoolSubscription = this.ticketPoolService.getTicketPoolUpdates().subscribe((pool) => {
        if (pool) {
          this.ticketPool = pool;  // Update the ticket pool with new data
          console.log('Updated TicketPool:', this.ticketPool);
        } else {
          console.log('No ticket pool received');
        }});
    }
    // FETCH VENDOR DETAILS
    // if (this.currentEvent?.vendorId) {
    //   this.vendorService.getVendorById(this.currentEvent.vendorId).subscribe({
    //     next: (data) => {
    //       this.vendor = data;
    //       console.log('Vendor:', this.vendor);
    //     },
    //     error: (err) => console.error('Error fetching vendor:', err),
    //   });
    // }
    
  }

  // isVendor: boolean = this.user === 'vendor'; 
   
  showAddTicketForm: boolean = false;
  showBuyTicketForm: boolean = false;

  

  onAddTickets(): void {
    this.showAddTicketForm = true;
    this.showBuyTicketForm = false;  // Hide the buy ticket form if it's open
    console.log("CURRENT EVENT", this.currentEvent)
  }

  onBuyTickets(): void {
    this.showBuyTicketForm = true;
    this.showAddTicketForm = false;  // Hide the add ticket form if it's open
  }

  
  
}
