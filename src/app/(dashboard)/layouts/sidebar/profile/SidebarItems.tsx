import React from 'react';
import { useState,useEffect, useCallback } from 'react';
import { Calendar, Home, Inbox, Search, Settings,ChevronDown,ChevronUp,User2,Plus } from "lucide-react"
import { Sidebar,SidebarHeader,SidebarFooter,SidebarGroupAction, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/app/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/app/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation";
import { AppState } from '@/app/store/store';
import { useDispatch, useSelector } from '@/app/store/hooks';
import { setUserRole, clearUserRole } from '@/app/store/apps/auth/AuthSlice';
import { FaAudible } from "react-icons/fa";
import { TbSquareLetterB } from "react-icons/tb";

import { ScrollArea,ScrollBar  } from "@/app/components/ui/scroll-area"
import Menuitems from '../MenuItems';

import { ModulePermissions,ActionPermissions, Permission,permissionMap, PermissionKey, MODULE_PERMISSION_REQUIREMENTS, MODULE_DEPENDENCIES } from "@/app/app/config/permissions";
interface MenuitemsType {
    [x: string]: any;
    id?: string;
    isactive?: boolean;
    navlabel?: boolean;
    grouplabel?: string;
    collapsible?: boolean;
    header?: string;
    footer?: string;
    title?: string;
    icon?: any;
    href?: string;
    children?: MenuitemsType[];
    badge?: string;
    chip?: string;
    chipColor?: string;
    // variant?: string;
    // external?: boolean;
    roles?: string[];
    permissions?: string[];  // Add permissions for each menu item
    permissionKey?: PermissionKey;
    modulePermissions?: ModulePermissions[];
    actionPermissions?: ActionPermissions[];
    requiredPermissions?: (ModulePermissions | ActionPermissions)[];
  }

  const hasRequiredPermissions = (
    userPermissions: string[],  
    item: MenuitemsType,
    activeRole?: string
  ): boolean => {
    console.log(`\n--- Checking permissions for: ${item.title} ---`);
    console.log("User permissions:", userPermissions);
    console.log("Item config:", {
      roles: item.roles,
      permissionKey: item.permissionKey,
      requiredPermissions: item.requiredPermissions,
      permissions: item.permissions
    });
    console.log("Active role:", activeRole);

    // Special case: Admin users have access to everything
    if (activeRole === 'admin') {
      console.log("✅ Admin user - granting access to all items");
      return true;
    }

    if (!userPermissions?.length) {
      console.log("❌ No user permissions found");
      return false;
    }
  
    // Check role restrictions first
    if (item.roles && activeRole) {
      if (!item.roles.includes(activeRole)) {
        console.log(`❌ Role restriction failed. Required: ${item.roles}, Active: ${activeRole}`);
        return false;
      }
      console.log("✅ Role restriction passed");
    }
  
    // Check permissionKey mapping first
    if (item.permissionKey && item.permissionKey in permissionMap) {
      const mappedPermissions =
        permissionMap[item.permissionKey as keyof typeof permissionMap];
      console.log("Mapped permissions:", mappedPermissions);
      if (
        mappedPermissions?.some((perm: string) => userPermissions.includes(perm))
      ) {
        console.log("✅ Permission key mapping passed");
        return true;
      }
      console.log("❌ Permission key mapping failed");
    }

    // Check legacy permissions array
    if (item.permissions?.length) {
      const hasLegacyPermission = item.permissions.some((perm: string) => 
        userPermissions.includes(perm)
      );
      if (hasLegacyPermission) {
        console.log("✅ Legacy permissions passed");
        return true;
      }
      console.log("❌ Legacy permissions failed");
    }
  
    // Check required permissions
    if (item.requiredPermissions?.length) {
      console.log("Checking required permissions:", item.requiredPermissions);
      
      // Check module permissions first
      const modulePermission = item.requiredPermissions.find((p) =>
        Object.values(ModulePermissions).includes(p as ModulePermissions)
      );
  
      if (modulePermission && !userPermissions.includes(modulePermission)) {
        console.log(`❌ Module permission failed: ${modulePermission}`);
        return false;
      }
  
      // Then check if user has at least one of the required action permissions
      const actionPermissions = item.requiredPermissions.filter((p) =>
        Object.values(ActionPermissions).includes(p as ActionPermissions)
      );
  
      if (
        actionPermissions.length &&
        !actionPermissions.some((p) => userPermissions.includes(p))
      ) {
        console.log(`❌ Action permissions failed: ${actionPermissions}`);
        return false;
      }
  
      console.log("✅ Required permissions passed");
      return true;
    }

    // If no specific permission requirements, allow access
    if (!item.roles && !item.permissionKey && !item.requiredPermissions && !item.permissions) {
      console.log("✅ No permission requirements - allowing access");
      return true;
    }
  
    console.log("❌ No matching permission criteria");
    return false;
  };
  


export function Items({ userDetails }: { userDetails: UserData }) {
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuitemsType[]>(
    []
  );
  const [user, setUser] = useState<UserData>(userDetails);
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const router = useRouter();
  const getActiveRolePermissions = useCallback((userData: UserData): string[] => {
    console.log("Getting active role permissions for:", userData);
    
    // Find active role - handle both boolean and number types
    const activeRole = userData?.roles?.find((role: any) => role.is_active === 1 || role.is_active === true);
    
    console.log("Found active role:", activeRole);
    
    if (!activeRole) {
      console.log("No active role found, checking role structure:");
      console.log("Available roles:", userData?.roles);
      return [];
    }

    console.log("Role permissions structure:", activeRole);
    
    // Handle the actual backend structure from PHP
    if (activeRole.role_permissions && Array.isArray(activeRole.role_permissions)) {
      console.log("Found permissions array directly:", activeRole.role_permissions);
      return activeRole.role_permissions.map((perm: any) => perm.permission_name);
    }
    
    console.log("No permissions found in role structure");
    return [];
  }, []);

  const filterMenuItems = useCallback((
    items: MenuitemsType[],
    activePermissions: string[]
  ): MenuitemsType[] => {
    // Find active role with multiple fallbacks - handle both boolean and number types
    const activeRoleObj = user?.roles?.find((role: any) => role.is_active === 1 || role.is_active === true);
    
    // Extract role name - handle actual backend structure
    const activeRole = activeRoleObj?.role_name ;
    
    console.log("Filtering menu items with:", {
      totalItems: items.length,
      activePermissions,
      activeRole,
      activeRoleObj
    });

    const filteredItems = items.filter((item) => {
      const hasAccess = hasRequiredPermissions(activePermissions, item, activeRole);

      console.log("Menu Access:", {
        item: item.title,
        permissionKey: item.permissionKey,
        requiredPermissions: item.requiredPermissions,
        roles: item.roles,
        activeRole,
        hasAccess,
      });

      return hasAccess;
    });

    console.log(`Filtered ${filteredItems.length} items out of ${items.length} total items`);

    // TEMPORARY FALLBACK: If no items pass the filter, show all items for debugging
    if (filteredItems.length === 0 && items.length > 0) {
      console.warn("🚨 NO ITEMS PASSED PERMISSION CHECK - SHOWING ALL FOR DEBUGGING");
      console.warn("This is a temporary fallback to help debug the issue");
      return items; // Return all items temporarily
    }

    return filteredItems;
  }, [user]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log("=== SIDEBAR DEBUG START ===");
      console.log("User prop received:", user);
      console.log("MenuItems imported:", Menuitems);
      
      if (!user){
        console.warn("No user found");
        router.push("/auth/login");
        return;
      } 

      try {
        // Find active role - handle both boolean and number types
        const activeRole = user.roles?.find((role: any) => role.is_active === 1 || role.is_active === true);
        
        console.log("Active Role eddie:", activeRole);
        console.log("All user roles:", user.roles);
        
        if (!activeRole) {
          console.warn("No active role found for user");
          console.log("Available roles:", user.roles);
          return;
        }

        const activePermissions = getActiveRolePermissions(user);
        console.log("Active Role Permissions:", activePermissions);
        console.log("Active permissions length:", activePermissions.length);

        setUser((prevUser) => ({
          ...prevUser,
          activePermissions,
        }));

        console.log("About to filter menu items...");
        console.log("Menuitems to filter:", Menuitems);
        const filteredItems = filterMenuItems(Menuitems, activePermissions);
        console.log("Filtered Menu Items:", filteredItems);
        console.log("Filtered items length:", filteredItems.length);
        setFilteredMenuItems(filteredItems);
        console.log("=== SIDEBAR DEBUG END ===");
      } catch (error) {
        console.error("Error processing user details:", error);
      }
    };

    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getActiveRolePermissions]); // Intentionally excluding 'filterMenuItems' and 'user' to prevent infinite loops


   // Group items by their group labels
  const groupedItems = filteredMenuItems.reduce((acc, item) => {
    if (item.grouplabel) {
      // If it's a group label, create a new group
      acc.push({
        label: item.grouplabel,
        items: []
      });
    } else if (item.title && acc.length > 0) {
      // If it's a menu item, add it to the last group
      acc[acc.length - 1].items.push(item);
    }
    return acc;
  }, []);

  return (
    <SidebarContent>
      {groupedItems.map((group: any, groupIndex: any) => (
            <SidebarGroup key={`group-${groupIndex}`}>
              {group.label && (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item: any) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          </SidebarContent>
  )
}
