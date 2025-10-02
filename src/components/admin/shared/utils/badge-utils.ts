export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';

export interface BadgeConfig {
  variant: BadgeVariant;
  color: BadgeColor;
  text: string;
  className: string;
}

export class BadgeUtils {
  static getRoleBadgeConfig(role: string): BadgeConfig {
    const roleConfigs: Record<string, BadgeConfig> = {
      admin: {
        variant: 'default',
        color: 'red',
        text: 'Admin',
        className: 'bg-red-100 text-red-800'
      },
      hr_admin: {
        variant: 'default',
        color: 'purple',
        text: 'HR Admin',
        className: 'bg-purple-100 text-purple-800'
      },
      plant_manager: {
        variant: 'default',
        color: 'blue',
        text: 'Plant Manager',
        className: 'bg-blue-100 text-blue-800'
      },
      dev_admin: {
        variant: 'default',
        color: 'red',
        text: 'Dev Admin',
        className: 'bg-red-100 text-red-800'
      },
      employee: {
        variant: 'default',
        color: 'gray',
        text: 'Employee',
        className: 'bg-gray-100 text-gray-800'
      },
      instructor: {
        variant: 'default',
        color: 'blue',
        text: 'Instructor',
        className: 'bg-blue-100 text-blue-800'
      },
      user: {
        variant: 'default',
        color: 'green',
        text: 'User',
        className: 'bg-green-100 text-green-800'
      }
    };
    
    return roleConfigs[role] || {
      variant: 'outline',
      color: 'gray',
      text: role.replace('_', ' ').toUpperCase(),
      className: 'bg-gray-100 text-gray-800'
    };
  }

  static getStatusBadgeConfig(status: string): BadgeConfig {
    const statusConfigs: Record<string, BadgeConfig> = {
      active: {
        variant: 'default',
        color: 'green',
        text: 'Active',
        className: 'bg-green-100 text-green-800'
      },
      inactive: {
        variant: 'secondary',
        color: 'gray',
        text: 'Inactive',
        className: 'bg-gray-100 text-gray-800'
      },
      pending: {
        variant: 'default',
        color: 'yellow',
        text: 'Pending',
        className: 'bg-yellow-100 text-yellow-800'
      },
      enrolled: {
        variant: 'default',
        color: 'blue',
        text: 'Enrolled',
        className: 'bg-blue-100 text-blue-800'
      },
      in_progress: {
        variant: 'default',
        color: 'yellow',
        text: 'In Progress',
        className: 'bg-yellow-100 text-yellow-800'
      },
      completed: {
        variant: 'default',
        color: 'green',
        text: 'Completed',
        className: 'bg-green-100 text-green-800'
      },
      cancelled: {
        variant: 'destructive',
        color: 'red',
        text: 'Cancelled',
        className: 'bg-red-100 text-red-800'
      },
      suspended: {
        variant: 'destructive',
        color: 'red',
        text: 'Suspended',
        className: 'bg-red-100 text-red-800'
      }
    };
    
    return statusConfigs[status] || {
      variant: 'outline',
      color: 'gray',
      text: status.replace('_', ' ').toUpperCase(),
      className: 'bg-gray-100 text-gray-800'
    };
  }

  static getPriorityBadgeConfig(priority: string): BadgeConfig {
    const priorityConfigs: Record<string, BadgeConfig> = {
      high: {
        variant: 'destructive',
        color: 'red',
        text: 'High',
        className: 'bg-red-100 text-red-800'
      },
      medium: {
        variant: 'default',
        color: 'yellow',
        text: 'Medium',
        className: 'bg-yellow-100 text-yellow-800'
      },
      low: {
        variant: 'secondary',
        color: 'green',
        text: 'Low',
        className: 'bg-green-100 text-green-800'
      }
    };
    
    return priorityConfigs[priority] || {
      variant: 'outline',
      color: 'gray',
      text: priority,
      className: 'bg-gray-100 text-gray-800'
    };
  }

  static getDepartmentBadgeConfig(department: string): BadgeConfig {
    const departmentConfigs: Record<string, BadgeConfig> = {
      safety: {
        variant: 'default',
        color: 'blue',
        text: 'Safety',
        className: 'bg-blue-100 text-blue-800'
      },
      operations: {
        variant: 'default',
        color: 'green',
        text: 'Operations',
        className: 'bg-green-100 text-green-800'
      },
      maintenance: {
        variant: 'default',
        color: 'yellow',
        text: 'Maintenance',
        className: 'bg-yellow-100 text-yellow-800'
      },
      management: {
        variant: 'default',
        color: 'purple',
        text: 'Management',
        className: 'bg-purple-100 text-purple-800'
      },
      hr: {
        variant: 'default',
        color: 'purple',
        text: 'HR',
        className: 'bg-purple-100 text-purple-800'
      },
      it: {
        variant: 'default',
        color: 'blue',
        text: 'IT',
        className: 'bg-blue-100 text-blue-800'
      }
    };
    
    return departmentConfigs[department] || {
      variant: 'outline',
      color: 'gray',
      text: department,
      className: 'bg-gray-100 text-gray-800'
    };
  }

  static getDifficultyBadgeConfig(difficulty: string): BadgeConfig {
    const difficultyConfigs: Record<string, BadgeConfig> = {
      beginner: {
        variant: 'default',
        color: 'green',
        text: 'Beginner',
        className: 'bg-green-100 text-green-700 border-green-200'
      },
      intermediate: {
        variant: 'default',
        color: 'yellow',
        text: 'Intermediate',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      },
      advanced: {
        variant: 'default',
        color: 'red',
        text: 'Advanced',
        className: 'bg-red-100 text-red-700 border-red-200'
      }
    };
    
    return difficultyConfigs[difficulty] || {
      variant: 'outline',
      color: 'gray',
      text: difficulty,
      className: 'bg-gray-100 text-gray-700 border-gray-200'
    };
  }
}
