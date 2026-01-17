"use server";
import { ModulePermissions, ActionPermissions } from "@/app/config/permissions";
export const getCurrentApiUrl = async () => {
  const APP_ENVIRONMENT = process.env.APP_ENV;
  let BASE_URL = "";

  if (APP_ENVIRONMENT === "production") {
    BASE_URL = process.env.NEXT_PUBLIC_BK_PROD_API_URL ?? "";
  } else if (APP_ENVIRONMENT === "uat") {
    BASE_URL = process.env.NEXT_PUBLIC_BK_UAT_API_URL ?? "";
  } else {
    BASE_URL = process.env.NEXT_PUBLIC_BK_DEV_API_URL ?? "";
  }

  // if empty throw an error
  if (!BASE_URL) {
    throw new Error("API URL not found");
  }

  return BASE_URL;
};

//AUTH

export const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "nairobi"; // Fallback IP address
  }
};

export const getCurrentUser = async (queryParams: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      return null;
    }

    // set queryParams as cookies

    // get ythe auth token
  //   const token = await getBearer();

  //   console.log("Token for gettting user ", `Bearer ${token}`);

    const requestUrl = `${BASE_URL}/V1/auth/get-user-details`;
    console.log(requestUrl);
    const response = await fetch(requestUrl, {
      method: "POST", // Sending as GET request with query params
      headers: {
        Cookie: queryParams,
      //   Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("no current user");
    }
    const result = await response.json(); // Assuming the response is JSON
    console.log(result);
    return result;
  } catch (error) {
    console.error("An error occurred while gettting getting user", error);
    return null; // Return null if something goes wrong
  }
};

export async function generateCsrfToken() {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(`${BASE_URL}/V1/auth/generate-csrf-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      //   Authorization: `Bearer ${await getBearer()}`,
      },
    });

    const responseData = await response.json();
    console.log("Our response data", responseData);

    return responseData;
  } catch (error) {
    console.error("An error occurred while generating CSRF token:", error);
    return null;
  }
}


interface RegisterData {
  is_individual?: boolean;
  is_agent?: boolean;
  is_corporate?: boolean;
  is_broker?: boolean;
  is_dealer?: boolean;
  is_admin?: boolean;
  email?: string;
  phone?: string;
  company_name?: string;
  first_name?: string;
  other_names?: string;
  cds_number?: string;
  broker_dealer?: string[];
  locality?: string;
  category_type?: string;
  alternate_dealer?: string[];
  new_dealer_emails?: string[];
}

export const register = async (data: RegisterData) => {
  try {

  const BASE_URL = await getCurrentApiUrl();
  const url = `${BASE_URL}/V1/auth/user-register`;
  // const url = `http://localhost:8000/api/V1/auth/requests-otp-verification`;
  // const authToken = await getBearer();
  // if (!authToken) {
  //   throw new Error("Failed to obtain authentication token");
   // }
      const raw = JSON.stringify({
        is_individual: data.is_individual || false,
        is_agent: data.is_agent || false,
        is_corporate: data.is_corporate || false,
        is_broker: data.is_broker || false,
        is_dealer: data.is_dealer || false,
        is_admin: data.is_admin || false,
        email: data.email || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
        first_name: data.first_name || "",
        other_names: data.other_names || "",
        cds_number: data.cds_number || "",
        broker_dealer: data.broker_dealer || [],
        locality: data.locality || "",
        category_type: data.category_type || "",
        alternate_dealer: data.alternate_dealer || [],
        new_dealer_emails: data.new_dealer_emails || []
      });

    console.log(raw, BASE_URL);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
      body: raw,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "An error occurred while registering");
    }

    const result = await response.json();
    // Log response and result
    console.log("Response:", response);
    console.log("Result:", result);

    return result;
  } catch (error) {
    console.error("An error occurred while registering:", error);
    return null;
  }
};  

export const setPassword = async (queryParams: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      return null;
    }

    const url = `${BASE_URL}/V1/auth/set-password?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
     
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "An error occurred during login");
    }

    const result = await response.json();
    console.log("Pasword set:", result);

    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const login = async (queryParams: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      return null;
    }

    const url = `${BASE_URL}/V1/auth/user-login?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
     
    });

    const result = await response.json(); // Assuming the response is JSON
    console.log("Login result",result);

    return result; // Return the result (can be processed in the calling function)
  } catch (error) {
    console.error("An error occurred while logging in:", error);
    return null; // Return null if something goes wrong
  }
};

