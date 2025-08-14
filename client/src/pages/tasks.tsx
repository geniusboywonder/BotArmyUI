import { ClipboardList, Clock, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { useAgentSimulation } from '@/hooks/use-agent-simulation';
import { sampleTasks } from '@/lib/agent-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskCardProps {
  task: string;
  agentId: number;
}

function TaskCard({ task, agentId }: TaskCardProps) {
  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="font-medium text-sm mb-2">{task}</div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Agent {agentId}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Tasks() {
  const { agents } = useAgentSimulation();

  // Generate tasks based on agent queues
  const todoTasks: Array<{task: string, agentId: number}> = [];
  const inProgressTasks: Array<{task: string, agentId: number}> = [];
  const doneTasks: Array<{task: string, agentId: number}> = [];
  const failedTasks: Array<{task: string, agentId: number}> = [];

  agents.forEach(agent => {
    for (let i = 0; i < agent.queue.todo; i++) {
      todoTasks.push({
        task: sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
        agentId: agent.id
      });
    }
    for (let i = 0; i < agent.queue.inProgress; i++) {
      inProgressTasks.push({
        task: agent.currentTask || sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
        agentId: agent.id
      });
    }
    for (let i = 0; i < agent.queue.done; i++) {
      doneTasks.push({
        task: sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
        agentId: agent.id
      });
    }
    for (let i = 0; i < agent.queue.failed; i++) {
      failedTasks.push({
        task: sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
        agentId: agent.id
      });
    }
  });

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList className="w-6 h-6" />
        Task Management
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* To Do Column */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="div-todo-tasks">
            {todoTasks.map((item, index) => (
              <TaskCard key={index} task={item.task} agentId={item.agentId} />
            ))}
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Play className="w-4 h-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="div-inprogress-tasks">
            {inProgressTasks.map((item, index) => (
              <TaskCard key={index} task={item.task} agentId={item.agentId} />
            ))}
          </CardContent>
        </Card>

        {/* Done Column */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Done
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="div-done-tasks">
            {doneTasks.map((item, index) => (
              <TaskCard key={index} task={item.task} agentId={item.agentId} />
            ))}
          </CardContent>
        </Card>

        {/* Failed Column */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="div-failed-tasks">
            {failedTasks.map((item, index) => (
              <TaskCard key={index} task={item.task} agentId={item.agentId} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
