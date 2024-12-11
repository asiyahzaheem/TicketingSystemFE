import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { Vendor } from '../interfaces/vendor';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private vendorSubject = new BehaviorSubject<Vendor[]>([]);

  constructor(private webSocketService: WebSocketService) {
    this.subscribeToVendorUpdates();
  }

  private subscribeToVendorUpdates() {
    this.webSocketService.isConnected().subscribe((connected) => {
      if (connected) {
        this.webSocketService.subscribe('/topic/vendors', (message: any) => {
          console.log('Received vendor message:', message);
  
          if (Array.isArray(message)) {
            this.vendorSubject.next(message);
          } else {
            const currentVendors = this.vendorSubject.value;
            this.vendorSubject.next([...currentVendors, message.vendor]);
            // if (message.action === 'DELETE') {
            //   this.vendorSubject.next(
            //     currentVendors.filter((v) => v.id !== message.vendor.id)
            //   );
            // } else {
            //   this.vendorSubject.next([...currentVendors, message.vendor]);
            // }
          }
        });
      } else {
        console.error('WebSocket is not connected. Cannot subscribe to vendor updates.');
      }
    });
  }
  
  isConnected(): Observable<boolean> {
    return this.webSocketService.isConnected();
  }
  

  getVendors(): Observable<Vendor[]> {
    return this.vendorSubject.asObservable();
  }

  requestAllVendors() {
    this.webSocketService.send('/app/vendors/read', null);
  }

  addVendor(vendor: Vendor) {
    this.webSocketService.send('/app/vendors/add', { action: 'ADD', vendor });
  }

  updateVendor(vendor: Vendor) {
    this.webSocketService.send('/app/vendors/update', { action: 'UPDATE', vendor });
  }

  deleteVendor(vendorId: string) {
    this.webSocketService.send('/app/vendors/delete', { action: 'DELETE', vendor: { id: vendorId } });
  }
}
