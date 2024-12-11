/*
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Vendor } from '../../interfaces/vendor';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css'
})
export class VendorsComponent {
  vendors: Vendor[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.getVendors().subscribe((vendors) => {
      this.vendors = vendors;
    });

    this.webSocketService.isConnected().subscribe((isConnected) => {
      if (isConnected) {
        console.log('WebSocket is connected');
        this.webSocketService.requestAllVendors();
        // for (let i = 0; i < 3; i++) {
        //   this.addVendor();
        // }
      } else {
        console.log('WebSocket is not connected yet');
      }
    });
    }
  
    addVendor() {
      console.log("add vendor")
      const newVendor: Vendor = {
        id: ("id" + Math.floor(Math.random() * 1000)).toString(),
        fullName: 'New Vendor',
        username: 'newvendor',
        password: 'password123',
        dateJoined: new Date().toISOString(),
        defaultConfig: {
          totalTickets: 9,
          maxTicketCapacity: 9,
          ticketReleaseRate: 9,
          customerRetrievalRate: 9,
        }
      };
      this.webSocketService.sendVendor('ADD', newVendor);
    }

}
*/

import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../interfaces/vendor';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})

export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    // Wait for the WebSocket connection to be established
    this.vendorService.isConnected().subscribe((connected) => {
      if (connected) {
        console.log('WebSocket connected. Fetching vendors...');
        
        // Subscribe to vendor updates
        this.vendorService.getVendors().subscribe((vendors) => {
          console.log("Vendor subscribe");
          this.vendors = vendors;
        });
  
        // Request all vendors
        this.vendorService.requestAllVendors();
      } else {
        console.log('Waiting for WebSocket connection...');
      }
    });
  }

  addVendor() {
    const newVendor: Vendor = {
      // id: 'id' + Math.floor(Math.random() * 1000),
      fullName: 'Yay Vendor',
      username: 'new vendor',
      password: 'password123',
      dateJoined: new Date().toISOString(),
      defaultConfig: {
        totalTickets: 10,
        maxTicketCapacity: 100,
        ticketReleaseRate: 5,
        customerRetrievalRate: 2,
      },
    };
    this.vendorService.addVendor(newVendor);
  }
}
