export interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    email: string;
  }
  
  export interface loginType {
    icon?: JSX.Element | JSX.Element[];
    title?: string;
    subtitle?: string;
    subtext?: JSX.Element | JSX.Element[];
    role?: string;
    socialauths?: JSX.Element | JSX.Element[];
    email?: string;
  }
  
  export interface signInType {
    title?: string;
  }
  
