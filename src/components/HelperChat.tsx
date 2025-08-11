import React from 'react';
import { Project } from '../types';
import { chatOnce, ChatMessage } from '../services/infer';

type Props = { project: Project; defaultOpen?: boolean };

export default function HelperChat({ project, defaultOpen }: Props) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const send = async () => {
    if (!input.trim()) return;
    const u = { role: 'user' as const, content: input };
    setMessages((m) => [...m, u]);
    setInput('');
    setBusy(true);
    try {
      const out = await chatOnce(project, [{ role: 'user', content: u.content } as ChatMessage]);
      setMessages((m) => [...m, { role: 'assistant', content: out }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[360px] overflow-hidden rounded-xl border border-asu-gray-300 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-asu-maroon px-3 py-2 text-white">
            <div className="font-semibold">AI Guide</div>
            <button className="rounded-full bg-white/20 px-2 py-1" onClick={() => setOpen(false)}>Minimize</button>
          </div>
          <div className="h-64 overflow-auto p-3">
            {messages.length === 0 ? (
              <div className="text-sm text-asu-gray-700">Ask me anything about configuring your project.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs uppercase text-asu-gray-500">{m.role}</div>
                  <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-asu-gray-300 p-2">
            <input className="flex-1 rounded-lg border border-asu-gray-300 px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Type a question" />
            <button disabled={busy} className="rounded-full bg-asu-maroon px-3 py-2 text-white disabled:opacity-50" onClick={send}>{busy ? '...' : 'Send'}</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-asu-maroon px-4 py-2 text-white shadow-lg">
          <span className="font-semibold">AI Guide</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Ask me!</span>
        </button>
      )}
    </div>
  );
}


