import { Terminal } from 'lucide-react';
import { useAgentSimulation } from '@/hooks/use-agent-simulation';
import { Card, CardContent } from '@/components/ui/card';

export default function Logs() {
  const { logs, logsEndRef } = useAgentSimulation();

  const formatLogEntry = (log: string) => {
    try {
      const parsed = JSON.parse(log);
      const levelColors = {
        info: 'text-green-400',
        error: 'text-red-400',
        warn: 'text-yellow-400',
        debug: 'text-blue-400'
      };
      
      return (
        <div className="text-xs mb-1">
          <span className="text-gray-500">
            {new Date(parsed.ts).toLocaleTimeString()}
          </span>
          {' '}
          <span className={levelColors[parsed.level as keyof typeof levelColors] || 'text-gray-400'}>
            [{parsed.level.toUpperCase()}]
          </span>
          {' '}
          <span className="text-cyan-400">{parsed.agent}:</span>
          {' '}
          <span className="text-white">{parsed.msg}</span>
        </div>
      );
    } catch {
      return <div className="text-xs mb-1 text-white">{log}</div>;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Terminal className="w-6 h-6" />
        System Logs
      </h2>
      <Card className="bg-black text-green-400">
        <CardContent className="p-4 font-mono text-sm">
          <div 
            className="h-96 overflow-y-auto scrollbar-thin"
            data-testid="div-logs-container"
          >
            <div>
              {logs.slice(-200).map((log, index) => (
                <div key={index}>
                  {formatLogEntry(log)}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