export async function otpVerify(queryParams: string) {
  try {
    const BASE_URL = await getCurrentApiUrl();

    if (!BASE_URL) {
      return null;
    }

    const url = `${BASE_URL}/V1/auth/verify-otp?${queryParams}`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
     
    });

    const result = await response.json(); // Assuming the response is JSON
    console.log("otpverify",result);

    return result;
  } catch (error) {
    console.error("An error occurred while verifying otp:", error);
    return null; // Return null if something goes wrong
  }
}

export const forgotPassword = async (queryParams: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();

    if (!BASE_URL) {
      return null;
    }

    const url = `${BASE_URL}/V1/auth/user-reset-password?${queryParams}`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
     
    });

    if (!response.ok) {
      throw new Error("Account recovering failed");
    }

    const result = await response.json(); // Assuming the response is JSON
    console.log("forgot pass",result);

    return result;
  } catch (error) {
    console.error("An error occurred while recovering account:", error);
    return null; // Return null if something goes wrong
  }
};

export const resendOtp = async (queryParams: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();

    if (!BASE_URL) {
      return null;
    }
  
    const url = `${BASE_URL}/V1/auth/resend-otp?${queryParams}`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
     
    });
    if (!response.ok) {
      throw new Error("Resending Otp failed");
    }

    const result = await response.json(); // Assuming the response is JSON
    console.log(result);

    return result;
  } catch (error) {
    console.error("An error occurred while resending otp:", error);
    return null; // Return null if something goes wrong
  }
};


export const logout = async (cookie: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(BASE_URL + "/V1/auth/user-logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: cookie,
      //   Authorization: "Bearer " + (await getBearer()),
      },
    });
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("An error occurred while logging out:", error);
    return null;
  }
};
  
  
export const setActiveRole = async (data: FormData, token: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    console.log(data);
    const response = await fetch(`${BASE_URL}/V1/auth/set-active-role`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: token,
      //   Authorization: `Bearer ${await getBearer()}`, // Add the token here
      },
      body: data,
    });

    const responseData = await response.json();
    // console.log(responseData);
    console.log("api.actions setActiveRole",responseData);
    return responseData;
  } catch (error) {
    console.error("An error occurred while setting active role:", error);
    return null;
  }
};
  
export const getActivityLogs = async () => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;

      const response = await fetch(`${BASE_URL}/V1/auth/get-all-activity-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
      });

      const result = await response.json();
      console.log("Activity logs fetched:", result);

      return result;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return null;
    }
  };

interface User {
  Id: number;
  FirstName: string | null;
  OtherNames: string | null;
  Email: string;
  IsActive: number;
  CompanyName: string | null;
  Roles: {
    Id: number;
    RoleName: string;
    RoleDescription: string;
  }[];
}

interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/auth/get-all-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

  export const getAllBrokersAndDealers = async () => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;

      const response = await fetch(`${BASE_URL}/V1/auth/get-all-broker-dealers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
      });

      const result = await response.json();
      console.log("Brokers/Dealers fetched:", result);

      return result;
    } catch (error) {
      console.error('Error fetching all brokers:', error);
      return null;
    }
  };

  export const suspendUser = async (user_id: number) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/auth/suspend-user?user_id=${user_id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting all roles user has:", error);
      return null;
    }
  }; 

  export const reactivateUser = async (user_id: number) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/auth/reactivate-user?user_id=${user_id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while reactivating user ", error);
      return null;
    }
  }; 

  export const completeIntermediaryRegistration = async (data: {
  is_broker: boolean; 
  is_dealer: boolean; 
  email: string;
  token: string;
  signature: string;
  csrf_token: string;
  csrf_timestamp: string;
  company_name: string;
  phone: string;
//   first_name: string;
//   other_names: string;
//   cds_number: string;
  locality: string;
  category_type: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/auth/complete-intermediary-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Intermediary registration completed:", result);

    return result;
  } catch (error) {
    console.error('Error completing intermediary registration:', error);
    return null;
  }
};

