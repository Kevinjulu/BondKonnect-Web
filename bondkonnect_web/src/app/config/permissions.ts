export enum ModulePermissions {
    BOND_SCREENS = "CanAccessBondscreens",
    BOND_STATS = "CanAccessBondStats",
    RESEARCH_ASSISTANT = "CanAccessResearchAssistant",
    PORTFOLIO = "CanManagePortfolio",
    QUOTES = "CanManageQuotes",
    TRANSACTIONS = "CanManageTransactions",
    MESSAGES = "CanAccessMessages",
    ACCOUNT_SETTINGS = "CanUpdateAccountSettings", //for general users
    NOTIFICATIONS = "CanReceiveNotifications",
    UPLOADS = "CanManageUploads",
    SUBSCRIPTIONS = "CanAccessSubscriptions",
    ACCOUNT_MANAGEMENT = "CanManageAccounts",//for admin
    HELP = "CanAccessHelp",
    FAQ = "CanAccessFAQ",
    ACTIVITY_LOGS = "CanAccessActivityLogs",
    ADMIN_PANEL = "CanAccessAdmin",
    ANALYSIS = "CanAccessAnalysis",
    INVOICES = "CanAccessInvoices",
    FINANCIALS = "CanAccessFinancials"
}

export enum ActionPermissions {
    // Bonds & Transactions

    //Bond Screens
    ACCESS_BOND_CALC = "CanAccessBondCalc",
    VIEW_YIELD_GRAPHS = "CanViewYieldGraphs",
    ACCESS_DURATION_SCREEN = "CanAccessDurationScreen",
    ACCESS_RETURN_SCREEN = "CanAccessReturnScreen",
    ACCESS_BARBELL_SCREEN = "CanAccessBarbellScreen",

    //Bond Stats
    VIEW_BOND_STATS = "CanViewBondStats",
    ACCESS_RISK_METRICS = "CanAccessRiskMetrics",

    //Research Assistant
    ACCESS_RESEARCH_ASSISTANT = "CanAccessResearchAssistantTools",

    //Messages
    SUBMIT_MESSAGE = "CanSubmitMessage",
    APPROVE_INTERMEDIARY = "CanApproveIntermediary",
    // Portfolio
    GENERATE_QUOTE = "CanGenerateQuote",
    ACCESS_PORTFOLIO_NOTEPAD = "CanAccessPortfolioNotepad",
    ACCESS_PROFIT_AND_LOSS = "CanAccessProfitAndLoss",
    ACCESS_PORTFOLIO_SCORECARD = "CanAccessPortfolioScorecard",
    ACCESS_RISK_PROFILE = "CanAccessRiskProfile",
    ACCESS_STRESS_TESTING = "CanAccessStressTesting",
    VIEW_FACE_VALUE = "CanViewFaceValue",

    // Quotes
    SUBMIT_BID = "CanSubmitBid",
    ACCESS_MY_TRANSACTIONS = "CanAccessMyTransactions",
    ACCESS_ALL_TRANSACTIONS = "CanAccessAllTransactions",
    // Transactions
    APPROVE_QUOTE = "CanApproveQuote",
    REJECT_QUOTE = "CanRejectQuote",
    DELEGATE_QUOTE = "CanDelegateQuote",


    // User Management
    CREATE_USER = "CanCreateUserAccount",
    VIEW_USERS = "CanViewUserAccounts",
    RESET_PASSWORD = "CanResetPassword",
    DELETE_USER = "CanDeleteUserAccount",

    // Subscriptions
    CREATE_SUBSCRIPTION = "CanCreateSubscriptionPackage",
    PURCHASE_SUBSCRIPTION = "CanPurchaseSubscription",

    //Invoices
    ACCESS_INVOICES = "CanViewInvoices",

    //Analysis
    ACCESS_ANALYSIS = "CanViewAnalysis",

    //Financial
    ACCESS_FINANCIALS = "CanViewFinancials"
}

export type Permission = ModulePermissions | ActionPermissions;

