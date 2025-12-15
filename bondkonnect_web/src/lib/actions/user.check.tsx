"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "./api.actions";

export async function getCurrentUserDetails() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("k-o-t");
  if (!cookie) {
    return null;
  }

  const full_name = cookie.name + "=" + cookie.value;
  console.log("Cookie: ", full_name);

  // Get the current user
  const currentUser = await getCurrentUser(full_name || "");

  if (!currentUser?.success) {
    return null;
  }

  // Map user data to a standardized result format
  const resultData = {
    id: currentUser.data.Id,
    first_name: currentUser.data.FirstName || "",
    full_name: currentUser.data.UserName || "",
    email: currentUser.data.Email || "",
    phone_number: currentUser.data.PhoneNumber || null,
    // These fields will be overridden for RM users if they have selected a sponsor
    company_name: currentUser.data.CompanyName || "",
    account_id: currentUser.data.AccountId || "",
    other_names: currentUser.data.OtherNames || "",
    cookie: full_name,
    roles: currentUser.data.Roles.map(
      (role: {
        id: string;
        name: string;
        is_active: number;
        permissions: string[];
      }) => ({
        id: parseInt(role.id, 10),
        role_name: role.name,
        is_active: role.is_active,
        role_permissions: role.permissions.map((permission) => ({
          id: `${role.id}-${permission}`,
          permission_name: permission,
          allowed: role.is_active === 1,
        })),
      })
    ),
    leave_assignments: currentUser.data.LeaveAssignments || [],
  };

  // Check if user is RM and has a selected sponsor
  // const isRM = resultData.roles.some(
  //   (role: { role_name: string }) => role.role_name === "relationshipmanager"
  // );

  // if (isRM) {
  //   try {
  //     // Get selected sponsor from cookies or localStorage
  //     const cookiesStore = await cookies();
  //     const currentSponsorStr = cookiesStore.get("currentSponsor")?.value;
  //     if (currentSponsorStr) {
  //       const currentSponsor = JSON.parse(currentSponsorStr);
  //       // Override organization-related fields with selected sponsor's data
  //       resultData.organization_number = currentSponsor.organization_number;
  //       resultData.scheme_name = currentSponsor.scheme_name;
  //       resultData.cost_center = currentSponsor.cost_center;
  //       resultData.cost_center_description =
  //         currentSponsor.cost_center_description;
  //     }
  //   } catch (error) {
  //     console.error("Error parsing RM sponsor data:", error);
  //   }
  // }

  return resultData;
}