export const approveIntermediaryClient = async (data: {
  intermediary_email: string;
  client_email: string;
  notification_id: number;
  is_approved: boolean;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/auth/approve-intermediary-client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Client approval result:", result);

    return result;
  } catch (error) {
    console.error('Error approving client:', error);
    return null;
  }
};

export const getAdminUsers = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/auth/get-admin-users`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
    });

    if (!response.ok) throw new Error('Failed to fetch admin users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const getUserIntermediaries = async (user_email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/auth/get-user-intermediaries?user_email=${encodeURIComponent(user_email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
    }); 

    const result = await response.json();
    console.log("User intermediaries fetched:", result);

    return result;
  } catch (error) { 
    console.error('Error fetching user intermediaries:', error);
    throw error;
  }
};


//Permissions Management

interface PermissionData {
  role_id: number;
  user_email: string;
}

export const getUserPermissions = async (data: PermissionData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    const response = await fetch(
      `${BASE_URL}/V1/permissions/get-user-permissions?role_id=${data.role_id}&user_email=${encodeURIComponent(data.user_email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${await getBearer()}`,
        },
      }
    );

    const responseData = await response.json();
    console.log(responseData);

    return responseData;
  } catch (error) {
    console.error("An error occurred while getting user permissions:", error);
    return null;
  }
};

interface RolePermissionData {
  role_id: number;
}

export const getRolePermissions = async (data: RolePermissionData) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/get-role-permissions?role_id=${data.role_id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting role permissions set:", error);
      return null;
    }
  };

  export const modifyUserPermissions = async (data: FormData) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/modify-user-permissions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
          body: data
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while modifying user permissions:", error);
      return null;
    }
  };  

  interface AddUserToRoleData {
    admin_email: string;
    role_id: number;
    user_email: string;
  }

  export const addUserToNewRole = async (data: AddUserToRoleData) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/add-user-to-role?admin_email=${encodeURIComponent(data.admin_email)}&role_id=${data.role_id}&user_email=${encodeURIComponent(data.user_email)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting adding user to new role:", error);
      return null;
    }
  };  

  interface GetUsersByRoleData {
    role_id: number;
  }

  export const getUsersByRole = async (data: GetUsersByRoleData) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/get-users-by-role?role_id=${data.role_id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting user by role specified:", error);
      return null;
    }
  };    

  export const getAllRolesForUser = async (user_email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/get-all-user-roles?user_email=${encodeURIComponent(user_email)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting all roles user has:", error);
      return null;
    }
  }; 

  export const getRoles = async () => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      const response = await fetch(
        `${BASE_URL}/V1/permissions/get-roles`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${await getBearer()}`,
          },
        }
      );
  
      const responseData = await response.json();
      console.log(responseData);
  
      return responseData;
    } catch (error) {
      console.error("An error occurred while getting all roles:", error);
    return null;
  }
};

export const  hasRequiredPermissions = async (
  userPermissions: string[],
  requiredPermissions: (ModulePermissions | ActionPermissions)[]
) => {
  if (!userPermissions?.length) return false;

  // Check required permissions
  if (requiredPermissions?.length) {
    // Check module permissions first
    const modulePermission = requiredPermissions.find((p) =>
      Object.values(ModulePermissions).includes(p as ModulePermissions)
    );

    if (modulePermission && !userPermissions.includes(modulePermission)) {
      return false;
    }

    // Then check if user has at least one of the required action permissions
    const actionPermissions = requiredPermissions.filter((p) =>
      Object.values(ActionPermissions).includes(p as ActionPermissions)
    );

    if (
      actionPermissions.length &&
      !actionPermissions.some((p) => userPermissions.includes(p))
    ) {
      return false;
    }

    return true;
  }

  return false;
};


//BONDS
export const getTotalReturnScreen = async () => {
    try {
        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
          return null;
        }
      
        const url = `${BASE_URL}/V1/services/total-return-screen`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
         
        });

        const result = await response.json();

        if (!Array.isArray(result)) {
            throw new Error('Unexpected response format');
        }
        return result;
    } catch (error) {
        console.error('Error fetching top bonds:', error);
        throw error;
    }
}

