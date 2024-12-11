export enum TicketType {
    GENERAL_ADMISSION = 'GENERAL_ADMISSION',
    VIP = 'VIP'
  }
  
export interface Ticket {
    eventId: string;
    price: number;
    statusAvailable: boolean;
    ticketType: TicketType;
}