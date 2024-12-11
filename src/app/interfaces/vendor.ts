import { Configuration } from "./configuration";

  export interface Vendor {
    // id: string;
    fullName: string;
    username: string;
    password: string;
    dateJoined: string;
    defaultConfig: Configuration | null;
  }
  