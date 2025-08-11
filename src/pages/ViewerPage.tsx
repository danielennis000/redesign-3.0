import React from 'react';
import { Project, MODEL_OPTIONS, ModelOption } from '../types';
import { useProjects } from '../components/ProjectsStore';
import { MicIcon, UploadIcon } from '../components/icons';
import { chatOnce, ChatMessage } from '../services/infer';

type Props = { project: Project };

export default function ViewerPage({ project }: Props) {
  const { update } = useProjects();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [userModelId, setUserModelId] = React.useState(project.model.id);
  const [userTemp, setUserTemp] = React.useState(project.temperature);
  const [attachments, setAttachments] = React.useState<{ name: string; type: string; text?: string }[]>([]);
  const [recognizing, setRecognizing] = React.useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setBusy(true);
    try {
      const effective: Project = {
        ...project,
        model: project.viewerConfig.exposeModelPicker ? (MODEL_OPTIONS.find(m => m.id === userModelId) || project.model) : project.model,
        temperature: project.viewerConfig.exposeTemperature ? userTemp : project.temperature,
      } as Project;
      // Compose attachment context
      let attachmentNote = '';
      if (attachments.length > 0) {
        const summaries = attachments.map((a) => {
          const body = a.text ? (a.text.length > 2000 ? a.text.slice(0, 2000) + '\n[truncated]' : a.text) : '(no text extracted)';
          return `\n---\nFile: ${a.name} (${a.type})\n${body}`;
        }).join('');
        attachmentNote = `\n\n[Attachments for context]${summaries}`;
      }
      // Build conversation history respecting memory settings
      const prior: ChatMessage[] = messages.map((m) => ({ role: m.role, content: m.content } as ChatMessage));
      const rawHistory: ChatMessage[] = [...prior, { role: 'user', content: userMsg.content + attachmentNote }];
      let historyToSend = rawHistory;
      if (effective.memory && effective.memory.enabled) {
        const keep = Math.max(1, Math.min(effective.memory.window, rawHistory.length));
        historyToSend = rawHistory.slice(-keep);
      } else {
        historyToSend = rawHistory.slice(-1);
      }
      const out = await chatOnce(effective, historyToSend);
      setMessages((m) => [...m, { role: 'assistant', content: out }]);
      setAttachments([]);
    } finally {
      setBusy(false);
    }
  };

  // Persist viewer-side model/temperature tweaks back to the project so the editor reflects them
  React.useEffect(() => {
    if (!project.viewerConfig.exposeModelPicker) return;
    const nextModel = MODEL_OPTIONS.find((m) => m.id === userModelId) as ModelOption | undefined;
    if (!nextModel) return;
    if (nextModel.id !== project.model.id) {
      const next: Project = { ...project, model: nextModel, updatedAt: new Date().toISOString() };
      update(next);
    }
  }, [userModelId, project, update]);

  React.useEffect(() => {
    if (!project.viewerConfig.exposeTemperature) return;
    if (userTemp !== project.temperature) {
      const next: Project = { ...project, temperature: userTemp, updatedAt: new Date().toISOString() };
      update(next);
    }
  }, [userTemp, project, update]);

  // Keep local controls in sync when the project prop changes (e.g., user saves a new model in the editor)
  React.useEffect(() => {
    if (project.model?.id && project.model.id !== userModelId) {
      setUserModelId(project.model.id);
    }
  }, [project.model?.id]);

  React.useEffect(() => {
    if (typeof project.temperature === 'number' && project.temperature !== userTemp) {
      setUserTemp(project.temperature);
    }
  }, [project.temperature]);

  React.useEffect(() => {
    if (project.viewerConfig.exposeModelPicker) {
      setUserModelId(project.model.id);
    }
  }, [project.viewerConfig.exposeModelPicker, project.model.id]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModelDropdownOpen && !(event.target as Element).closest('.model-dropdown')) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelDropdownOpen]);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const out: { name: string; type: string; text?: string }[] = [];
    const textTypes = ['text/', 'application/json', 'application/xml', 'application/javascript'];
    for (const file of Array.from(files)) {
      let text: string | undefined;
      const isText = textTypes.some((p) => file.type.startsWith(p));
      if (isText && file.size <= 2_000_000) {
        try {
          text = await file.text();
        } catch {}
      }
      out.push({ name: file.name, type: file.type || 'unknown', text });
    }
    setAttachments((prev) => [...prev, ...out]);
  };

  // Simple Web Speech API dictation
  const startDictation = () => {
    const w: any = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else setInput((prev) => prev.replace(/\s+$/, '') + r[0].transcript);
      }
      if (final) setInput((prev) => (prev ? prev + ' ' : '') + final);
    };
    rec.onend = () => setRecognizing(false);
    rec.onerror = () => setRecognizing(false);
    setRecognizing(true);
    rec.start();
  };

  return (
    <div className="min-h-screen w-full bg-asu-gray-100">
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-asu-gray-300 bg-asu-gray-200">
            {project.profileImageDataUrl && <img src={project.profileImageDataUrl} alt="AI" className="h-full w-full object-cover" />}
          </div>
          <div>
            <div className="text-xl font-semibold">{project.displayName}</div>
            {project.viewerConfig.showDescription && (
              <div className="text-sm text-asu-gray-700">{project.description}</div>
            )}
          </div>
        </div>

        {project.viewerConfig.enableChat ? (
          <div className="grid gap-3">
            {(project.viewerConfig.exposeModelPicker || project.viewerConfig.exposeTemperature) && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-asu-gray-300 bg-white p-3">
                {project.viewerConfig.exposeModelPicker && (
                  <div>
                    <label className="text-xs text-asu-gray-700">Model</label>
                    <div className="relative model-dropdown">
                      <button
                        type="button"
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-1.5 text-sm text-left flex items-center justify-between"
                      >
                        <span>{(() => {
                          const model = MODEL_OPTIONS.find(m => m.id === userModelId);
                          return model ? model.label : 'Select Model';
                        })()}</span>
                        <span className="text-asu-gray-400">▼</span>
                      </button>
                      
                      {isModelDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-asu-gray-300 bg-white shadow-lg max-h-96 overflow-y-auto">
                          {MODEL_OPTIONS.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setUserModelId(m.id);
                                setIsModelDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-asu-gray-50 border-b border-asu-gray-100 last:border-b-0 text-sm ${
                                userModelId === m.id ? 'bg-asu-maroon text-white hover:bg-asu-maroon' : ''
                              }`}
                            >
                              <div className="font-semibold">{m.label}</div>
                              <div className="opacity-80">{m.contextWindow.toLocaleString()} tokens | {m.provider}</div>
                              <div className="opacity-70">{m.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {userModelId && (
                      <div className="mt-2 rounded border border-asu-gray-200 bg-asu-gray-50 p-2 text-xs">
                        {(() => {
                          const model = MODEL_OPTIONS.find(m => m.id === userModelId);
                          return model ? (
                            <>
                              <div className="font-semibold text-asu-gray-800">{model.label}</div>
                              <div className="text-asu-gray-600">{model.contextWindow.toLocaleString()} tokens | {model.provider}</div>
                              <div className="text-asu-gray-600">{model.description}</div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                )}
                {project.viewerConfig.exposeTemperature && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-asu-gray-700">Temperature</label>
                    <input type="range" min={0} max={2} step={0.01} value={userTemp} onChange={(e) => setUserTemp(Number(e.target.value))} />
                    <span className="text-xs text-asu-gray-700">{userTemp.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="h-80 overflow-auto rounded-lg border border-asu-gray-300 bg-white p-3">
              {messages.length === 0 ? (
                <div className="text-sm text-asu-gray-700">Start a conversation…</div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className={`mb-2 ${m.role === 'user' ? 'text-asu-black' : 'text-asu-gray-700'}`}>
                    <div className="text-xs uppercase text-asu-gray-500">{m.role}</div>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                ))
              )}
            </div>
            {attachments.length > 0 && (
              <div className="rounded-lg border border-asu-gray-300 bg-white p-2 text-xs text-asu-gray-700">
                <div className="mb-1 font-semibold">Attachments</div>
                <ul className="list-disc pl-5">
                  {attachments.map((a, i) => (
                    <li key={i}>{a.name} {a.text ? '(text included)' : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-2">
              {project.viewerConfig.allowFileUpload && (
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm">
                  <UploadIcon />
                  <span>Attach files</span>
                  <input type="file" className="hidden" multiple onChange={(e) => onFiles(e.target.files)} />
                </label>
              )}
              {project.viewerConfig.allowDictation && (
                <button type="button" onClick={startDictation} className={`flex items-center gap-2 rounded-full border ${recognizing ? 'border-asu-maroon' : 'border-asu-gray-300'} bg-white px-3 py-1.5 text-sm`}>
                  <MicIcon /> {recognizing ? 'Listening…' : 'Dictate'}
                </button>
              )}
              <input className="flex-1 rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Type your message" />
              <button disabled={busy} className="rounded-full bg-asu-maroon px-4 py-2 text-white disabled:opacity-50" onClick={send}>{busy ? '...' : 'Send'}</button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-asu-gray-300 bg-white p-4 text-asu-gray-700">Chat is disabled for viewers.</div>
        )}
      </div>
    </div>
  );
}


