export interface Event {
    id?:string;
    eventName: string;         
    description?: string;      // Optional description of the event
    location: string;          // Location of the event
    time: string;            
    vendorId?: string;          
    ticketpoolId?: string;  
  }
  