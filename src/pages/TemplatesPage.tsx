import React from 'react';
import Sidebar from '../components/Sidebar';
import { useProjects } from '../components/ProjectsStore';
import { MODEL_OPTIONS, Project } from '../types';
import { useNavigate } from 'react-router-dom';
import ProjectRow from '../components/ProjectRow';

type DynamoValue = { S?: string; N?: string; BOOL?: boolean; L?: DynamoValue[]; M?: Record<string, DynamoValue>; NULL?: boolean };

function unwrap(v: DynamoValue | undefined): any {
  if (!v) return undefined;
  if (v.S !== undefined) return v.S;
  if (v.N !== undefined) return Number(v.N);
  if (v.BOOL !== undefined) return v.BOOL;
  if (v.NULL) return null;
  if (v.L) return v.L.map(unwrap);
  if (v.M) {
    const out: any = {};
    for (const k of Object.keys(v.M)) out[k] = unwrap(v.M[k]);
    return out;
  }
  return v as any;
}

type Template = {
  id: string;
  title: string;
  description?: string;
  systemInstructions?: string;
  provider?: string;
  modelName?: string;
  temperature?: number;
  ragEnabled?: boolean;
  ragTopK?: number;
  category?: string;
  tags?: string[];
  providerNormalized?: string;
  audience?: string;
  // viewer flags
  viewerAllowUpload?: boolean;
  viewerAllowDictation?: boolean;
};

