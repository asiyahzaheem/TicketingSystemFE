export interface consumer {
    id?: string;
    fullName: string;
    username: string;
    password: string;
    dateJoined: string;
    consumerType: ConsumerType
}

export enum ConsumerType {
    GENERAL = 'GENERAL',
    VIP = 'VIP'
  }