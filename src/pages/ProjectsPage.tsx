import React from 'react';
import Sidebar from '../components/Sidebar';
import { Project } from '../types';
import { useFavoriteProjects } from '../components/ProjectsStore';
import { useProjects } from '../components/ProjectsStore';
import { useCurrentUserProfile } from '../components/UserProfile';
import ProjectRow from '../components/ProjectRow';

type Props = {
  projects: Project[];
  onCreate: () => void;
  onOpenProject: (p: Project) => void;
};

export default function ProjectsPage({ projects, onCreate, onOpenProject }: Props) {
  const { removeMany } = useProjects();
  const { name } = useCurrentUserProfile();
  const email = '';
  const { isFavorite, toggleFavorite } = useFavoriteProjects(email);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const allSelected = selectedIds.length > 0 && selectedIds.length === projects.length;
  const toggleSelect = (id: string) => {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter(x => x !== id) : [id, ...ids]);
  };
  const toggleSelectAll = () => {
    setSelectedIds((ids) => ids.length === projects.length ? [] : projects.map(p => p.id));
  };
  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    removeMany(selectedIds);
    setSelectedIds([]);
  };
  const [query, setQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [providerFilter, setProviderFilter] = React.useState<string>('');

  const uniqueCategories = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[],
    [projects]
  );
  const uniqueProviders = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.model?.provider).filter(Boolean))) as string[],
    [projects]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const name = (p.projectName || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const matchQ = !q || name.includes(q) || desc.includes(q);
      const matchCat = !categoryFilter || p.category === categoryFilter;
      const matchProv = !providerFilter || p.model?.provider === providerFilter;
      return matchQ && matchCat && matchProv;
    });
  }, [projects, query, categoryFilter, providerFilter]);
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar onNewProject={onCreate} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-6 max-w-6xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My projects</h1>
              <p className="mt-1 text-asu-gray-700">Create, open, and manage your AI projects.</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button onClick={deleteSelected} className="rounded-full border border-asu-gray-300 bg-white px-4 py-2 text-asu-black hover:border-asu-maroon">Delete selected ({selectedIds.length})</button>
              )}
              <button onClick={onCreate} className="rounded-full bg-asu-maroon px-4 py-2 text-white">New project</button>
            </div>
          </header>
          <div className="mb-4 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="">All providers</option>
              {uniqueProviders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-asu-gray-300 bg-white max-w-6xl">
            {filtered.length === 0 ? (
              <div className="p-4 text-asu-gray-700">No projects yet.</div>
            ) : (
              <div className="divide-y divide-asu-gray-300">
                <div className="flex items-center gap-3 p-3 text-sm text-asu-gray-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={allSelected} onChange={toggleSelectAll} />
                    Select all
                  </label>
                </div>
                {filtered.map((p) => (
                  <div key={p.id} className="flex items-start">
                    <div className="px-4 pt-4">
                      <input type="checkbox" className="h-4 w-4 mt-1" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </div>
                    <div className="flex-1 border-l border-asu-gray-300">
                      <ProjectRow project={p} onOpen={onOpenProject} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} currentUserEmail={email} />
                    </div>
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


