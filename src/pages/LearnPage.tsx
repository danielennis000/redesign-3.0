import React from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { LayersIcon, BuildIcon, SettingsIcon, UploadIcon } from '../components/icons';
import { ARTICLES, ALL_CATEGORIES, ALL_TAGS, LearnArticle } from '../learn/articles';

export default function LearnPage() {
  const { query, setQuery, category, setCategory, tag, setTag, filtered } = useLearnFilters();
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-5xl">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Learn</h1>
              <p className="mt-1 text-asu-gray-700">Build and customize AIs with a clear, repeatable workflow.</p>
            </header>

            {/* Quick actions */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <Link to="/" className="group rounded-xl border border-asu-gray-300 bg-white p-4 hover:border-asu-maroon">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-asu-gray-200 text-asu-black flex items-center justify-center">
                    <BuildIcon />
                  </div>
                  <div className="font-semibold">Start a project</div>
                </div>
                <div className="mt-2 text-sm text-asu-gray-700">Head to the dashboard and click “Create new”.</div>
              </Link>
              <Link to="/templates" className="group rounded-xl border border-asu-gray-300 bg-white p-4 hover:border-asu-maroon">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-asu-gray-200 text-asu-black flex items-center justify-center">
                    <LayersIcon />
                  </div>
                  <div className="font-semibold">Use a template</div>
                </div>
                <div className="mt-2 text-sm text-asu-gray-700">Browse starter patterns and jump in faster.</div>
              </Link>
              <Link to="/settings" className="group rounded-xl border border-asu-gray-300 bg-white p-4 hover:border-asu-maroon">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-asu-gray-200 text-asu-black flex items-center justify-center">
                    <SettingsIcon />
                  </div>
                  <div className="font-semibold">Personalize</div>
                </div>
                <div className="mt-2 text-sm text-asu-gray-700">Set your name, email, and interaction preferences.</div>
              </Link>
            </section>

            {/* Search & filters */}
            <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="">All tags</option>
                {ALL_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </section>

            {/* Article index */}
            <ArticleIndex articles={filtered} />

            {/* Guided path */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-asu-gray-300 bg-white p-5">
                <div className="text-base font-semibold">Plan</div>
                <ol className="mt-2 list-decimal pl-5 text-sm text-asu-gray-800 space-y-1">
                  <li>Define audience and primary use cases</li>
                  <li>List inputs and expected outputs</li>
                  <li>Choose Blank project or a suitable Template</li>
                </ol>
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-5">
                <div className="text-base font-semibold">Create</div>
                <ol className="mt-2 list-decimal pl-5 text-sm text-asu-gray-800 space-y-1">
                  <li>Click “Create new” or pick a Template</li>
                  <li>Name your project and add a short description</li>
                  <li>Select a model/provider that fits the task</li>
                </ol>
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-5">
                <div className="text-base font-semibold">Add knowledge (RAG)</div>
                <ol className="mt-2 list-decimal pl-5 text-sm text-asu-gray-800 space-y-1">
                  <li className="flex items-center gap-2"><UploadIcon /> Upload course docs or reference material</li>
                  <li>Tune top‑K and chunk sizes for retrieval</li>
                  <li>Keep sources up to date</li>
                </ol>
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-5">
                <div className="text-base font-semibold">Shape behavior</div>
                <ol className="mt-2 list-decimal pl-5 text-sm text-asu-gray-800 space-y-1">
                  <li>Write concise system instructions</li>
                  <li>Adjust temperature to control creativity</li>
                  <li>Use Build to test and iterate quickly</li>
                </ol>
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-5 sm:col-span-2">
                <div className="text-base font-semibold">Share and personalize</div>
                <ol className="mt-2 list-decimal pl-5 text-sm text-asu-gray-800 space-y-1">
                  <li>Invite collaborators (editor/viewer)</li>
                  <li>Use Viewer mode for limited‑access experiences</li>
                  <li>Set your preferred name and interaction style in Settings</li>
                </ol>
              </div>
            </section>

            {/* Tips */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-asu-gray-300 bg-white p-4 text-sm text-asu-gray-800">
                <div className="mb-1 font-semibold text-asu-maroon">Prompting</div>
                Use short, specific instructions. Include inputs, outputs, and constraints.
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-4 text-sm text-asu-gray-800">
                <div className="mb-1 font-semibold text-asu-maroon">Knowledge</div>
                Upload clean, final sources. Avoid duplicates; keep file names meaningful.
              </div>
              <div className="rounded-xl border border-asu-gray-300 bg-white p-4 text-sm text-asu-gray-800">
                <div className="mb-1 font-semibold text-asu-maroon">Iteration</div>
                Make one change at a time; test often using Build and share early drafts.
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function useLearnFilters() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [tag, setTag] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
      const matchC = !category || a.category === category;
      const matchT = !tag || a.tags.includes(tag);
      return matchQ && matchC && matchT;
    });
  }, [query, category, tag]);
  return { query, setQuery, category, setCategory, tag, setTag, filtered } as const;
}

function ArticleIndex({ articles }: { articles: LearnArticle[] }) {
  if (articles.length === 0) {
    return <div className="mb-8 rounded-xl border border-asu-gray-300 bg-white p-4 text-asu-gray-700">No articles found.</div>;
  }
  return (
    <div className="mb-10 grid gap-4">
      {articles.map((a) => (
        <Link key={a.id} to={`/learn/${a.id}`} className="rounded-xl border border-asu-gray-300 bg-white p-4 hover:border-asu-maroon">
          <div className="text-base font-semibold">{a.title}</div>
          <div className="mt-1 text-sm text-asu-gray-700">{a.summary}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-asu-gray-200 px-2 py-0.5 text-xs text-asu-maroon">{a.category}</span>
            {a.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-asu-gray-200 px-2 py-0.5 text-[11px] text-asu-gray-700">{t}</span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}


