import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  ListTodo,
  BookOpen,
  Settings,
  Send,
  Circle,
  ChevronRight,
  ChevronLeft,
  Terminal,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  FileText,
  ClipboardList,
  Database,
  Sliders,
  Archive,
  Download,
  Folder,
  FolderOpen,
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeArtifactTab, setActiveArtifactTab] = useState('requirements');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['source_code', 'documentation']));
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Agent Manager initialized.', type: 'system' },
  ]);
  const [agents, setAgents] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
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
    }))
  );

  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);
  const [logs, setLogs] = useState([
    `{"agent":"System","task":"boot","level":"info","msg":"Agent Manager initialized","ts":"${new Date().toISOString()}"}`,
  ]);

  // Simulate live behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const next = prev.map(agent => {
          let updated = { ...agent };
          const roll = Math.random();

          if (roll < 0.02) {
            const newStatus = ['working', 'idle', 'error'][
              Math.floor(Math.random() * 3)
            ];
            updated.status = newStatus;

            if (newStatus === 'working') {
              const tasks = [
                'Research topic',
                'Write draft',
                'Review content',
                'Format output',
                'Verify sources',
              ];
              updated.currentTask =
                tasks[Math.floor(Math.random() * tasks.length)];
              updated.queue.inProgress = 1;
              updated.queue.todo = Math.max(0, updated.queue.todo - 1);

              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} started: "${updated.currentTask}"`,
                  type: 'agent',
                },
              ]);
              setLogs(l => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"start","level":"info","msg":"Started task: ${updated.currentTask}","ts":"${new Date().toISOString()}"}`,
              ]);
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

              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} failed: ${errorMsg}`,
                  type: 'error',
                },
              ]);
              setLogs(l => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"error","level":"error","msg":"${errorMsg}","ts":"${new Date().toISOString()}"}`,
              ]);
            }

            if (newStatus === 'idle') {
              if (agent.currentTask) {
                updated.queue.done += 1;
                updated.queue.inProgress = 0;
                setChatMessages(m => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `Agent ${agent.id} completed: "${agent.currentTask}"`,
                    type: 'success',
                  },
                ]);
              }
              updated.currentTask = null;
            }
          }

          if (roll < 0.01 && agent.status === 'working' && !agent.handoff) {
            const otherAgent = Math.floor(Math.random() * 6) + 1;
            if (otherAgent !== agent.id) {
              updated.handoff = `Agent ${otherAgent}`;
              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} handing off to ${otherAgent}`,
                  type: 'handoff',
                },
              ]);
            }
          }

          return updated;
        });
        return next;
      });
    }, 3000);

    const logInterval = setInterval(() => {
      const msgs = [
        { text: 'All agents responsive.', type: 'system' },
        { text: 'Health check passed.', type: 'system' },
        { text: 'Task queue optimized.', type: 'system' },
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setChatMessages(m => [...m, { id: Date.now(), ...msg }]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(
    () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [chatMessages]
  );
  useEffect(
    () => logsEndRef.current?.scrollIntoView({ behavior: 'auto' }),
    [logs]
  );

  const toggleAgentExpand = id =>
    setAgents(prev =>
      prev.map(a => (a.id === id ? { ...a, expanded: !a.expanded } : a))
    );

  const navItems = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Tasks', icon: ClipboardList, id: 'tasks' },
    { name: 'Logs', icon: Terminal, id: 'logs' },
    { name: 'Artifacts', icon: Archive, id: 'artifacts' },
    { name: 'Settings', icon: Sliders, id: 'settings' },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'working':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleColor = role => {
    switch (role) {
      case 'Researcher':
        return 'text-blue-600 dark:text-blue-400';
      case 'Writer':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-amber-600 dark:text-amber-400';
    }
  };

  // Mock artifacts data
  const artifactsData = {
    requirements: [
      { name: 'requirements.md', type: 'Requirements Document', url: 'https://yourserver.com/artifacts/requirements/requirements.md' },
      { name: 'use_cases.md', type: 'Use Cases', url: 'https://yourserver.com/artifacts/requirements/use_cases.md' },
      { name: 'user_stories.md', type: 'User Stories', url: 'https://yourserver.com/artifacts/requirements/user_stories.md' },
    ],
    design: [
      { name: 'architecture_diagram.png', type: 'Architecture Diagram', url: 'https://yourserver.com/artifacts/design/architecture_diagram.png' },
      { name: 'system_design.md', type: 'System Design', url: 'https://yourserver.com/artifacts/design/system_design.md' },
      { name: 'ui_mockups.pdf', type: 'UI Mockups', url: 'https://yourserver.com/artifacts/design/ui_mockups.pdf' },
    ],
    development: {
      source_code: [
        { name: 'main.py', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/main.py' },
        { name: 'utils.py', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/utils.py' },
        { name: 'components/', type: 'folder', children: [
          { name: 'Button.jsx', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/components/Button.jsx' },
          { name: 'Modal.jsx', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/components/Modal.jsx' },
        ]},
      ],
      documentation: [
        { name: 'api_docs.md', type: 'file', url: 'https://yourserver.com/artifacts/development/documentation/api_docs.md' },
        { name: 'setup_guide.md', type: 'file', url: 'https://yourserver.com/artifacts/development/documentation/setup_guide.md' },
      ],
    },
    testing: [
      { name: 'test_plan.md', type: 'Test Plan', url: 'https://yourserver.com/artifacts/testing/test_plan.md' },
      { name: 'test_cases.xlsx', type: 'Test Cases', url: 'https://yourserver.com/artifacts/testing/test_cases.xlsx' },
      { name: 'test_script.sh', type: 'Test Script', url: 'https://yourserver.com/artifacts/testing/test_script.sh' },
    ],
    deployment: [
      { name: 'deploy_script.sh', type: 'Deployment Script', url: 'https://yourserver.com/artifacts/deployment/deploy_script.sh' },
      { name: 'config.json', type: 'Configuration', url: 'https://yourserver.com/artifacts/deployment/config.json' },
      { name: 'docker-compose.yml', type: 'Docker Config', url: 'https://yourserver.com/artifacts/deployment/docker-compose.yml' },
    ],
    maintenance: [
      { name: 'monitoring_report.md', type: 'Monitoring Report', url: 'https://yourserver.com/artifacts/maintenance/monitoring_report.md' },
      { name: 'error_logs.txt', type: 'Error Logs', url: 'https://yourserver.com/artifacts/maintenance/error_logs.txt' },
      { name: 'performance_metrics.json', type: 'Performance Metrics', url: 'https://yourserver.com/artifacts/maintenance/performance_metrics.json' },
    ],
  };

  const artifactTabs = [
    { id: 'requirements', name: 'Requirements', icon: FileText },
    { id: 'design', name: 'Design', icon: Database },
    { id: 'development', name: 'Development', icon: Terminal },
    { id: 'testing', name: 'Testing', icon: CheckCircle },
    { id: 'deployment', name: 'Deployment', icon: Settings },
    { id: 'maintenance', name: 'Maintenance', icon: AlertCircle },
  ];

  const toggleFolder = (folderName) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items, level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ marginLeft: level * 20 }}>
        {item.type === 'folder' ? (
          <div>
            <div 
              className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => toggleFolder(item.name)}
            >
              {expandedFolders.has(item.name) ? (
                <FolderOpen size={16} className="text-blue-500" />
              ) : (
                <Folder size={16} className="text-blue-500" />
              )}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {expandedFolders.has(item.name) && item.children && (
              <div>{renderFileTree(item.children, level + 1)}</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm">{item.name}</span>
            </div>
            <a
              href={item.url}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <Download size={12} />
              Download
            </a>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Agent Manager
            </h1>
            <div className="flex gap-3 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Circle
                  className={`w-3 h-3 fill-current ${getStatusColor(agents.some(a => a.status === 'error') ? 'error' : 'working')}`}
                />
                {agents.some(a => a.status === 'error') ? 'Errors' : 'Running'}
              </span>
              <span>
                Active: {agents.filter(a => a.status === 'working').length}/10
              </span>
              <span>
                Queue:{' '}
                {agents.reduce(
                  (sum, a) => sum + a.queue.todo + a.queue.inProgress,
                  0
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-white/20"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-white/20 text-sm"
            >
              {darkMode ? '◐' : '◑'}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav
            className={`flex-shrink-0 border-r bg-white dark:bg-gray-800 transition-all ${sidebarCollapsed ? 'w-16' : 'w-60'}`}
          >
            <div className="p-3 space-y-1">
              {navItems.map(item => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activePage === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon size={20} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </button>
                  {sidebarCollapsed && (
                    <div className="fixed left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded pointer-events-none opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Dashboard */}
            {activePage === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Dashboard
                </h2>

                {/* Chat */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 h-60 flex flex-col">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto space-y-2">
                    {chatMessages.slice(-8).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          msg.type === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : msg.type === 'success'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : msg.type === 'handoff'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {msg.type === 'error' && <AlertCircle size={14} />}
                        {msg.type === 'success' && <CheckCircle size={14} />}
                        {msg.type === 'handoff' && <User size={14} />}
                        {msg.type === 'system' && <FileText size={14} />}
                        <span className="font-mono">• {msg.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <input
                      type="text"
                      placeholder="Send instruction..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      onKeyPress={e => {
                        if (e.key === 'Enter' && e.target.value) {
                          setChatMessages(m => [
                            ...m,
                            {
                              id: Date.now(),
                              text: `You: ${e.target.value}`,
                              type: 'user',
                            },
                          ]);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700">
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Agents Grid */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                    Agents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition"
                        onClick={() => toggleAgentExpand(agent.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Agent {agent.id}</h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`${getRoleColor(agent.role)} text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700`}
                            >
                              {agent.role}
                            </span>
                            <Circle
                              className={`w-3 h-3 fill-current ${getStatusColor(agent.status)}`}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
                          {agent.status === 'working' && (
                            <>
                              <Clock
                                size={14}
                                className="inline mr-1 text-emerald-500"
                              />{' '}
                              Working
                            </>
                          )}
                          {agent.status === 'error' && (
                            <>
                              <AlertCircle
                                size={14}
                                className="inline mr-1 text-red-500"
                              />{' '}
                              Error
                            </>
                          )}
                          {agent.status === 'idle' && 'Idle'}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Queue: {agent.queue.todo} todo,{' '}
                          {agent.queue.inProgress} in progress
                        </div>
                        {agent.currentTask && (
                          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs truncate">
                            <span className="font-medium">Task:</span>{' '}
                            {agent.currentTask}
                          </div>
                        )}
                        {agent.handoff && (
                          <div className="text-xs text-amber-600 dark:text-amber-400">
                            🔄 Handing to {agent.handoff}
                          </div>
                        )}
                        {agent.expanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
                            <div className="font-mono text-gray-600 dark:text-gray-400 space-y-1 h-16 overflow-y-auto">
                              {agent.chat.length ? (
                                agent.chat.map((msg, i) => (
                                  <div key={i}>• {msg}</div>
                                ))
                              ) : (
                                <div className="text-gray-400">No history</div>
                              )}
                            </div>
                            <div className="mt-2 text-gray-500 dark:text-gray-400">
                              Done: {agent.queue.done} | Failed:{' '}
                              {agent.queue.failed}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            {activePage === 'tasks' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Task Monitor
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-750 text-left text-sm">
                      <tr>
                        <th className="p-4 font-medium">Task Name</th>
                        <th>Status</th>
                        <th>Agent Role</th>
                        <th>Time Taken</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        {
                          name: 'Scrape news sites',
                          status: 'Done',
                          role: 'Researcher',
                          time: '2m 10s',
                          feedback: '—',
                        },
                        {
                          name: 'Draft blog post',
                          status: 'WIP',
                          role: 'Writer',
                          time: '—',
                          feedback: 'Waiting on stats',
                        },
                        {
                          name: 'Review content',
                          status: 'Waiting',
                          role: 'Editor',
                          time: '—',
                          feedback: 'Awaiting approval',
                        },
                        {
                          name: 'Publish article',
                          status: 'To Do',
                          role: 'Publisher',
                          time: '—',
                          feedback: '—',
                        },
                        {
                          name: 'Update metadata',
                          status: 'Error',
                          role: 'Publisher',
                          time: '15s',
                          feedback: 'Auth token expired',
                        },
                      ].map((task, i) => (
                        <tr
                          key={i}
                          className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="p-4 font-medium">{task.name}</td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                task.status === 'Done'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'Error'
                                    ? 'bg-red-100 text-red-800'
                                    : task.status === 'WIP'
                                      ? 'bg-blue-100 text-blue-800'
                                      : task.status === 'Waiting'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="text-gray-600 dark:text-gray-400">
                            {task.role}
                          </td>
                          <td className="text-gray-600 dark:text-gray-400">
                            {task.time}
                          </td>
                          <td className="text-gray-600 dark:text-gray-400">
                            {task.feedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Logs */}
            {activePage === 'logs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Logs (JSONL)
                </h2>
                <div className="bg-black text-green-400 rounded-xl p-4 font-mono text-sm h-96 overflow-y-auto">
                  {logs.slice(-200).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}

            {/* Artifacts */}
            {activePage === 'artifacts' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Artifacts
                </h2>
                
                {/* Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex overflow-x-auto">
                      {artifactTabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveArtifactTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                            activeArtifactTab === tab.id
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <tab.icon size={16} />
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {/* Development Tab - Tree View */}
                    {activeArtifactTab === 'development' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Navigate through the generated source code and documentation
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                              <Terminal size={16} />
                              Source Code
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-80 overflow-y-auto">
                              {renderFileTree(artifactsData.development.source_code)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                              <BookOpen size={16} />
                              Documentation
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-80 overflow-y-auto">
                              {renderFileTree(artifactsData.development.documentation)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Other Tabs - Table View */}
                    {activeArtifactTab !== 'development' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activeArtifactTab === 'requirements' && 'Requirements documents and user stories from the Analyst agent'}
                          {activeArtifactTab === 'design' && 'Architecture diagrams and design models from the Architect agent'}
                          {activeArtifactTab === 'testing' && 'Test plans, cases, and scripts from the Testing agent'}
                          {activeArtifactTab === 'deployment' && 'Deployment scripts and configuration files from the Deployment agent'}
                          {activeArtifactTab === 'maintenance' && 'Monitoring reports and logs from the Maintenance agent'}
                        </p>
                        
                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-750">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Document Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Type
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Download
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {artifactsData[activeArtifactTab]?.map((artifact, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {artifact.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {artifact.type}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <a
                                      href={artifact.url}
                                      className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                    >
                                      <Download size={12} />
                                      Download
                                    </a>
                                  </td>
                                </tr>
                              )) || (
                                <tr>
                                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No artifacts available yet
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activePage === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Settings
                </h2>

                {/* Agent Role Files Grid */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                    Agent Role Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Agent {agent.id}</h3>
                          <span
                            className={`${getRoleColor(agent.role)} text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700`}
                          >
                            {agent.role}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Role Configuration File
                            </label>
                            <input
                              type="file"
                              accept=".json,.md"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-gray-300 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                          
                          {agent.id <= 2 && (
                            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle size={12} />
                              Uploaded: role_agent{agent.id}.json
                            </div>
                          )}
                          
                          {agent.id > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              No configuration file uploaded
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Configuration */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                    System Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Max Agents Allowed', value: '10' },
                      { label: 'Health Check Interval (ms)', value: '10000' },
                      { label: 'Max Retries', value: '3' },
                      { label: 'Queue Size', value: '3' },
                      { label: 'Process Interval (ms)', value: '1000' },
                      { label: 'Priority Levels', value: '10' },
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                        />
                      </div>
                    ))}
                  </div>

                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
