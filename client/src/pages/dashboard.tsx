import { Users } from 'lucide-react';
import { useAgentSimulation } from '@/hooks/use-agent-simulation';
import { AgentCard } from '@/components/agents/agent-card';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Dashboard() {
  const { agents, chatMessages, addChatMessage, toggleAgentExpand, chatEndRef } = useAgentSimulation();

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* Agents Grid */}
        <div className="xl:col-span-2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Active Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="div-agents-grid">
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onToggleExpand={toggleAgentExpand}
              />
            ))}
          </div>
        </div>

        {/* Chat & System Messages */}
        <div className="flex flex-col">
          <ChatInterface
            messages={chatMessages}
            onSendMessage={addChatMessage}
            chatEndRef={chatEndRef}
          />
        </div>
      </div>
    </div>
  );
}