const STORAGE_KEY = 'asu-ai-forge:templates-v1';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { create, update } = useProjects();
  const [templates, setTemplates] = React.useState<Template[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Template[]) : [];
    } catch {
      return [];
    }
  });

  // Helper to load and persist from public/templates.json
  const loadFromPublicTemplates = React.useCallback(async () => {
    try {
      const resp = await fetch('/templates.json', { cache: 'no-store' });
      if (!resp.ok) return false;
      const obj = await resp.json();
      const preloaded = parseDynamoObject(obj);
      if (preloaded.length) {
        setTemplates(preloaded);
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preloaded)); } catch {}
        return true;
      }
    } catch {}
    return false;
  }, []);

  React.useEffect(() => {
    // Auto-load from public/templates.json if nothing in local storage
    if (templates.length > 0) return;
    (async () => { await loadFromPublicTemplates(); })();
  }, [templates.length]);

  // If templates exist but look empty (likely from a prior parse), repair by reloading
  React.useEffect(() => {
    if (templates.length === 0) return;
    const looksEmpty = templates.every(t => !t.systemInstructions && !t.description && !t.modelName && !t.providerNormalized);
    if (looksEmpty) {
      (async () => { await loadFromPublicTemplates(); })();
    }
  }, [templates, loadFromPublicTemplates]);

  // Manual import handler (upload JSON file with Dynamo-style records)
  const onImportJson: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const obj = JSON.parse(text);
      const parsed = parseDynamoObject(obj);
      if (parsed.length > 0) {
        setTemplates(parsed);
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch {}
      } else {
        alert('No templates found in the selected JSON.');
      }
    } catch (err: any) {
      alert('Failed to import JSON: ' + (err?.message || String(err)));
    } finally {
      e.target.value = '';
    }
  };

  const saveTemplates = (next: Template[]) => {
    setTemplates(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  // Removed manual import; auto-loads from public/templates.json

  function parseDynamoObject(obj: any): Template[] {
    const out: Template[] = [];
    if (!obj || typeof obj !== 'object') return out;
    for (const key of Object.keys(obj)) {
      const entry = obj[key] as Record<string, DynamoValue>;
      const iface = unwrap(entry.interface);
      const projectName = unwrap(entry.project_name) || (iface && iface.title) || 'Untitled';
      const description = unwrap(entry.description) || (iface && iface.description);
      const modelName = unwrap(entry.model_name);
      const provider = unwrap(entry.model_provider);
      const providerNormalized = normalizeProvider(String(provider || ''));
      const params = unwrap(entry.model_params) || {};
      const sysList = (params?.system_prompt?.[0]) || '';
      const temperature = typeof params?.temperature === 'number' ? params.temperature : (typeof params?.temperature === 'string' ? Number(params.temperature) : undefined);
      const searchParams = unwrap(entry.search_params);
      const enableSearch = unwrap(entry.enable_search);
      const topK = searchParams ? searchParams.top_k : undefined;
      const useCases = unwrap(entry.use_cases) as string[] | undefined;
      const tags = Array.isArray(useCases) ? useCases : [];
      const viewerAllowUpload = !!(iface && iface.enable_upload === true);
      const viewerAllowDictation = !!(iface && iface.enable_voice === true);
      // Fallback custom instructions when system_prompt is missing
      let fallbackDescription = unwrap(entry.description) || (iface && iface.description) || '';
      const starters = (iface && iface.starter_groups && Array.isArray(iface.starter_groups)) ? iface.starter_groups : [];
      const startersText = Array.isArray(starters) && starters.length > 0
        ? starters.map((g: any) => (g && g.starters ? g.starters.join('\n- ') : ''))
            .filter(Boolean)
            .join('\n- ')
        : '';
      const searchPrompt = searchParams && searchParams.search_prompt ? String(searchParams.search_prompt) : '';
      const composedFallback = (
        `You are an assistant for "${String(projectName || 'Untitled')}".` +
        (fallbackDescription ? `\n\nPurpose:\n${String(fallbackDescription)}` : '') +
        (Array.isArray(useCases) && useCases.length ? `\n\nUse cases:\n- ${useCases.join('\n- ')}` : '') +
        (startersText ? `\n\nExample prompts:\n- ${startersText}` : '') +
        (enableSearch && searchPrompt ? `\n\nWhen retrieval is enabled, follow this retrieval guidance:\n${searchPrompt}` : '')
      ).trim();
      // Attempt category inference from use cases
      const inferredCategory = Array.isArray(useCases) && useCases.length > 0 ? String(useCases[0]) : undefined;
      out.push({
        id: key,
        title: String(projectName || 'Untitled'),
        description: description ? String(description) : undefined,
        systemInstructions: sysList ? String(sysList) : composedFallback || undefined,
        provider: provider ? String(provider) : undefined,
        modelName: modelName ? String(modelName) : undefined,
        temperature: typeof temperature === 'number' && !Number.isNaN(temperature) ? temperature : undefined,
        ragEnabled: !!enableSearch,
        ragTopK: typeof topK === 'number' ? topK : undefined,
        tags,
        providerNormalized,
        category: inferredCategory,
        viewerAllowUpload,
        viewerAllowDictation,
      });
    }
    return out;
  }

  function normalizeProvider(p: string): string | undefined {
    if (!p) return undefined;
    const v = p.toLowerCase();
    if (v.includes('openai')) return 'OpenAI';
    if (v.includes('anthropic') || v.includes('claude')) return 'Anthropic';
    if (v.includes('google') || v.includes('gemini')) return 'Google';
    if (v.includes('mistral')) return 'Mistral';
    if (v.includes('groq')) return 'Groq';
    if (v.includes('cohere')) return 'Cohere';
    if (v.includes('meta') || v.includes('llama')) return 'Meta';
    if (v.includes('aws') || v.includes('bedrock') || v.includes('nova')) return 'AWS';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  const [query, setQuery] = React.useState('');
  const [providerFilter, setProviderFilter] = React.useState<string>('');
  const [tagFilter, setTagFilter] = React.useState<string>('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [audienceFilter, setAudienceFilter] = React.useState<string>('');

  // Built-in templates from dashboard (teaching templates + quick start)
  const builtinTemplates: Template[] = React.useMemo(() => [
    {
      id: 'builtin-lesson-planner',
      title: 'Lesson Planner',
      description: 'Generate lesson outlines and activities aligned to outcomes.',
      category: 'Teaching',
      audience: 'Instructor',
      tags: ['Teaching', 'Planning'],
    },
    {
      id: 'builtin-rubric-builder',
      title: 'Rubric Builder',
      description: 'Create grading rubrics and performance descriptors.',
      category: 'Assessment',
      audience: 'Instructor',
      tags: ['Assessment', 'Rubrics'],
    },
    {
      id: 'builtin-study-guide',
      title: 'Study Guide',
      description: 'Summarize materials into student-ready study guides.',
      category: 'Student',
      audience: 'Student',
      tags: ['Student', 'Study'],
    },
    {
      id: 'builtin-qa-assistant',
      title: 'Q&A Assistant',
      description: 'Create a course-specific chatbot for FAQs and resources.',
      category: 'Assistant',
      audience: 'Instructor',
      tags: ['Assistant', 'FAQ'],
    },
    // Quick start prompts
    {
      id: 'builtin-blank',
      title: 'Blank AI project',
      description: 'Begin from scratch with full control.',
      category: 'General',
      audience: 'Builder',
      tags: ['Starter'],
    },
    {
      id: 'builtin-study-guide-assistant',
      title: 'Study guide assistant',
      description: 'Generate student study guides.',
      category: 'Student',
      audience: 'Student',
      tags: ['Starter', 'Study'],
    },
    {
      id: 'builtin-course-faq',
      title: 'Course FAQ chatbot',
      description: 'Answer common course questions.',
      category: 'Assistant',
      audience: 'Instructor',
      tags: ['Starter', 'FAQ'],
    },
  ], []);

  const allTemplates = React.useMemo(() => [...builtinTemplates, ...templates], [builtinTemplates, templates]);

  const uniqueProviders = React.useMemo(
    () => Array.from(new Set(allTemplates.map(t => t.providerNormalized).filter(Boolean))) as string[],
    [allTemplates]
  );
  const uniqueTags = React.useMemo(
    () => Array.from(new Set(allTemplates.flatMap(t => t.tags || []))),
    [allTemplates]
  );
  const uniqueCategories = React.useMemo(
    () => Array.from(new Set(allTemplates.map(t => t.category).filter(Boolean))) as string[],
    [allTemplates]
  );
  const uniqueAudiences = React.useMemo(
    () => Array.from(new Set(allTemplates.map(t => t.audience).filter(Boolean))) as string[],
    [allTemplates]
  );

  const filterFn = React.useCallback((t: Template) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.systemInstructions || '').toLowerCase().includes(q);
    const matchProv = !providerFilter || t.providerNormalized === providerFilter;
    const matchTag = !tagFilter || (t.tags || []).includes(tagFilter);
    const matchCat = !categoryFilter || t.category === categoryFilter;
    const matchAud = !audienceFilter || t.audience === audienceFilter;
    return matchQ && matchProv && matchTag && matchCat && matchAud;
  }, [query, providerFilter, tagFilter, categoryFilter, audienceFilter]);

  const filteredBuiltins = React.useMemo(() => builtinTemplates.filter(filterFn), [builtinTemplates, filterFn]);
  const filteredImported = React.useMemo(() => templates.filter(filterFn), [templates, filterFn]);

  const applyTemplate = (t: Template) => {
    const p = create(t.title);
    const model = pickModel(t.provider, t.modelName);
    const next: Project = {
      ...p,
      projectName: t.title,
      displayName: t.title,
      description: t.description || '',
      systemInstructions: t.systemInstructions || '',
      // If the template maps to a known model, use it; otherwise keep the default and let the user pick a newer one.
      model: model || p.model,
      temperature: typeof t.temperature === 'number' ? t.temperature : p.temperature,
      rag: {
        ...p.rag,
        enabled: !!t.ragEnabled,
        topK: t.ragTopK ?? p.rag.topK,
      },
      viewerConfig: {
        ...p.viewerConfig,
        allowFileUpload: !!t.viewerAllowUpload,
        allowDictation: !!t.viewerAllowDictation,
      },
      updatedAt: new Date().toISOString(),
    };
    update(next);
    // Navigate by id and let the route load from the store to avoid stale in-memory copies
    navigate(`/project/${next.id}`, { state: { openGuide: true, defaultTab: 'behavior' } });
  };

  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Templates</h1>
                <p className="mt-1 text-asu-gray-700">Start from prebuilt configurations. Search and filter below.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm"
                  title="Reset templates"
                  onClick={() => loadFromPublicTemplates()}
                >Reset templates</button>
                <label className="rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm cursor-pointer">
                  Import JSON
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={onImportJson}
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl">
              <input className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" placeholder="Search templates..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
                <option value="">All providers</option>
                {uniqueProviders.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                <option value="">All tags</option>
                {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">All categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)}>
                <option value="">All audiences</option>
                {uniqueAudiences.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </header>

          <div className="overflow-hidden rounded-xl border border-asu-gray-300 bg-white max-w-6xl">
            {(filteredBuiltins.length === 0 && filteredImported.length === 0) ? (
              <div className="p-4 text-asu-gray-700">
                No templates match your filters.
                <button
                  className="ml-2 rounded-full border border-asu-gray-300 bg-white px-3 py-1 text-sm"
                  onClick={() => { setQuery(''); setProviderFilter(''); setTagFilter(''); setCategoryFilter(''); setAudienceFilter(''); }}
                >Reset filters</button>
              </div>
            ) : (
              <div className="divide-y divide-asu-gray-300">
                {filteredBuiltins.map((t) => (
                  <div key={`builtin-${t.id}`}>
                    <ProjectRow
                      project={{
                        id: t.id,
                        projectName: t.title,
                        displayName: t.title,
                        description: t.description || '',
                        category: t.category,
                        ownerEmail: '',
                        profileImageDataUrl: undefined,
                        enableDictation: false,
                        systemInstructions: t.systemInstructions || '',
                        model: { provider: (t.providerNormalized as any) || 'OpenAI', id: t.modelName || 'gpt-4o', label: t.modelName || 'Model', contextWindow: 128000 },
                        temperature: 0.7,
                        outputTokens: 1024,
                        rag: { enabled: !!t.ragEnabled, topK: t.ragTopK || 6, chunkSize: 800, overlap: 120 },
                        memory: { enabled: true, window: 20 },
                        knowledgeBase: [],
                        generalAccess: 'private',
                        invites: [],
                        viewerConfig: { enableChat: true, showDescription: true, allowFileUpload: false, allowDictation: false },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      } as any}
                      onOpen={() => applyTemplate(t)}
                    />
                  </div>
                ))}
                {filteredImported.map((t) => (
                  <div key={`imported-${t.id}`}>
                    <ProjectRow
                      project={{
                        id: t.id,
                        projectName: t.title,
                        displayName: t.title,
                        description: t.description || '',
                        category: t.category,
                        ownerEmail: '',
                        profileImageDataUrl: undefined,
                        enableDictation: false,
                        systemInstructions: t.systemInstructions || '',
                        model: { provider: (t.providerNormalized as any) || 'OpenAI', id: t.modelName || 'gpt-4o', label: t.modelName || 'Model', contextWindow: 128000 },
                        temperature: 0.7,
                        outputTokens: 1024,
                        rag: { enabled: !!t.ragEnabled, topK: t.ragTopK || 6, chunkSize: 800, overlap: 120 },
                        memory: { enabled: true, window: 20 },
                        knowledgeBase: [],
                        generalAccess: 'private',
                        invites: [],
                        viewerConfig: { enableChat: true, showDescription: true, allowFileUpload: false, allowDictation: false },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      } as any}
                      onOpen={() => applyTemplate(t)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function pickModel(provider?: string, modelName?: string) {
  if (!provider && !modelName) return null;
  const name = (modelName || '').toLowerCase();
  const prov = provider ? provider.toLowerCase() : '';
  // map some common names
  const candidates = MODEL_OPTIONS.filter((m) =>
    (!prov || m.provider.toLowerCase().includes(prov)) && (!name || m.id.toLowerCase().includes(name) || m.label.toLowerCase().includes(name))
  );
  return candidates[0] || null;
}