export const permissionMap = {
    DASHBOARD: ["CanAccessBondscreens", "CanAccessBondCalc","CanViewYieldGraphs", "CanAccessDurationScreen", "CanAccessReturnScreen", "CanAccessBarbellScreen"],
    RESEARCH_ASSISTANT: ["CanAccessResearchAssistant","CanAccessResearchAssistantTools"],
    BOND_STATS: ["CanAccessBondStats", "CanViewBondStats", "CanAccessRiskMetrics"],
    PORTFOLIO: ["CanManagePortfolio", "CanGenerateQuote", "CanAccessPortfolioNotepad", "CanAccessProfitAndLoss", "CanAccessPortfolioScorecard", "CanAccessRiskProfile", "CanAccessStressTesting", "CanViewFaceValue"],
    QUOTES: ["CanManageQuotes", "CanSubmitBid","CanAccessMyTransactions","CanAccessAllTransactions"], 
    TRANSACTIONS: ["CanManageTransactions","CanApproveQuote", "CanRejectQuote", "CanDelegateQuote"],
    MESSAGES: ["CanAccessMessages", "CanSubmitMessage","CanApproveIntermediary"],
    ACCOUNT: ["CanUpdateAccountSettings", ],
    INVOICES: ["CanAccessInvoices","CanViewInvoices"],
    ANALYSIS: ["CanAccessAnalysis","CanViewAnalysis"],
    NOTIFICATIONS: ["CanReceiveNotifications"],
    UPLOADS: ["CanManageUploads"],
    SUBSCRIPTIONS: ["CanAccessSubscriptions", "CanPurchaseSubscription", "CanCreateSubscriptionPackage"],
    ACCOUNT_MANAGEMENT: ["CanManageAccounts", "CanViewUserAccounts","CanCreateUserAccount","CanResetPassword", "CanDeleteUserAccount"],
    ADMIN_PANEL: ["CanAccessAdmin", ],
    HELP: ["CanAccessHelp", ],
    FAQ: ["CanAccessFAQ"],
    ACTIVITY_LOGS: ["CanAccessActivityLogs"],
    FINANCIALS: ["CanAccessFinancials","CanViewFinancials"]

} as const;

