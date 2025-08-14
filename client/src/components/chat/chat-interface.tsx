import { useState, useRef } from 'react';
import { Send, MessageCircle, AlertCircle, CheckCircle, User, FileText } from 'lucide-react';
import { ChatMessage } from '@/lib/agent-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: ChatMessage['type']) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatInterface({ messages, onSendMessage, chatEndRef }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const message = inputValue.trim();
    if (message) {
      onSendMessage(`Admin: ${message}`, 'user');
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'handoff': case 'user': return <User className="w-4 h-4" />;
      case 'system': case 'agent': default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMessageColors = (type: ChatMessage['type']) => {
    const colors = {
      system: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      agent: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
      handoff: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      user: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    };
    return colors[type] || colors.system;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          System Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin max-h-96"
          data-testid="div-chat-messages"
        >
          {messages.slice(-8).map((msg, i) => (
            <div
              key={msg.id}
              className="flex gap-2 text-sm"
              data-testid={`div-chat-message-${i}`}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-fit">
                {msg.timestamp.toLocaleTimeString()}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getMessageColors(msg.type)}`}>
                {getMessageIcon(msg.type)}
                {msg.type}
              </span>
              <span className="flex-1">{msg.text}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Send system command..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button 
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