export const getTotalDurationScreen = async (targetDuration?: number) => {
  try {
      const BASE_URL = await getCurrentApiUrl();
      
      if (!BASE_URL) {
          return null;
      }
      
      const url = `${BASE_URL}/V1/services/total-duration-screen`;
      console.log(url);
      
      // Prepare request body with target duration
      const requestBody = targetDuration !== undefined ? { targetDuration } : {};
      
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
              // Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      console.log("Total duration screen", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result.data;
  } catch (error) {
      console.error('Error fetching duration screen bonds:', error);
      throw error;
  }
}

export const getBarbellAndBullet = async () => {
    try {
        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
          return null;
        }
      
        const url = `${BASE_URL}/V1/services/barbell-bullet`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
         
        });

        const result = await response.json();
        
        if (!result.short || !result.long || !result.bullet) {
            throw new Error('Unexpected response format');
        }
        return result;
    } catch (error) {
        console.error('Error fetching barbell and bullet data:', error);
        throw error;
    }
}

export const getStatsTable = async () => {
    try {

        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
          return null;
        }
      
        const url = `${BASE_URL}/V1/services/stats-table`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
         
        });

        const result = await response.json();
        
        if (!Array.isArray(result)) {
            throw new Error('Unexpected response format');
        }
        return result;
    } catch (error) {
        console.error('Error fetching stats table data:', error);
        throw error;
    }
}

//get-bondCalc-Details
export const getBondCalcDetails = async () => {
    try {
        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
          return null;
        }
      
        const url = `${BASE_URL}/V1/services/get-bondCalc-Details`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "get",
          headers: {
            // "Content-Type": "application/json",
            // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
          next: { revalidate: 3000 } // Cache for 60 seconds
        });

        const result = await response.json();
        console.log("Bond calc details",typeof(result));
        
        // if (!Array.isArray(result)) {
        //     throw new Error('Unexpected response format');
        // }
        return result;
    } catch (error) {
        console.error('Error fetching bond calc details:', error);
        throw error;
    }
}

//get table params
export const getTableParams = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/services/get-table-params`, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      //   Authorization: `Bearer ${authToken}`,
      },
    });

    const result = await response.json();
    console.log("Table params", result);
    return result;
  } catch (error) {
    console.error('Error fetching table params:', error);
    throw error;
  }
}

//get-primary-market-bonds
export const getPrimaryMarketBonds = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-primary-market-bonds`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        next: { revalidate: 3000 } // Cache for 30 seconds
      });

      const result = await response.json();
      console.log("Primary market bonds", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching primary market bonds:', error);
      throw error;
  }

}
//get-secondary-market-bonds
export const getSecondaryMarketBonds = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-secondary-market-bonds`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        next: { revalidate: 3000 } // Cache for 30 seconds
      });

      const result = await response.json();
      console.log("Secondary market bonds", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching secondary market bonds:', error);
      throw error;
  }

}
//get-spot-yield-curve
export const getSpotYieldCurve = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-spot-yield-curve`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        
      });

      const result = await response.json();
      console.log("Spot yield curve", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching spot yield curve:', error);
      throw error;
  }

}
//get-historical-bands
export const getHistoricalBonds = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-historical-bands`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        
      });

      const result = await response.json();
      console.log("Historical bonds", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching historical bonds:', error);
      throw error;
  }

}
//get-projection-bands
export const getProjectionBands = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-projection-bands`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        
      });

      const result = await response.json();
      console.log("Projection bands", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching projection bands:', error);
      throw error;
  }

}
// get-bond-market-performance
export const getBondMarketPerformance = async () => {
  try {
      const BASE_URL = await getCurrentApiUrl();
    
      if (!BASE_URL) {
        return null;
      }
    
      const url = `${BASE_URL}/V1/services/get-bond-market-performance`;
      console.log(url);
    
      const response = await fetch(url, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          // "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        //   Authorization: `Bearer ${authToken}`,
        },
        
      });

      const result = await response.json();
      console.log("Bond market performance", result);
      
      // if (!Array.isArray(result)) {
      //     throw new Error('Unexpected response format');
      // }
      return result;
  }
  catch (error) {
      console.error('Error fetching bond market performance:', error);
      throw error;
  }

}


