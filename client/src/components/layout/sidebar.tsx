import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  ClipboardList, 
  Terminal, 
  Archive, 
  Sliders,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { name: 'Dashboard', icon: Home, id: '/', path: '/' },
  { name: 'Tasks', icon: ClipboardList, id: 'tasks', path: '/tasks' },
  { name: 'Logs', icon: Terminal, id: 'logs', path: '/logs' },
  { name: 'Artifacts', icon: Archive, id: 'artifacts', path: '/artifacts' },
  { name: 'Settings', icon: Sliders, id: 'settings', path: '/settings' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, mobileOpen]);

  const sidebarClasses = cn(
    "bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 h-full",
    isMobile ? (
      cn(
        "fixed z-40 -translate-x-full",
        mobileOpen && "translate-x-0",
        "w-64"
      )
    ) : (
      cn(
        "relative",
        collapsed ? "w-16" : "w-64"
      )
    )
  );

  const handleNavClick = () => {
    if (isMobile && mobileOpen) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMobileClose}
          data-testid="overlay-sidebar"
        />
      )}
      
      <aside className={sidebarClasses}>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(item => {
              const isActive = location === item.path;
              return (
                <li key={item.id}>
                  <Link 
                    href={item.path}
                    onClick={handleNavClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group",
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    data-testid={`link-nav-${item.id}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {(!collapsed || isMobile) && (
                      <span className="sidebar-text">{item.name}</span>
                    )}
                    {collapsed && !isMobile && (
                      <div className="fixed left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded pointer-events-none opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {!isMobile && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={onToggle}
              className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              data-testid="button-sidebar-collapse"
            >
              <ChevronLeft className={cn(
                "w-4 h-4 transition-transform",
                collapsed && "rotate-180"
              )} />
              {!collapsed && <span>Collapse</span>}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
