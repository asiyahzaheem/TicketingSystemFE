import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TicketingSystem';


  ngOnInit(): void {
    localStorage.setItem('user', JSON.stringify({
      id: '6757bfee7774db759fc78e0d',
      userType: 'vendor'
    }));

    // localStorage.setItem('user', JSON.stringify({
    //   id: '675966fe052a3f9adad98cf5',
    //   userType: 'consumer'
    // }));
  }
  
  
  
}
