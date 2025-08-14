export interface Agent {
  id: number;
  role: 'Researcher' | 'Writer' | 'Editor';
  status: 'idle' | 'working' | 'error';
  queue: {
    todo: number;
    inProgress: number;
    done: number;
    failed: number;
  };
  currentTask: string | null;
  chat: string[];
  handoff: string | null;
  expanded: boolean;
}

export interface ChatMessage {
  id: number;
  text: string;
  type: 'system' | 'agent' | 'error' | 'success' | 'handoff' | 'user';
  timestamp: Date;
}

export interface LogEntry {
  agent: string;
  task: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  msg: string;
  ts: string;
}

export const initialAgents: Agent[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  role: i % 3 === 0 ? 'Researcher' : i % 3 === 1 ? 'Writer' : 'Editor',
  status: 'idle',
  queue: {
    todo: Math.floor(Math.random() * 3),
    inProgress: 0,
    done: Math.floor(Math.random() * 5),
    failed: 0,
  },
  currentTask: null,
  chat: [],
  handoff: null,
  expanded: false,
}));

export const getStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'working': return 'bg-emerald-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

export const getRoleColor = (role: Agent['role']) => {
  switch (role) {
    case 'Researcher': return 'text-blue-600 dark:text-blue-400';
    case 'Writer': return 'text-purple-600 dark:text-purple-400';
    default: return 'text-amber-600 dark:text-amber-400';
  }
};

export const sampleTasks = [
  'Research market trends',
  'Write product documentation',
  'Review code changes',
  'Update user interface',
  'Test new features',
  'Fix bug reports',
  'Optimize performance',
  'Deploy to staging',
  'Verify sources',
  'Format output',
  'Research topic',
  'Write draft',
  'Review content',
];