export const PERMISSIONS = {
    DASHBOARD: {
        key: 'dashboard',
        permissions: ['CanAccessBondscreens', 'CanAccessBondCalc', 'CanViewYieldGraphs', 'CanAccessDurationScreen', 'CanAccessReturnScreen', 'CanAccessBarbellScreen']
    },
    BOND_STATS: {
        key: 'bondstats',
        permissions: ['CanAccessBondStats', 'CanViewBondStats', 'CanAccessRiskMetrics']
    },
    RESEARCH_ASSISTANT: {
        key: 'research_assistant',
        permissions: ['CanAccessResearchAssistant','CanAccessResearchAssistantTools']
    },
    PORTFOLIO: {
        key: 'portfolio',
        permissions: ['CanManagePortfolio', 'CanGenerateQuote', 'CanAccessPortfolioNotepad', 'CanAccessProfitAndLoss', 'CanAccessPortfolioScorecard', 'CanAccessRiskProfile', 'CanAccessStressTesting', 'CanViewFaceValue']
    },
    QUOTES: {
        key: 'quotes',
        permissions: ['CanManageQuotes', 'CanSubmitBid', 'CanAccessMyTransactions', 'CanAccessAllTransactions']
    },
    TRANSACTIONS: {
        key: 'transactions',
        permissions: ['CanManageTransactions', 'CanApproveQuote', 'CanRejectQuote', 'CanDelegateQuote']
    },
    MESSAGES: {
        key: 'messages',
        permissions: ['CanAccessMessages', 'CanSubmitMessage', 'CanApproveIntermediary']
    },
    ACCOUNT: {
        key: 'account',
        permissions: ['CanUpdateAccountSettings']
    },
    INVOICES: {
        key: 'invoices',
        permissions: ['CanAccessInvoices','CanViewInvoices']
    },
    ANALYSIS: {
        key: 'analysis',
        permissions: ['CanAccessAnalysis','CanViewAnalysis']
    },
    NOTIFICATIONS: {
        key: 'notifications',
        permissions: ['CanReceiveNotifications']
    },
    UPLOADS: {
        key: 'uploads',
        permissions: ['CanManageUploads']
    },
    SUBSCRIPTIONS: {
        key: 'subscriptions',
        permissions: ['CanAccessSubscriptions', 'CanPurchaseSubscription', 'CanCreateSubscriptionPackage']
    },
    ACCOUNT_MANAGEMENT: {
        key: 'account_management',
        permissions: ['CanManageAccounts', 'CanViewUserAccounts', 'CanCreateUserAccount', 'CanResetPassword', 'CanDeleteUserAccount']
    },
    ADMIN_PANEL: {
        key: 'admin_panel',
        permissions: ['CanAccessAdmin']
    },
    HELP: {
        key: 'help',
        permissions: ['CanAccessHelp']
    },
    FAQ: {
        key: 'faq',
        permissions: ['CanAccessFAQ']
    },
    ACTIVITY_LOGS: {
        key: 'activity_logs',
        permissions: ['CanAccessActivityLogs']
    },
    FINANCIALS: {
        key: 'financials',
        permissions: ['CanAccessFinancials','CanViewFinancials']
    }
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
    individual: [
        'DASHBOARD',
        'RESEARCH_ASSISTANT',
        'PORTFOLIO',
        'QUOTES',
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'HELP',
        'FAQ',
        
    ],
    agent: [
        'DASHBOARD',
        'RESEARCH_ASSISTANT',
        'PORTFOLIO',
        'QUOTES',
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'HELP',
        'FAQ',
    ],
    broker: [
        'DASHBOARD',
        'RESEARCH_ASSISTANT',
        'PORTFOLIO',
        'QUOTES',
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'HELP',
        'FAQ',
    ],
    authorizeddealer: [
        'DASHBOARD',
        'PORTFOLIO',
        'QUOTES',
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'HELP',
        'FAQ',
    ],
    corporate: [
        'DASHBOARD',
        'RESEARCH_ASSISTANT',
        'PORTFOLIO',
        'QUOTES',
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'HELP',
        'FAQ',
    ],
    admin: [
        'DASHBOARD',
        'RESEARCH_ASSISTANT',
        'BOND_STATS',
        'PORTFOLIO',
        'QUOTES', 
        'TRANSACTIONS',
        'MESSAGES',
        'ACCOUNT',
        'ACCOUNT_MANAGEMENT',
        'NOTIFICATIONS',
        'UPLOADS',
        'SUBSCRIPTIONS',
        'ADMIN_PANEL',
        'HELP',
        'FAQ',
        'ACTIVITY_LOGS',
        'INVOICES',
        'ANALYSIS',
        'FINANCIALS'
    ]
} as const;

export const MODULE_PERMISSION_REQUIREMENTS: Record<string, ModulePermissions> = {
    'dashboard': ModulePermissions.BOND_SCREENS,
    'research_assistant': ModulePermissions.RESEARCH_ASSISTANT,
    'bondstats': ModulePermissions.BOND_STATS,
    'portfolio': ModulePermissions.PORTFOLIO,
    'quotes': ModulePermissions.QUOTES,
    'transactions': ModulePermissions.TRANSACTIONS,
    'messages': ModulePermissions.MESSAGES,
    'account': ModulePermissions.ACCOUNT_SETTINGS,
    'account_management': ModulePermissions.ACCOUNT_MANAGEMENT,
    'notifications': ModulePermissions.NOTIFICATIONS,
    'uploads': ModulePermissions.UPLOADS,
    'subscriptions': ModulePermissions.SUBSCRIPTIONS,
    'admin_panel': ModulePermissions.ADMIN_PANEL,
    'help': ModulePermissions.HELP,
    'faq': ModulePermissions.FAQ,
    'activity_logs': ModulePermissions.ACTIVITY_LOGS,
    'invoices': ModulePermissions.INVOICES,
    'analysis': ModulePermissions.ANALYSIS,
    'financials': ModulePermissions.FINANCIALS
};

