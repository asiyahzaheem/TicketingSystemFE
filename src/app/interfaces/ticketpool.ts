import { Ticket } from "./ticket";
import { Configuration } from "./configuration";

export interface TicketPool {
    id?: string
    eventId: string;
    config: Configuration;
    tickets: Ticket[];
  }