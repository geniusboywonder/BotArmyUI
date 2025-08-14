import { Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Settings({ 
  darkMode, 
  onToggleDarkMode, 
  sidebarCollapsed, 
  onToggleSidebar 
}: SettingsProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sliders className="w-6 h-6" />
        Settings
      </h2>
      
      <div className="max-w-2xl space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-collapsed">Sidebar Collapsed</Label>
              <Switch
                id="sidebar-collapsed"
                checked={sidebarCollapsed}
                onCheckedChange={onToggleSidebar}
                data-testid="switch-sidebar-collapsed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="agent-status">Agent Status Changes</Label>
              <Switch
                id="agent-status"
                defaultChecked={true}
                data-testid="switch-agent-notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-completions">Task Completions</Label>
              <Switch
                id="task-completions"
                defaultChecked={true}
                data-testid="switch-task-notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-errors">System Errors</Label>
              <Switch
                id="system-errors"
                defaultChecked={true}
                data-testid="switch-error-notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="update-interval">Update Interval (seconds)</Label>
              <Input
                id="update-interval"
                type="number"
                defaultValue="3"
                className="mt-2"
                data-testid="input-update-interval"
              />
            </div>
            <div>
              <Label htmlFor="log-level">Log Level</Label>
              <Select defaultValue="info">
                <SelectTrigger className="mt-2" data-testid="select-log-level">
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
