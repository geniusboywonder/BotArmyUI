import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, User, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  agentCount: number;
  systemStatus: 'running' | 'error';
}

export function Header({ 
  darkMode, 
  onToggleDarkMode, 
  sidebarCollapsed, 
  onToggleSidebar,
  agentCount,
  systemStatus 
}: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="gradient-bg text-white p-4 shadow-lg flex items-center justify-between relative z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-700 text-white"
          data-testid="button-sidebar-toggle"
        >
          {isMobile ? (
            <Menu className="w-5 h-5" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Agent Manager
        </h1>
        <div className="flex gap-3 text-sm opacity-90">
          <span className="flex items-center gap-1" data-testid="text-system-status">
            <div className={`w-3 h-3 rounded-full status-pulse ${
              systemStatus === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`} />
            <span>{systemStatus === 'error' ? 'Errors' : 'Running'}</span>
          </span>
          <span className="flex items-center gap-1" data-testid="text-agent-count">
            <Users className="w-4 h-4" />
            <span>{agentCount} Agents</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="p-2 hover:bg-slate-700 text-white"
          title="Toggle dark mode"
          data-testid="button-dark-mode-toggle"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
