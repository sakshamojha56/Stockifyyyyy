'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'agent';
  content: string;
  txHash?: string;
}

interface AgentChatProps {
  userAddress: string;
  context: any;
}

export default function AgentChat({ userAddress, context }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: '👋 Hello! I\'m your Stockify trading assistant. I can help you:\n\n' +
               '• Check your balances (STX, sBTC, DSTOCK)\n' +
               '• View your stock holdings\n' +
               '• Buy stocks using STX or sBTC\n' +
               '• Sell stocks from your portfolio\n' +
               '• Get current stock prices\n\n' +
               'What would you like to do today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: { ...context, userAddress },
          history: messages.slice(-10)
        })
      });

      const data = await response.json();
      
      const agentMessage: Message = {
        role: 'agent',
        content: data.response || data.error || 'Sorry, I encountered an error.',
        txHash: data.txHash
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'agent',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border-2 border-yellow-400 rounded-lg h-[700px] flex flex-col">
      {/* Header */}
      <div className="bg-yellow-400 px-6 py-4 rounded-t-lg">
        <h2 className="text-black text-2xl font-bold">🤖 AI Trading Agent</h2>
        <p className="text-black text-sm opacity-80">Ask me anything about trading stocks!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-lg p-4 ${
              msg.role === 'user'
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-800 text-white border-2 border-yellow-400'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              
              {/* Transaction hash display */}
              {msg.txHash && (
                <div className="mt-3 pt-3 border-t-2 border-yellow-400">
                  <p className="text-sm font-semibold mb-2">📝 Transaction Details:</p>
                  <a
                    href={`https://explorer.hiro.so/txid/${msg.txHash}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 text-sm underline break-all"
                  >
                    {msg.txHash}
                  </a>
                  <p className="text-xs text-yellow-400 mt-2">Click to view on Stacks Explorer</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border-2 border-yellow-400 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-yellow-400">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Type your command... (e.g., 'buy 1 AAPL with STX')"
            className="flex-1 bg-zinc-800 text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          💡 Try: "check balance" | "show my holdings" | "buy 1 TSLA with STX" | "sell 2 AAPL"
        </p>
      </div>
    </div>
  );
}
