import React from "react";
import PermissionsMappingComponent from "./PermissionsMapping";
import { getCurrentUserDetails } from "@/lib/actions/user.check";
import { redirect } from "next/navigation";
import { ModulePermissions, MODULE_DEPENDENCIES, ActionPermissions } from "@/app/config/permissions";

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


const PermissionsMapping = async () => {
  const user = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/login");
  }

  //   interface Role {
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
  //   ModulePermissions.ADMIN_PANEL,
  //   ...MODULE_DEPENDENCIES[ModulePermissions.ADMIN_PANEL]
  // ];

  // if (!hasRequiredPermissions(activePermissions, requiredPermissions)) {
  //   redirect("/logout");
  //   return null;
  // }

  return <PermissionsMappingComponent userDetails={user} />;
};

export default PermissionsMapping;
