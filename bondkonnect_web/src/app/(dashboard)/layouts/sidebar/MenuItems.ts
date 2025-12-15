import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { uniqueId } from "lodash";
import { TbSquareLetterB,TbMessage } from "react-icons/tb";
import { RiDashboardLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { PiBinocularsLight, PiUpload } from "react-icons/pi";
import { GrSecure, GrUserSettings } from "react-icons/gr";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsClipboard2Pulse } from "react-icons/bs";
import { FcDataSheet } from "react-icons/fc";
import { CiMoneyCheck1, CiViewTable } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { BiTransferAlt } from "react-icons/bi";
import { IoMdFolderOpen, IoMdNotificationsOutline } from "react-icons/io";
import { GoQuestion } from "react-icons/go";
import { PiInvoice } from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import { TbPresentationAnalytics } from "react-icons/tb";
import { AiOutlineAudit } from "react-icons/ai";
import { GrVmMaintenance } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import { FaCommentSms } from "react-icons/fa6";
import { GiArchiveResearch } from "react-icons/gi";
import { ModulePermissions,ActionPermissions, Permission, PermissionKey, MODULE_PERMISSION_REQUIREMENTS, MODULE_DEPENDENCIES } from "@/app/app/config/permissions";
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

// Add permission validation helper
const getRequiredPermissions = (href: string): (ModulePermissions | ActionPermissions)[] => {
  const path = href.split('/').pop() || '';
  const modulePermission = MODULE_PERMISSION_REQUIREMENTS[path];
  if (!modulePermission) return [];

  const actionPermissions = modulePermission ? MODULE_DEPENDENCIES[modulePermission] : [];
  return [modulePermission, ...(actionPermissions || [])];
};

  // Menu items.
