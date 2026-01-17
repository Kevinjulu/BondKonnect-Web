import React from "react";
import UploadComponent from "./Upload";
import { getCurrentUserDetails } from "@/app/lib/actions/user.check";
// import { hasRequiredPermissions } from "@/app/lib/actions/api.actions";
import { redirect } from "next/navigation";

import { ModulePermissions, ActionPermissions } from "@/app/app/config/permissions";


// export const hasRequiredPermissions = (
//   userPermissions: string[],
//   requiredPermissions: (ModulePermissions | ActionPermissions)[]
// ): boolean => {
//   if (!userPermissions?.length) return false;

//   // Check required permissions
//   if (requiredPermissions?.length) {
//     // Check module permissions first
//     const modulePermission = requiredPermissions.find((p) =>
//       Object.values(ModulePermissions).includes(p as ModulePermissions)
//     );

//     if (modulePermission && !userPermissions.includes(modulePermission)) {
//       return false;
//     }

//     // Then check if user has at least one of the required action permissions
//     const actionPermissions = requiredPermissions.filter((p) =>
//       Object.values(ActionPermissions).includes(p as ActionPermissions)
//     );

//     if (
//       actionPermissions.length &&
//       !actionPermissions.some((p) => userPermissions.includes(p))
//     ) {
//       return false;
//     }

//     return true;
//   }

//   return false;
// };

const Upload = async () => {

  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }


  // interface Role {
  //   is_active: number;
  //   role_permissions: { allowed: boolean; permission_name: string }[];
  // }
  
  // const activeRole = user?.roles?.find((role: Role) => role.is_active === 1);
  // if (!activeRole) {
  //   redirect("/auth/login");
  //   return null;
  // }

  // const activePermissions = activeRole.role_permissions
  //   .filter((perm: { allowed: boolean; permission_name: string }) => perm.allowed)
  //   .map((perm: { allowed: boolean; permission_name: string }) => perm.permission_name);

  // const requiredPermissions = [
  //   ModulePermissions.UPLOADS,
  //   ...MODULE_DEPENDENCIES[ModulePermissions.UPLOADS]
  // ];

  // if (!hasRequiredPermissions(activePermissions, requiredPermissions)) {
  //   redirect("/auth/login");
  //   return null;
  // }

  return <UploadComponent />;
};

export default Upload;