export const MODULE_DEPENDENCIES: Record<ModulePermissions, ActionPermissions[]> = {
    [ModulePermissions.BOND_SCREENS]: [
        ActionPermissions.ACCESS_BOND_CALC,
        ActionPermissions.VIEW_YIELD_GRAPHS,
        ActionPermissions.ACCESS_DURATION_SCREEN,
        ActionPermissions.ACCESS_RETURN_SCREEN,
        ActionPermissions.ACCESS_BARBELL_SCREEN
    ],
    [ModulePermissions.BOND_STATS]: [
        ActionPermissions.VIEW_BOND_STATS,
        ActionPermissions.ACCESS_RISK_METRICS
    ],
    [ModulePermissions.RESEARCH_ASSISTANT]: [
        ActionPermissions.ACCESS_RESEARCH_ASSISTANT
    ],
    [ModulePermissions.PORTFOLIO]: [
        ActionPermissions.GENERATE_QUOTE,
        ActionPermissions.ACCESS_PORTFOLIO_NOTEPAD,
        ActionPermissions.ACCESS_PROFIT_AND_LOSS,
        ActionPermissions.ACCESS_PORTFOLIO_SCORECARD,
        ActionPermissions.ACCESS_RISK_PROFILE,
        ActionPermissions.ACCESS_STRESS_TESTING,
        ActionPermissions.VIEW_FACE_VALUE
    ],
    [ModulePermissions.QUOTES]: [
        ActionPermissions.SUBMIT_BID,
        ActionPermissions.ACCESS_MY_TRANSACTIONS,
        ActionPermissions.ACCESS_ALL_TRANSACTIONS
    ],
    [ModulePermissions.TRANSACTIONS]: [
        ActionPermissions.APPROVE_QUOTE,
        ActionPermissions.REJECT_QUOTE,
        ActionPermissions.DELEGATE_QUOTE
    ],
    [ModulePermissions.MESSAGES]: [
        ActionPermissions.SUBMIT_MESSAGE,
        ActionPermissions.APPROVE_INTERMEDIARY
    ],
    [ModulePermissions.ACCOUNT_SETTINGS]: [],
    [ModulePermissions.ACCOUNT_MANAGEMENT]: [
        ActionPermissions.CREATE_USER,
        ActionPermissions.VIEW_USERS,
        ActionPermissions.RESET_PASSWORD,
        ActionPermissions.DELETE_USER
    ],
    [ModulePermissions.NOTIFICATIONS]: [],
    [ModulePermissions.UPLOADS]: [],
    [ModulePermissions.SUBSCRIPTIONS]: [
        ActionPermissions.CREATE_SUBSCRIPTION,
        ActionPermissions.PURCHASE_SUBSCRIPTION
    ],
    [ModulePermissions.ADMIN_PANEL]: [],
    [ModulePermissions.HELP]: [],
    [ModulePermissions.FAQ]: [],
    [ModulePermissions.ACTIVITY_LOGS]: [],
    [ModulePermissions.INVOICES]: [
        ActionPermissions.ACCESS_INVOICES
    ],
    [ModulePermissions.ANALYSIS]: [
        ActionPermissions.ACCESS_ANALYSIS
    ],
    [ModulePermissions.FINANCIALS]: [
        ActionPermissions.ACCESS_FINANCIALS
    ]
};