const Menuitems: MenuitemsType[] = [
  // {
  //   id: uniqueId(),
  //   header: "BondKonnect",
  //   icon: TbSquareLetterB,
  //   roles: ["sponsor"],
  // },
  {
    id: uniqueId(),
    grouplabel: "Home",
    permissionKey: "DASHBOARD",
    requiredPermissions: getRequiredPermissions('dashboard')
  },
    {
      id: uniqueId(),
      title: "Dashboard",
      href: "/",
      icon: RxDashboard,
      permissionKey: "DASHBOARD",
      requiredPermissions: getRequiredPermissions('dashboard')
    },
    {
      id: uniqueId(),  
      title: "Bond Stats",
      href: "/apps/bond-stats",
      icon: IoStatsChartOutline,
      permissionKey: "BOND_STATS",
      requiredPermissions: getRequiredPermissions('bondstats')
      // children: [
      //   {
      //     id: uniqueId(),
      //     title: "Level 3",
      //     icon: Home,
      //     href: "/l3",
      //   },
      // ]
    },
    //Research Assistant
    {
      id: uniqueId(),
      title: "Research Assistant",
      href: "/apps/research-assistant",
      icon: GiArchiveResearch ,
      permissionKey: "RESEARCH_ASSISTANT",
      requiredPermissions: getRequiredPermissions('research_assistant')
    },
    //Portfolio
    {
      id: uniqueId(),
      grouplabel: "My Portfolio",
      permissionKey: "PORTFOLIO",
      requiredPermissions: getRequiredPermissions('portfolio')
    },  
    {
      id: uniqueId(),  
      title: "Portfolio Assistant",
      href: "/apps/portfolio-assistant",
      icon: BsClipboard2Pulse,
      permissionKey: "PORTFOLIO",
      requiredPermissions: getRequiredPermissions('portfolio')
    },
    {
      id: uniqueId(),  
      title: "Quote Book",
      href: "/apps/quote-book",
      icon: CiViewTable,
      permissionKey: "QUOTES",
      requiredPermissions: getRequiredPermissions('quotes')
    },
    {

      id: uniqueId(),  
      title: "My Transactions",
      href: "/apps/transactions",
      icon: BiTransferAlt,
      permissionKey: "TRANSACTIONS",
      requiredPermissions: getRequiredPermissions('transactions')
    },
    {
      id: uniqueId(),  
      title: "Hub",
      href: "/apps/hub",
      icon: GrVmMaintenance,
      permissionKey: "QUOTES",
      requiredPermissions: getRequiredPermissions('quotes')
    },
    {
      id: uniqueId(),
      grouplabel: "Database",
      permissionKey: "UPLOADS",
      requiredPermissions: getRequiredPermissions('uploads')
    }, 
    {
      id: uniqueId(),  
      title: "Upload Tables",
      href: "/apps/upload",
      icon: PiUpload,
      permissionKey: "UPLOADS",
      requiredPermissions: getRequiredPermissions('uploads')
    },
//DMS
    {
      id: uniqueId(),
      title: "DMS",
      href: "/apps/dms",
      icon: IoMdFolderOpen ,
      // permissionKey: "DMS",
      permissionKey: "UPLOADS",
      // requiredPermissions: getRequiredPermissions('dms')
      requiredPermissions: getRequiredPermissions('uploads')
    },
    //Messaging & Notifications
    {
      id: uniqueId(),
      grouplabel: "Communications",
      permissionKey: "MESSAGES",
      requiredPermissions: getRequiredPermissions('messages')
    }, 
    {
      id: uniqueId(),  
      title: "Messages",
      href: "/apps/messages",
      icon: TbMessage,
      permissionKey: "MESSAGES",
      requiredPermissions: getRequiredPermissions('messages')
    },
    {
      id: uniqueId(),  
      title: "Notifications",
      href: "/apps/notifications",
      icon: IoMdNotificationsOutline,
      permissionKey: "NOTIFICATIONS",
      requiredPermissions: getRequiredPermissions('notifications')
    },   
    {
      id: uniqueId(),  
      title: "Emails",
      href: "/apps/emails",
      icon: IoMailOutline,
      // permissionKey: "EMAILS",
      permissionKey: "NOTIFICATIONS",
      requiredPermissions: getRequiredPermissions('notifications')
    },  
    //SMS
    {
      id: uniqueId(),
      title: "SMS",
      href: "/apps/sms",
      icon: FaCommentSms ,
      // permissionKey: "SMS",
      permissionKey: "NOTIFICATIONS",
      requiredPermissions: getRequiredPermissions('notifications')
    },
    //Settings
    {
      id: uniqueId(),
      grouplabel: "Settings",
      permissionKey: "ACCOUNT",
      requiredPermissions: getRequiredPermissions('account')
    }, 
    {
      id: uniqueId(),  
      title: "Account",
      href: "/apps/account",
      icon: Settings,
      permissionKey: "ACCOUNT",
      requiredPermissions: getRequiredPermissions('account')
    },
    //Help & Support
    {
      id: uniqueId(),
      grouplabel: "Help & Support",
      permissionKey: "HELP",
      requiredPermissions: getRequiredPermissions('help')
    }, 
    //glossary
    {
      id: uniqueId(),
      title: "Glossary",
      href: "/apps/glossary",
      icon: PiBinocularsLight ,
      permissionKey: "HELP", //Change
      requiredPermissions: getRequiredPermissions('help')
    },
    {
      id: uniqueId(),
      title: "Help",
      href: "/apps/help",
      icon: TbSquareLetterB,
      permissionKey: "HELP",
      requiredPermissions: getRequiredPermissions('help')
    },
    {
      id: uniqueId(),
      title: "FAQ",
      href: "/apps/faq",
      icon: GoQuestion,
      permissionKey: "FAQ",
      requiredPermissions: getRequiredPermissions('faq')
    },
    //Subscriptions
    {
      id: uniqueId(),
      grouplabel: "Subscriptions",
      permissionKey: "SUBSCRIPTIONS",
      requiredPermissions: getRequiredPermissions('subscriptions')
    }, 
    {
      id: uniqueId(),  
      title: "Subscription",
      href: "/apps/subscriptions",
      icon: FiShoppingBag,
      permissionKey: "SUBSCRIPTIONS",
      requiredPermissions: getRequiredPermissions('subscriptions')
    },
//financials
    {
      id: uniqueId(),
      grouplabel: "Financials",
      permissionKey: "FINANCIALS",
      requiredPermissions: getRequiredPermissions('financials')
    }, 
    {
      id: uniqueId(),  
      title: "Financials",
      href: "/apps/financials",
      icon: MdAccountBalance,
      permissionKey: "FINANCIALS",
      requiredPermissions: getRequiredPermissions('financials')
    },

    {
      id: uniqueId(),  
      title: "Invoices",
      href: "/apps/invoices",
      icon: PiInvoice,
      permissionKey: "INVOICES",
      requiredPermissions: getRequiredPermissions('invoices')
    },
//billing
    {
      id: uniqueId(),
      title: "Billing",
      href: "/apps/billing",
      icon: CiMoneyCheck1 ,
      // permissionKey: "BILLING",
      permissionKey: "FINANCIALS",
      // requiredPermissions: getRequiredPermissions('billing')
      requiredPermissions: getRequiredPermissions('financials')
    },
    //Admin
    {
      id: uniqueId(),
      grouplabel: "Admin",
      permissionKey: "ADMIN_PANEL",
      requiredPermissions: getRequiredPermissions('admin_panel')
    }, 
    {
      id: uniqueId(),  
      title: "Manage Users",
      href: "/apps/manage-users",
      icon: GrUserSettings,
      permissionKey: "ADMIN_PANEL",
      requiredPermissions: getRequiredPermissions('admin_panel')
    },
    {
      id: uniqueId(),  
      title: "Permissions Mapping",
      href: "/apps/permissions",
      icon: GrSecure,
      permissionKey: "ADMIN_PANEL",
      requiredPermissions: getRequiredPermissions('admin_panel')
    },
    //ACTIVITY_LOGS
    {
      id: uniqueId(),
      title: "Activity Logs",
      href: "/apps/activity-logs",
      icon: AiOutlineAudit,
      permissionKey: "ACTIVITY_LOGS",
      requiredPermissions: getRequiredPermissions('activity_logs')
    },     
    {
      id: uniqueId(),  
      title: "Analysis",
      href: "/apps/analysis",
      icon: TbPresentationAnalytics,
      permissionKey: "ANALYSIS",  
      requiredPermissions: getRequiredPermissions('analysis')
    },

  ]
  
  export default Menuitems;