// Notification Functions
export const getUnreadNotifications = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/get-unread-notifications?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      // body: JSON.stringify({ email })
    });

    const result = await response.json();
    console.log("Unread notifications", result);
    return result;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return null;
  }
};

export const getAllNotifications = async (email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;
  
      const response = await fetch(`${BASE_URL}/V1/communication/get-all-notifications?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        // body: JSON.stringify({ email })
      });
  
      const result = await response.json();
      console.log("All notifications", result);
      return result;
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return null;
    }
  };

export const markAllNotificationsAsRead = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/mark-all-as-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    console.log("Marked all notifications as read", result);

    return result;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return null;
  }
};

export const markOneNotificationsAsRead = async (email: string,id: number) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/mark-one-as-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify({ email, id })
    });

    const result = await response.json();
    console.log("Marked notification as read", result);

    return result;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

export const markOneNotificationsAsFavoriteOrArchive = async (email: string,notif_id:number, action: string,value: number) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/mark-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify({ email,notif_id,action,value })
    });

    const result = await response.json();
    console.log("Marked one notifications as favorite or archive", result);

    return result;
  } catch (error) {
    console.error('Error marking notifications as favorite or archive:', error);
    return null;
  }
};


// Message Functions
export const submitMessage = async (data: FormData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/send-message`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: data
    });

    const result = await response.json();
    console.log("Submitted message", result);

    return result;
  } catch (error) {
    console.error('Error submitting message:', error);
    return null;
  }
};

export const replyMessage = async (data: FormData) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/reply-message`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: data
    });

    const result = await response.json();
    console.log("Replied to message", result);

    return result;
  } catch (error) {
    console.error('Error replying to message:', error);
    return null;
  }
};

export const getUserThread = async (messageId: number) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/message-thread?message_id=${messageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      // body: JSON.stringify({ message_id: messageId })
    });

    const result = await response.json();
    console.log("Message thread found", result);

    return result;
  } catch (error) {
    console.error('Error fetching message thread:', error);
    return null;
  }
};

export const getMessagesByUser = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/user-messages?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      // body: JSON.stringify({ email })
    });

    const result = await response.json();
    console.log("User messages", result);

    return result;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return null;
  }
};

export const getUnreadMessageByUser = async (email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;
  
      const response = await fetch(`${BASE_URL}/V1/communication/unread-user-messages?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        // body: JSON.stringify({ email })
      });
  
      const result = await response.json();
      console.log("Unread user messages", result);
  
      return result;
    } catch (error) {
      console.error('Error fetching unread user messages:', error);
      return null;
    }
  };

export const markMessageAsRead = async (email: string,id: number) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;
  
      const response = await fetch(`${BASE_URL}/V1/communication/mark-message-as-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        body: JSON.stringify({ email, id })
      });
  
      const result = await response.json();
      console.log("Marked message as read", result);
  
      return result;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return null;
    }
  };

export const getAllUnreadMessagesForUser = async (email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/all-unread-user-messages?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
    });

    const result = await response.json();
    console.log("Unread messages with threads", result);

    return result;
  } catch (error) {
    console.error('Error fetching unread messages with threads:', error);
    return null;
  }
};

export const getMessageParticipants = async (email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;
  
      const response = await fetch(`${BASE_URL}/V1/communication/user-message-participants?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
      });
  
      const result = await response.json();
      console.log("Message Participants", result);
  
      return result;
    } catch (error) {
      console.error('Error fetching message participants with threads:', error);
      return null;
    }
  };
  
// Portfolio Management Functions
export const addNewPortfolio = async (data: {
  portfolio_name: string;
  value_date: string;
  description: string;
  user_email: string;
  bonds: Array<{
    bond_id: number;
    type: 'HFS' | 'HTM' | 'AFS';
    buying_date: string;
    buying_price: number;
    buying_wap: number;
    face_value_buys: number;
    selling_date?: string | null;
    selling_price?: number | null;
    selling_wap?: number | null;
    face_value_sales?: number | null;
    face_value_bal: number;
    closing_price: number;
    coupon_net: number;
    next_cpn_days: string;
    realized_pnl: string;
    unrealized_pnl: string;
    one_yr_total_return: number;
    portfolio_value: string;
  }>;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/services/add-new-portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Added new portfolio", result);

    return result;
  } catch (error) {
    console.error('Error adding new portfolio:', error);
    return null;
  }
};

