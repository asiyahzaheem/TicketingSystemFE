import { Component } from '@angular/core';
import { VendorsComponent } from '../vendors/vendors.component';
import { EventDisplayComponent } from '../event-display/event-display.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [EventDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
