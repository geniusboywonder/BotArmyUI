import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { Agent, getStatusColor, getRoleColor } from '@/lib/agent-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: Agent;
  onToggleExpand: (id: number) => void;
}

export function AgentCard({ agent, onToggleExpand }: AgentCardProps) {
  const formatTime = (date: Date) => date.toLocaleTimeString();

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} ${
              agent.status === 'working' ? 'status-pulse' : ''
            }`} />
            <h3 className="font-semibold" data-testid={`text-agent-name-${agent.id}`}>
              Agent {agent.id}
            </h3>
            <span className={`text-sm ${getRoleColor(agent.role)}`} data-testid={`text-agent-role-${agent.id}`}>
              {agent.role}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpand(agent.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            data-testid={`button-expand-agent-${agent.id}`}
          >
            {agent.expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Status: <span className={`capitalize font-medium ${
              agent.status === 'error' 
                ? 'text-red-600 dark:text-red-400' 
                : agent.status === 'working' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
            }`} data-testid={`text-agent-status-${agent.id}`}>
              {agent.status === 'working' && (
                <Clock className="inline w-4 h-4 mr-1 text-emerald-500" />
              )}
              {agent.status === 'error' && (
                <AlertCircle className="inline w-4 h-4 mr-1 text-red-500" />
              )}
              {agent.status}
            </span>
          </div>
          
          {agent.currentTask && (
            <div className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-agent-task-${agent.id}`}>
              Task: <span className="font-medium">{agent.currentTask}</span>
            </div>
          )}
          
          {agent.handoff && (
            <div className="text-sm text-orange-600 dark:text-orange-400" data-testid={`text-agent-handoff-${agent.id}`}>
              🔄 Handing to: <span className="font-medium">{agent.handoff}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-2">
            <div className="font-semibold" data-testid={`text-agent-todo-${agent.id}`}>
              {agent.queue.todo}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Todo</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 rounded p-2">
            <div className="font-semibold text-blue-600 dark:text-blue-400" data-testid={`text-agent-progress-${agent.id}`}>
              {agent.queue.inProgress}
            </div>
            <div className="text-blue-600 dark:text-blue-400">Progress</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900 rounded p-2">
            <div className="font-semibold text-green-600 dark:text-green-400" data-testid={`text-agent-done-${agent.id}`}>
              {agent.queue.done}
            </div>
            <div className="text-green-600 dark:text-green-400">Done</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900 rounded p-2">
            <div className="font-semibold text-red-600 dark:text-red-400" data-testid={`text-agent-failed-${agent.id}`}>
              {agent.queue.failed}
            </div>
            <div className="text-red-600 dark:text-red-400">Failed</div>
          </div>
        </div>
        
        {agent.expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 slide-in" data-testid={`div-agent-details-${agent.id}`}>
            <h4 className="font-medium mb-2">Recent Activity</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>• Last ping: {formatTime(new Date())}</div>
              <div>• Memory usage: {Math.floor(Math.random() * 40 + 20)}%</div>
              <div>• CPU usage: {Math.floor(Math.random() * 30 + 5)}%</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
