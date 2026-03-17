type UserData = {
    id: number;
    first_name: string; // The first name of the user
    full_name: string;  // The full name of the user
    email: string;      // The user's email address
    phone_number: string | null; // The user's phone number (nullable)
    company_name: string; // Description of the company_name
    account_id: string; // Name of the scheme the user belongs to
    other_names: string; // Organization number associated with the user
    cookie: string; // Cookie string used for user authentication
    roles: Array<{
        id: number; // Unique identifier for the role
        role_name: string; // Name of the role
        is_active: number; // Indicates whether the role is active
        role_permissions: Array<{
            id: string; // Unique ID combining role ID and permission name
            permission_name: string; // Name of the permission
            allowed: boolean; // Indicates whether the permission is allowed
        }>;
    }>;
    leave_assignments?: string[];
};
