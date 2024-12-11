import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TicketService } from '../../services/ticket.service';
import { Event } from '../../interfaces/event';

@Component({
  selector: 'app-buy-ticket-form',
  standalone: true,
  imports: [
    NzSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './buy-ticket-form.component.html',
  styleUrl: './buy-ticket-form.component.css'
})

export class BuyTicketFormComponent {
  ticketForm!: FormGroup
  @Input() currentEvent!: Event

  constructor(private fb: FormBuilder, private ticketService: TicketService) {
    this.ticketForm = this.fb.group({
      noOfTickets: [null, [Validators.required, Validators.min(1)]],
      ticketType: [null, [Validators.required]]

    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      console.log(this.ticketForm.value);
      this.removeTickets()
      this.ticketForm.reset()
    }
  }

  removeTickets() {
    console.log("TICKETS REMOVED")
    const {noOfTickets, ticketType} = this.ticketForm.value

    if (this.currentEvent?.id) {
      this.ticketService.removeTickets(this.currentEvent.id, noOfTickets, ticketType);
    } else {
      console.error('No current event selected or event ID is missing.');
      alert('Please select a valid event before removing tickets.');
    }
  }

}