export const getUserPortfolios = async (email: string) => {
  try {
    // console.log("Getting portfolios for email:", email);
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      console.error("Failed to get BASE_URL");
      return null;
    }

    const url = `${BASE_URL}/V1/services/get-user-portfolios?user_email=${encodeURIComponent(email)}`;
    console.log("Fetching portfolios from URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
    });

    console.log("Portfolio API response status:", response.status);
    const result = await response.json();
    console.log("Portfolio API response data:", result);

    if (!result.success) {
      console.error("Portfolio API returned error:", result.message);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return null;
  }
};

export const updatePortfolio = async (data: {
  portfolio_id: number;
  portfolio_name: string;
  value_date: string;
  description: string;
  user_email: string;
  bonds: Array<{
    bond_id: number;
    type: 'HFS' | 'HTM' | 'AFS';
    buying_date: string;
    buying_price: number;
    buying_wap: number;
    face_value_buys: number;
    selling_date?: string | null;
    selling_price?: number | null;
    selling_wap?: number | null;
    face_value_sales?: number | null;
    face_value_bal: number;
    closing_price: number;
    coupon_net: number;
    next_cpn_days: string;
    realized_pnl: string;
    unrealized_pnl: string;
    one_yr_total_return: number;
    portfolio_value: string;
  }>;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/services/update-portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Updated portfolio:", result);

    return result;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return null;
  }
};

export const exportPortfolioToExcel = async (portfolioId: number) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;



    const response = await fetch(`${BASE_URL}/V1/services/export-portfolio-excel?portfolio_id=${portfolioId}`, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
    });

    // Return the blob for client-side download
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error exporting portfolio to Excel:', error);
    return null;
  }
};

export const sendToQuoteBook = async (data: {   
  bond_id: number;   
  IsBid: boolean;   
  IsOffer: boolean;   
  bid_price: number;   
  offer_price: number;   
  bid_yield: number;   
  offer_yield: number;   
  bid_amount: number;   
  offer_amount: number;   
  assigned_by: string; 
}) => {   
  try {     
    const BASE_URL = await getCurrentApiUrl();     
    if (!BASE_URL) {       
      throw new Error("API URL not found");     
    }      

    const response = await fetch(`${BASE_URL}/V1/services/create-quote`, {       
      method: "POST",       
      headers: {         
        "Content-Type": "application/json",         
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",       
      },       
      body: JSON.stringify(data)     
    });      

    const result = await response.json();
    
    if (!response.ok) {       
      throw new Error(result.message || "Failed to create quote");     
    }      

    return result;   
  } catch (error) {     
    console.error('Error creating quote:', error);     
    return {       
      success: false,       
      message: error instanceof Error ? error.message : "An unexpected error occurred"     
    };   
  } 
};

//Quotes Management

export const getQuotes = async (user_email: string) => {
    try {
        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
    return null;
  }
      
        const url = `${BASE_URL}/V1/services/get-all-quotes?user_email=${encodeURIComponent(user_email)}`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
        });

        const result = await response.json();
        console.log("Quotes", result);
        
        if (!result || !result.success) {
            throw new Error(result?.message || 'Failed to fetch quotes');
        }
        console.log("Quotes data", result.data);
        return result.data;
    } catch (error) {
        console.error('Error fetching quotes:', error);
        throw error;
    }
}

export const getDelegatedQuotes = async (email: string) => {
    try {
        const BASE_URL = await getCurrentApiUrl();
  
        if (!BASE_URL) {
          return null;
        }
      
        const url = `${BASE_URL}/V1/services/get-delegated-quotes?delegate_email=${encodeURIComponent(email)}`;
        console.log(url);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
          //   Authorization: `Bearer ${authToken}`,
          },
        });

        const result = await response.json();
        console.log("Delegated Quotes", result);
        
        if (!result || !result.success) {
            throw new Error(result?.message || 'Failed to fetch delegated quotes');
        }
        
        return result.data;
    } catch (error) {
        console.error('Error fetching delegated quotes:', error);
        throw error;
    }
}

