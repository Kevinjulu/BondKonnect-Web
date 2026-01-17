export interface User {
  Id: number;
  FirstName: string | null;
  OtherNames: string | null;
  Email: string;
  CompanyName: string | null;
  PhoneNumber: string | null;
  IsActive: number;
  Roles: {
    Id: number;
    RoleName: string;
    RoleDescription: string;
  }[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  path: string;
}

export interface AdminUser extends User {
  Id: number;
  Email: string;
  FirstName: string | null;
  OtherNames: string | null;
}
