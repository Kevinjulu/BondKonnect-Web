import { describe, it, expect } from 'vitest';
import { hasRequiredPermissions, ModulePermissions, ActionPermissions, MenuitemsType } from '../permissions';

describe('hasRequiredPermissions', () => {
  it('should grant access to admin regardless of permissions', () => {
    const item: MenuitemsType = { title: 'Admin Page', roles: ['admin'] };
    expect(hasRequiredPermissions([], item, 'admin')).toBe(true);
  });

  it('should deny access if user has no permissions', () => {
    const item: MenuitemsType = { title: 'Protected Page', permissionKey: 'DASHBOARD' };
    expect(hasRequiredPermissions([], item, 'individual')).toBe(false);
  });

  it('should grant access if user has the required module permission', () => {
    const item: MenuitemsType = { 
      title: 'Dashboard', 
      requiredPermissions: [ModulePermissions.BOND_SCREENS] 
    };
    expect(hasRequiredPermissions([ModulePermissions.BOND_SCREENS], item, 'individual')).toBe(true);
  });

  it('should deny access if user lacks the required module permission', () => {
    const item: MenuitemsType = { 
      title: 'Dashboard', 
      requiredPermissions: [ModulePermissions.BOND_SCREENS] 
    };
    expect(hasRequiredPermissions([ModulePermissions.BOND_STATS], item, 'individual')).toBe(false);
  });

  it('should grant access if user has at least one required action permission', () => {
    const item: MenuitemsType = { 
      title: 'Bond Calc', 
      requiredPermissions: [ModulePermissions.BOND_SCREENS, ActionPermissions.ACCESS_BOND_CALC] 
    };
    // User has module permission AND the specific action permission
    expect(hasRequiredPermissions([ModulePermissions.BOND_SCREENS, ActionPermissions.ACCESS_BOND_CALC], item, 'individual')).toBe(true);
  });

  it('should grant access if no permission requirements are specified', () => {
    const item: MenuitemsType = { title: 'Public Page' };
    expect(hasRequiredPermissions([], item, 'individual')).toBe(true);
  });

  it('should respect role restrictions', () => {
    const item: MenuitemsType = { title: 'Sponsor Only', roles: ['sponsor'] };
    expect(hasRequiredPermissions([], item, 'individual')).toBe(false);
  });
});
