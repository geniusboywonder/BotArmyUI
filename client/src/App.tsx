import { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import Dashboard from '@/pages/dashboard';
import Tasks from '@/pages/tasks';
import Logs from '@/pages/logs';
import Artifacts from '@/pages/artifacts';
import Settings from '@/pages/settings';
import NotFound from "@/pages/not-found";
import { useAgentSimulation } from '@/hooks/use-agent-simulation';

function Router() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const { agents } = useAgentSimulation();

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Handle sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => setMobileOpen(false);

  // Determine system status based on agents
  const systemStatus = agents.some(agent => agent.status === 'error') ? 'error' : 'running';

  return (
    <div className="flex flex-col h-screen">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        agentCount={agents.length}
        systemStatus={systemStatus}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          mobileOpen={mobileOpen}
          onMobileClose={closeMobileSidebar}
        />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/logs" component={Logs} />
            <Route path="/artifacts" component={Artifacts} />
            <Route path="/settings">
              <Settings
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={toggleSidebar}
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
