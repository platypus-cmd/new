
import React from 'react';
import { LayoutDashboard, FileText, GraduationCap, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const SidebarNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FileText, label: 'Tasks', href: '/tasks' },
    { icon: GraduationCap, label: 'Subjects', href: '/subjects' },
    { icon: LineChart, label: 'Progress', href: '/progress' },
  ];

  return (
    <div className="w-full space-y-4 pt-4">
      {navItems.map((item) => {
        const isActive = currentPath === item.href || 
          (item.href === '/' && currentPath === '/') ||
          (item.href === '/progress' && currentPath === '/dashboard');
          
        return (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sidebar-foreground hover:bg-white/50 transition-colors rounded-lg mx-2",
              isActive && "bg-white shadow-sm"
            )}
          >
            <item.icon size={20} className="text-gray-600" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarNav;
