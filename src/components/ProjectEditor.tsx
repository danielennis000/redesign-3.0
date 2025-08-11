import React from 'react';
import { MODEL_OPTIONS, Project, createDefaultProject, KnowledgeFile, ModelOption } from '../types';
import { ChevronLeftIcon, MicIcon, TrashIcon, UploadIcon, ShareIcon, SettingsIcon } from './icons';
import { chatOnce, ChatMessage } from '../services/infer';
import ProviderKeysModal from './ProviderKeysModal';

type Props = {
  project: Project | null;
  onBack: () => void;
  onSave: (p: Project) => void;
  onOpenShare: (p: Project) => void;
  onOpenBuild: (p: Project) => void;
  defaultTab?: 'basics' | 'behavior' | 'knowledge' | 'memory';
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-asu-gray-300 bg-white p-4">
      <div className="mb-3 text-base font-semibold">{title}</div>
      {children}
    </section>
  );
}

export default function ProjectEditor({ project, onBack, onSave, onOpenShare, onOpenBuild, defaultTab }: Props) {
  const [draft, setDraft] = React.useState<Project>(() => project ?? createDefaultProject());
  const [previewInput, setPreviewInput] = React.useState('Explain photosynthesis in two sentences.');
  const [previewOutput, setPreviewOutput] = React.useState('');
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [keysOpen, setKeysOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'basics' | 'behavior' | 'knowledge' | 'memory'>(defaultTab ?? 'basics');
  const [autoPreview, setAutoPreview] = React.useState(true);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    if (project) {
      setDraft(project);
    }
  }, [project]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModelDropdownOpen && !(event.target as Element).closest('.model-dropdown')) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelDropdownOpen]);

  React.useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleFileAdd = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const additions: KnowledgeFile[] = [];
    for (const file of Array.from(files)) {
      const id = crypto.randomUUID();
      let dataUrl: string | undefined;
      if (file.size <= 300_000 && file.type.startsWith('image/')) {
        dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        });
      }
      additions.push({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        addedAt: new Date().toISOString(),
      });
    }
    setDraft((d) => ({ ...d, knowledgeBase: [...d.knowledgeBase, ...additions], updatedAt: new Date().toISOString() }));
  };

  const removeFile = (id: string) => {
    setDraft((d) => ({ ...d, knowledgeBase: d.knowledgeBase.filter((f) => f.id !== id), updatedAt: new Date().toISOString() }));
  };

  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setDraft((d) => ({ ...d, [key]: value, updatedAt: new Date().toISOString() }));
  };

  const save = () => onSave(draft);

  const runPreview = React.useCallback(async () => {
    setIsPreviewing(true);
    try {
      const msgs: ChatMessage[] = [{ role: 'user', content: previewInput }];
      const out = await chatOnce(draft, msgs);
      setPreviewOutput(out);
    } catch (e: any) {
      setPreviewOutput(e?.message ?? String(e));
    } finally {
      setIsPreviewing(false);
    }
  }, [draft, previewInput]);

  React.useEffect(() => {
    if (!autoPreview) return;
    const id = window.setTimeout(() => {
      runPreview();
    }, 500);
    return () => window.clearTimeout(id);
  }, [autoPreview, runPreview]);

  return (
    <div className="min-h-screen w-full bg-asu-gray-100">
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="rounded-full border border-asu-gray-300 bg-white p-2 hover:border-asu-maroon">
              <ChevronLeftIcon />
            </button>
            <div>
              <div className="text-2xl font-semibold">{draft.projectName || 'Untitled Project'}</div>
              <div className="text-sm text-asu-gray-700">Configure your AI</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setKeysOpen(true)} className="flex items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-4 py-2 whitespace-nowrap">
              <SettingsIcon /> <span>Provider keys</span>
            </button>
            <button onClick={() => onOpenShare(draft)} className="flex items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-4 py-2 whitespace-nowrap">
              <ShareIcon /> <span>Share</span>
            </button>
            <a href={`/view/${draft.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-4 py-2 whitespace-nowrap">
              <span>Open viewer</span>
            </a>
            <button onClick={save} className="rounded-full bg-asu-maroon px-4 py-2 text-white whitespace-nowrap">Save</button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(520px,1fr)_minmax(420px,520px)]">
          <div className="lg:col-span-1">
            <div className="mb-2 flex flex-wrap gap-2">
              {([
                { key: 'basics', label: 'Basics' },
                { key: 'behavior', label: 'Behavior' },
                { key: 'knowledge', label: 'Knowledge' },
                { key: 'memory', label: 'Memory' },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={
                    'rounded-full px-3 py-1.5 text-sm border ' +
                    (activeTab === t.key
                      ? 'bg-asu-maroon border-asu-maroon text-white'
                      : 'bg-white border-asu-gray-300 text-asu-black hover:border-asu-maroon')
                  }
                >{t.label}</button>
              ))}
            </div>

            {activeTab === 'basics' && (
              <Section title="Basics">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-asu-gray-700">Project name</label>
                    <input className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.projectName} onChange={(e) => update('projectName', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-asu-gray-700">AI display name</label>
                    <input className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.displayName} onChange={(e) => update('displayName', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-asu-gray-700">Category</label>
                    <select className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.category || ''} onChange={(e) => update('category', e.target.value)}>
                      <option value="">None</option>
                      <option value="Teaching">Teaching</option>
                      <option value="Assessment">Assessment</option>
                      <option value="Student">Student</option>
                      <option value="Assistant">Assistant</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-asu-gray-700">Description</label>
                    <textarea className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" rows={3} value={draft.description} onChange={(e) => update('description', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-asu-gray-700">Profile image</label>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-asu-gray-300 bg-asu-gray-200">
                        {draft.profileImageDataUrl ? (
                          <img src={draft.profileImageDataUrl} alt="AI" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm">
                        <UploadIcon />
                        <span>Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(String(reader.result));
                            reader.readAsDataURL(file);
                          });
                          update('profileImageDataUrl', dataUrl as unknown as any);
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-asu-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={draft.enableDictation} onChange={(e) => update('enableDictation', e.target.checked)} />
                      <MicIcon /> Enable dictation
                    </label>
                  </div>
                </div>
              </Section>
            )}

            {activeTab === 'behavior' && (
              <Section title="Behavior">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-asu-gray-700">Custom instructions</label>
                    <textarea className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" rows={5} value={draft.systemInstructions} onChange={(e) => update('systemInstructions', e.target.value)} />
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm text-asu-gray-700">Model</label>
                      <div className="relative model-dropdown">
                        <button
                          type="button"
                          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                          className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2 text-left flex items-center justify-between"
                        >
                          <span>{draft.model.label}</span>
                          <span className="text-asu-gray-400">▼</span>
                        </button>
                        
                        {isModelDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full rounded-lg border border-asu-gray-300 bg-white shadow-lg max-h-96 overflow-y-auto">
                            {MODEL_OPTIONS.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  update('model', m);
                                  setIsModelDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-3 hover:bg-asu-gray-50 border-b border-asu-gray-100 last:border-b-0 ${
                                  draft.model.id === m.id ? 'bg-asu-maroon text-white hover:bg-asu-maroon' : ''
                                }`}
                              >
                                <div className="font-semibold">{m.label}</div>
                                <div className="text-sm opacity-80">{m.contextWindow.toLocaleString()} tokens | {m.provider}</div>
                                <div className="text-sm opacity-70">{m.description}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {draft.model && (
                        <div className="mt-2 rounded-lg border border-asu-gray-200 bg-asu-gray-50 p-3">
                          <div className="text-sm">
                            <div className="font-semibold text-asu-gray-800">{draft.model.label}</div>
                            <div className="mt-1 text-asu-gray-600">{draft.model.contextWindow.toLocaleString()} tokens | {draft.model.provider}</div>
                            <div className="mt-1 text-asu-gray-600">{draft.model.description}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-asu-gray-700">Temperature: {draft.temperature.toFixed(2)}</label>
                      <input type="range" min={0} max={2} step={0.01} value={draft.temperature} onChange={(e) => update('temperature', Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-asu-gray-700">Max output tokens</label>
                      <input type="number" min={64} step={64} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.outputTokens} onChange={(e) => update('outputTokens', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-asu-gray-300 bg-asu-gray-50 p-3">
                  <div className="text-sm font-semibold">Viewer controls</div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-2 text-sm text-asu-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={!!draft.viewerConfig.exposeModelPicker} onChange={(e) => update('viewerConfig', { ...draft.viewerConfig, exposeModelPicker: e.target.checked })} />
                      Expose model picker to viewers
                    </label>
                    <label className="flex items-center gap-2 text-sm text-asu-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={!!draft.viewerConfig.exposeTemperature} onChange={(e) => update('viewerConfig', { ...draft.viewerConfig, exposeTemperature: e.target.checked })} />
                      Expose temperature slider to viewers
                    </label>
                    <label className="flex items-center gap-2 text-sm text-asu-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={draft.viewerConfig.allowFileUpload} onChange={(e) => update('viewerConfig', { ...draft.viewerConfig, allowFileUpload: e.target.checked })} />
                      Allow file upload
                    </label>
                    <label className="flex items-center gap-2 text-sm text-asu-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={draft.viewerConfig.allowDictation} onChange={(e) => update('viewerConfig', { ...draft.viewerConfig, allowDictation: e.target.checked })} />
                      Allow dictation (microphone)
                    </label>
                  </div>
                </div>
              </Section>
            )}

            {activeTab === 'knowledge' && (
              <Section title="Knowledge base (RAG)">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={draft.rag.enabled} onChange={(e) => update('rag', { ...draft.rag, enabled: e.target.checked })} />
                    <span className="text-sm">Enable retrieval</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-asu-gray-700">Top K</label>
                      <input type="number" min={1} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.rag.topK} onChange={(e) => update('rag', { ...draft.rag, topK: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-sm text-asu-gray-700">Chunk</label>
                      <input type="number" min={100} step={50} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.rag.chunkSize} onChange={(e) => update('rag', { ...draft.rag, chunkSize: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-sm text-asu-gray-700">Overlap</label>
                      <input type="number" min={0} step={20} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.rag.overlap} onChange={(e) => update('rag', { ...draft.rag, overlap: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm">
                      <UploadIcon />
                      <span>Add files</span>
                      <input type="file" className="hidden" multiple onChange={(e) => handleFileAdd(e.target.files)} />
                    </label>
                    <div className="mt-3 grid gap-2">
                      {draft.knowledgeBase.length === 0 ? (
                        <div className="text-sm text-asu-gray-700">No files yet</div>
                      ) : (
                        draft.knowledgeBase.map((f) => (
                          <div key={f.id} className="flex items-center justify-between rounded-lg border border-asu-gray-300 bg-white p-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 overflow-hidden rounded bg-asu-gray-200">
                                {f.dataUrl ? (
                                  <img src={f.dataUrl} alt={f.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{f.name}</div>
                                <div className="text-xs text-asu-gray-700">{(f.size / 1024).toFixed(1)} KB</div>
                              </div>
                            </div>
                            <button className="rounded-full border border-asu-gray-300 bg-white p-1" onClick={() => removeFile(f.id)}>
                              <TrashIcon />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {activeTab === 'memory' && (
              <Section title="Memory">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={draft.memory.enabled} onChange={(e) => update('memory', { ...draft.memory, enabled: e.target.checked })} />
                    <span className="text-sm">Enable conversation memory</span>
                  </div>
                  <div>
                    <label className="text-sm text-asu-gray-700">Memory window (messages)</label>
                    <input type="number" min={0} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draft.memory.window} onChange={(e) => update('memory', { ...draft.memory, window: Number(e.target.value) })} />
                  </div>
                </div>
              </Section>
            )}
          </div>

          <div className="lg:col-span-1 sticky-preview">
            <Section title="Preview">
              <div className="grid gap-3">
                <textarea className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" rows={4} value={previewInput} onChange={(e) => setPreviewInput(e.target.value)} />
                <div className="flex items-center gap-2">
                  <button
                    disabled={isPreviewing}
                    className="rounded-full bg-asu-maroon px-4 py-2 text-white disabled:opacity-50"
                    onClick={runPreview}
                  >{isPreviewing ? 'Running…' : 'Run preview'}</button>
                  <button
                    className="rounded-full border border-asu-gray-300 bg-white px-4 py-2"
                    onClick={() => setPreviewOutput('')}
                  >Clear</button>
                  <label className="ml-auto flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={autoPreview} onChange={(e) => setAutoPreview(e.target.checked)} />
                    Auto preview
                  </label>
                </div>
                <div className="h-64 overflow-auto rounded-lg border border-asu-gray-300 bg-asu-gray-100 p-3 text-sm">
                  {previewOutput ? <pre className="whitespace-pre-wrap">{previewOutput}</pre> : <div className="text-asu-gray-700">No output yet</div>}
                </div>
                <div className="text-xs text-asu-gray-700">Tip: Set provider keys (OpenAI, Gemini, Meta) via “Provider keys” to call real models. Otherwise a safe mock response is used.</div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      <ProviderKeysModal open={keysOpen} onClose={() => setKeysOpen(false)} />
    </div>
  );
}