export const createTransaction = async (payload: {
  quote_id: number;
  user_email: string;
  bid_price: number;
  bid_yield: number;
  offer_price: number;
  offer_yield: number;
  bid_amount: number;
  offer_amount: number;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      throw new Error("API URL not found");
    }

    const response = await fetch(`${BASE_URL}/V1/services/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create transaction");
    }

    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
};

export const getUserQuotes = async (email: string) => {
    try {
      // console.log("Getting portfolios for email:", email);
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) {
        console.error("Failed to get BASE_URL");
        return null;
      }
  
      const url = `${BASE_URL}/V1/services/get-quotes-user?user_email=${encodeURIComponent(email)}`;
      console.log("Fetching quotes from URL:", url);
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
      });
  
      console.log("Quotes API response status:", response.status);
      const result = await response.json();
      console.log("Quotes API response data:", result);
  
      if (!result.success) {
        console.error("Quotes API returned error:", result.message);
        return null;
      }
  
      return result;
    } catch (error) {
      console.error('Error fetching user Quotes:', error);
      return null;
    }
  };

  export const markTransactionStatus = async (payload: {
    trans_id: number;
    user_email: string;
    is_accepted: boolean;
    is_rejected: boolean;
    is_pending: boolean;
    is_delegated: boolean;
  }) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) {
        return { success: false, message: "API URL not found" };
      }
  
      const response = await fetch(`${BASE_URL}/V1/services/mark-transaction-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        body: JSON.stringify(payload)
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to update transaction status");
      }
  
      return result;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      };
    }
  };

export const updateQuote = async (data: {
    quote_id: number;
    bid_price: number;
    offer_price: number;
    face_value: number;
    settlement_date: string;
    indicative_range: string;
    assigned_by: string;
    is_active: boolean;
    is_accepted: boolean;
    total_receivable: number;
    total_payable: number;
    other_levies: number;
    commission_nse: number;
    consideration: number;
  }) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;
  
      const response = await fetch(`${BASE_URL}/V1/services/update-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      console.log("Updated quote:", result);
  
      return result;
    } catch (error) {
      console.error('Error updating quote:', error);
      return null;
    }
  };

  export const getUserTransactions = async (user_email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;

      const response = await fetch(`${BASE_URL}/V1/services/get-user-transactions?user_email=${encodeURIComponent(user_email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        // body: JSON.stringify({ user_email })
      });

      const result = await response.json();
      console.log("User transactions fetched:", result);

      return result;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return null;
    }
  };

  export const getSentTransactions = async (user_email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;

      const response = await fetch(`${BASE_URL}/V1/services/get-sent-transactions?user_email=${encodeURIComponent(user_email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        // body: JSON.stringify({ user_email })
      });

      const result = await response.json();
      console.log("Sent transactions fetched:", result);

      return result;
    } catch (error) {
      console.error('Error fetching sent transactions:', error);
      return null;
    }
  };

  export const getDelegatedTransactions = async (delegate_email: string) => {
    try {
      const BASE_URL = await getCurrentApiUrl();
      if (!BASE_URL) return null;

      const response = await fetch(`${BASE_URL}/V1/services/get-delegated-transactions?delegate_email=${encodeURIComponent(delegate_email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
        },
        // body: JSON.stringify({ delegate_email })
      });

      const result = await response.json();
      console.log("Delegated transactions fetched:", result);

      return result;
    } catch (error) {
      console.error('Error fetching delegated transactions:', error);
      return null;
    }
  };

//FINANCIALS MGMT

export const addSubscriptionPlan = async (data: {
  name: string;
  description: string;
  is_active?: boolean;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/add-subscription-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Subscription plan added:", result);

    return result;
  } catch (error) {
    console.error('Error adding subscription plan:', error);
    return null;
  }
};

export const addSubscriptionFeaturesCategories = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/add-sub-features-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Subscription features category added:", result);

    return result;
  } catch (error) {
    console.error('Error adding subscription features category:', error);
    return null;
  }
};

