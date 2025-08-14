import { useState, useEffect, useRef } from 'react';
import { Agent, ChatMessage, LogEntry, initialAgents, sampleTasks } from '@/lib/agent-data';

export function useAgentSimulation() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Agent Manager initialized.', type: 'system', timestamp: new Date() },
  ]);
  const [logs, setLogs] = useState<string[]>([
    JSON.stringify({
      agent: "System",
      task: "boot",
      level: "info",
      msg: "Agent Manager initialized",
      ts: new Date().toISOString()
    })
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addChatMessage = (text: string, type: ChatMessage['type'] = 'system') => {
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        type,
        timestamp: new Date()
      }
    ]);
  };

  const addLog = (agent: string, task: string, level: LogEntry['level'], msg: string) => {
    const logEntry = JSON.stringify({
      agent,
      task,
      level,
      msg,
      ts: new Date().toISOString()
    });
    setLogs(prev => [...prev, logEntry]);
  };

  const toggleAgentExpand = (id: number) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === id ? { ...agent, expanded: !agent.expanded } : agent
      )
    );
  };

  // Agent simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const next = prev.map(agent => {
          let updated = { ...agent };
          const roll = Math.random();

          if (roll < 0.02) {
            const newStatus = ['working', 'idle', 'error'][
              Math.floor(Math.random() * 3)
            ] as Agent['status'];
            updated.status = newStatus;

            if (newStatus === 'working') {
              const task = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
              updated.currentTask = task;
              updated.queue.inProgress = 1;
              updated.queue.todo = Math.max(0, updated.queue.todo - 1);

              addChatMessage(`Agent ${agent.id} started: "${task}"`, 'agent');
              addLog(`Agent${agent.id}`, 'start', 'info', `Started task: ${task}`);
            }

            if (newStatus === 'error') {
              updated.queue.failed += 1;
              updated.queue.inProgress = 0;
              const errorMsg = [
                'Auth failed',
                'Rate limited',
                'Timeout',
                'Missing data',
              ][Math.floor(Math.random() * 4)];
              updated.currentTask = null;

              addChatMessage(`Agent ${agent.id} failed: ${errorMsg}`, 'error');
              addLog(`Agent${agent.id}`, 'error', 'error', errorMsg);
            }

            if (newStatus === 'idle') {
              if (agent.currentTask) {
                updated.queue.done += 1;
                updated.queue.inProgress = 0;
                addChatMessage(`Agent ${agent.id} completed: "${agent.currentTask}"`, 'success');
              }
              updated.currentTask = null;
            }
          }

          if (roll < 0.01 && agent.status === 'working' && !agent.handoff) {
            const otherAgent = Math.floor(Math.random() * 6) + 1;
            if (otherAgent !== agent.id) {
              updated.handoff = `Agent ${otherAgent}`;
              addChatMessage(`Agent ${agent.id} handing off to ${otherAgent}`, 'handoff');
            }
          }

          return updated;
        });
        return next;
      });
    }, 3000);

    const logInterval = setInterval(() => {
      const msgs = [
        'All agents responsive.',
        'Health check passed.',
        'Task queue optimized.',
        'System performance normal.',
        'Memory usage stable.'
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      addChatMessage(msg, 'system');
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  // Auto-scroll effects
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  return {
    agents,
    chatMessages,
    logs,
    addChatMessage,
    addLog,
    toggleAgentExpand,
    chatEndRef,
    logsEndRef
  };
}
