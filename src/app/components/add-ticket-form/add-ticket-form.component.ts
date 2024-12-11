import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';  // Import this module
import { TicketService } from '../../services/ticket.service';
import { Event } from '../../interfaces/event';
@Component({
  selector: 'app-add-ticket-form',
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-ticket-form.component.html',
  styleUrl: './add-ticket-form.component.css'
})

export class AddTicketFormComponent {
  ticketForm!: FormGroup;
  @Input() currentEvent!:Event
  // @Input() event!:Event

  constructor(private fb: FormBuilder, private ticketService: TicketService) {
    this.ticketForm = this.fb.group({
      noOfTickets: [null, [Validators.required, Validators.min(1)]],
      ticketType: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      console.log(this.ticketForm.value);
      this.addTickets()
      this.ticketForm.reset()
    }
  }

  addTickets() {
    console.log("TICKETS ADDED")
    const {noOfTickets, ticketType, price} = this.ticketForm.value

    if (this.currentEvent?.id) {
      this.ticketService.addTickets(this.currentEvent.id, noOfTickets, ticketType, price);
    } else {
      console.error('No current event selected or event ID is missing.');
      alert('Please select a valid event before adding tickets.');
    }
    
    
  }

}