export const addSubscriptionFeatures = async (data: {
  category_id: number;
  subscription_plan_id: number;
  name: string;
  description: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/add-sub-features`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Subscription feature added:", result);

    return result;
  } catch (error) {
    console.error('Error adding subscription feature:', error);
    return null;
  }
};

export const addBillingDetails = async (data: {
  subscription_plan_id: number;
  days: number;
  currency: number;
  unit_price: number;
  name: string;
  description: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/add-billing-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Billing details added:", result);

    return result;
  } catch (error) {
    console.error('Error adding billing details:', error);
    return null;
  }
};

export const getSubscriptionPlanDetails = async (planId: number) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-sub-plan-details?plan_id=${planId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("Subscription plan details fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching subscription plan details:', error);
    return null;
  }
};

export const addNewSubscription = async (data: {
  user_email: string;
  plan_id: number;
  amount_paid: number;
  discount: number;
  subscription_status: number;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/add-new-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("New subscription added:", result);

    return result;
  } catch (error) {
    console.error('Error adding new subscription:', error);
    return null;
  }
};


export const getAllSubscriptions = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-all-subscriptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("All subscriptions fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    return null;
  }
};

export const getAllFeatures = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-all-sub-features`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("All subscription features fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching all subscription features:', error);
    return null;
  }
};

export const getAllFeatureCategories = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-all-feature-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("All feature categories fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching all feature categories:', error);
    return null;
  }
};

export const getUserSubscriptions = async (userEmail: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-user-subscriptions?user_email=${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("User subscriptions fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return null;
  }
};

export const getAllSubscriptionPlans = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/financials/get-all-sub-plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    const result = await response.json();
    console.log("All subscription plans fetched:", result);

    return result;
  } catch (error) {
    console.error('Error fetching all subscription plans:', error);
    return null;
  }
};


export const createEmail = async (data: {
  subject: string;
  body: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  template_type?: string;
  schedule_date?: string;
  attachments?: File[];
  send_to_role?: string;
  created_by: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const typedKey = key as keyof typeof data;
      if (key === "attachments" && data.attachments) {
        data.attachments.forEach(file => {
          formData.append("attachments[]", file);
        });
      } else if (Array.isArray(data[typedKey])) {
        formData.append(key, JSON.stringify(data[typedKey]));
      } else {
        formData.append(key, String(data[typedKey]));
      }
    });

    const response = await fetch(`${BASE_URL}/V1/communication/create-email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const getEmailTemplates = async () => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/communication/get-email-templates`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch email templates");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw error;
  }
};

export const getRecipientsByRole = async (role: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) throw new Error("API URL not found");

    const response = await fetch(`${BASE_URL}/V1/communication/get-recipients-by-role?role=${role}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipients");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};

export const previewEmailTemplate = async (templateName: string, data: Record<string, unknown>) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) return null;

    const response = await fetch(`${BASE_URL}/V1/communication/preview-template`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify({ template: templateName, data }),
    });

    if (!response.ok) throw new Error('Failed to preview template');
    return await response.json();
  } catch (error) {
    console.error('Error previewing template:', error);
    throw error;
  }
};

export const getViewingPartyQuotes = async (user_email: string) => {
  try {
    const BASE_URL = await getCurrentApiUrl();

    if (!BASE_URL) {
      return null;
    }
  
    const url = `${BASE_URL}/V1/services/get-viewing-party-quotes`;
    console.log("Fetching viewing party quotes from:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify({ user_email })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching viewing party quotes:", error);
    throw error;
  }
};

export const activateQuote = async (data: {
  quote_id: number;
  user_email: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      throw new Error("API URL not found");
    }

    const response = await fetch(`${BASE_URL}/V1/services/activate-quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to activate quote");
    }

    return result;
  } catch (error) {
    console.error('Error activating quote:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
};

// Suspend Quote - matches your Laravel suspendQuote endpoint
export const suspendQuote = async (data: {
  quote_id: number;
  user_email: string;
}) => {
  try {
    const BASE_URL = await getCurrentApiUrl();
    if (!BASE_URL) {
      throw new Error("API URL not found");
    }

    const response = await fetch(`${BASE_URL}/V1/services/suspend-quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_Ocp_Apim_Subscription_Key || "",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to suspend quote");
    }

    return result;
  } catch (error) {
    console.error('Error suspending quote:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
};