export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
    // Module Permissions
    [ModulePermissions.BOND_SCREENS]: "Access bond screens and trading data",
    [ModulePermissions.RESEARCH_ASSISTANT]: "Access research assistant tools",
    [ModulePermissions.BOND_STATS]: "View bond market statistics",
    [ModulePermissions.PORTFOLIO]: "Manage investment portfolios",
    [ModulePermissions.QUOTES]: "Create and manage bond quotes",
    [ModulePermissions.TRANSACTIONS]: "Handle financial transactions",
    [ModulePermissions.MESSAGES]: "Access and manage messages",
    [ModulePermissions.ACCOUNT_SETTINGS]: "Update account settings",
    [ModulePermissions.ACCOUNT_MANAGEMENT]: "Manage user accounts",
    [ModulePermissions.NOTIFICATIONS]: "Receive system notifications",
    [ModulePermissions.UPLOADS]: "Manage file uploads",
    [ModulePermissions.SUBSCRIPTIONS]: "Access subscription features",
    [ModulePermissions.ADMIN_PANEL]: "Access administrative features",
    [ModulePermissions.HELP]: "Access help resources",
    [ModulePermissions.FAQ]: "Access FAQ section",
    [ModulePermissions.ACTIVITY_LOGS]: "View activity logs",
    [ModulePermissions.INVOICES]: "Access invoices",
    [ModulePermissions.ANALYSIS]: "Access analysis features",
    [ModulePermissions.FINANCIALS]: "Access financial reports",

    // Action Permissions
    [ActionPermissions.ACCESS_BOND_CALC]: "Access bond calculator tools",
    [ActionPermissions.VIEW_YIELD_GRAPHS]: "View yield graphs",
    [ActionPermissions.ACCESS_DURATION_SCREEN]: "Access duration screen",
    [ActionPermissions.ACCESS_RETURN_SCREEN]: "Access return screen",
    [ActionPermissions.ACCESS_BARBELL_SCREEN]: "Access barbell screen",
    [ActionPermissions.ACCESS_RESEARCH_ASSISTANT]: "Access research assistant tools",
    [ActionPermissions.VIEW_BOND_STATS]: "View bond statistics",
    [ActionPermissions.ACCESS_RISK_METRICS]: "Access risk metrics",
    [ActionPermissions.SUBMIT_MESSAGE]: "Send messages in the system",
    [ActionPermissions.APPROVE_INTERMEDIARY]: "Approve intermediary requests",
    [ActionPermissions.GENERATE_QUOTE]: "Create new bond quotes",
    [ActionPermissions.ACCESS_PORTFOLIO_NOTEPAD]: "Access portfolio notepad",
    [ActionPermissions.ACCESS_PROFIT_AND_LOSS]: "Access profit and loss",
    [ActionPermissions.ACCESS_PORTFOLIO_SCORECARD]: "Access portfolio scorecard",
    [ActionPermissions.ACCESS_RISK_PROFILE]: "Access risk profile",
    [ActionPermissions.ACCESS_STRESS_TESTING]: "Access stress testing",
    [ActionPermissions.VIEW_FACE_VALUE]: "View face value",
    [ActionPermissions.SUBMIT_BID]: "Submit bids on bonds",
    [ActionPermissions.ACCESS_MY_TRANSACTIONS]: "Access my transactions",
    [ActionPermissions.ACCESS_ALL_TRANSACTIONS]: "Access all transactions",
    [ActionPermissions.APPROVE_QUOTE]: "Approve pending quotes",
    [ActionPermissions.REJECT_QUOTE]: "Reject submitted quotes",
    [ActionPermissions.DELEGATE_QUOTE]: "Delegate quotes to other users",
    [ActionPermissions.CREATE_USER]: "Create new user accounts",
    [ActionPermissions.VIEW_USERS]: "View user account details",
    [ActionPermissions.RESET_PASSWORD]: "Reset user passwords",
    [ActionPermissions.DELETE_USER]: "Delete user accounts",
    [ActionPermissions.CREATE_SUBSCRIPTION]: "Create new subscription plans",
    [ActionPermissions.PURCHASE_SUBSCRIPTION]: "Purchase available subscriptions",
    [ActionPermissions.ACCESS_INVOICES]: "View invoices",
    [ActionPermissions.ACCESS_ANALYSIS]: "Access analysis tools",
    [ActionPermissions.ACCESS_FINANCIALS]: "Access financial reports"
};
