import React from 'react';
import { useCurrentUserProfile } from './UserProfile';
import LayoutSettingsModal, { LayoutPrefs, SectionKey } from './LayoutSettingsModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
//
import { Project } from '../types';
import { useFavoriteProjects } from './ProjectsStore';
import ProjectRow from './ProjectRow';
import { LayersIcon, BuildIcon, BookIcon, HelpCircleIcon } from './icons';

type Template = {
  id: string;
  name: string;
  description: string;
  badge?: string;
  accentClass: string;
};

const templates: Template[] = [
  {
    id: 'lesson-planner',
    name: 'Lesson Planner',
    description: 'Generate lesson outlines and activities aligned to outcomes.',
    badge: 'Teaching',
    accentClass: 'from-asu-gold/30 to-asu-maroon/10',
  },
  {
    id: 'rubric-builder',
    name: 'Rubric Builder',
    description: 'Create grading rubrics and performance descriptors.',
    badge: 'Assessment',
    accentClass: 'from-warning-orange/30 to-asu-gold/10',
  },
  {
    id: 'study-guide',
    name: 'Study Guide',
    description: 'Summarize materials into student-ready study guides.',
    badge: 'Student',
    accentClass: 'from-info-blue/30 to-asu-gray-200',
  },
  {
    id: 'qa-assistant',
    name: 'Q&A Assistant',
    description: 'Create a course-specific chatbot for FAQs and resources.',
    badge: 'Assistant',
    accentClass: 'from-success-green/30 to-asu-gray-200',
  },
];

// Removed embedded Sidebar to avoid duplication; a shared Sidebar is rendered by the layout pages

function Hero({ onScaffold }: { onScaffold: (prompt: string) => void }): JSX.Element {
  const [text, setText] = React.useState('');
  return (
    <section className="asu-gradient relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white">
      <div className="absolute inset-0 opacity-10" />
      <div className="relative grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h2 className="text-2xl font-semibold sm:text-3xl">Start with a prompt</h2>
          <p className="mt-2 max-w-2xl text-asu-white/90">
            Describe what you want to build. We’ll scaffold the app with sensible defaults.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur">
            <input
              className="w-full rounded-lg border-0 bg-transparent px-3 py-3 text-white placeholder:text-white/70 focus:outline-none"
              placeholder="E.g., Create a study guide generator for BIO 101 using my syllabus"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onScaffold(text); }}
            />
            <div className="flex items-center gap-2">
              <button onClick={() => onScaffold(text)} className="rounded-lg bg-asu-black/80 px-4 py-2 text-white hover:bg-asu-black">Generate</button>
            </div>
          </div>
          {/* Conversation starter chips removed per requirements */}
        </div>
        <div className="glass-card rounded-xl p-4 text-asu-black">
          <div className="text-sm font-semibold text-asu-maroon">Tips</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-asu-gray-700">
            <li>Keep prompts specific; include inputs and desired outputs.</li>
            <li>Use Templates to jumpstart best practices.</li>
            <li>Share to groups for easy collaboration.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function QuickStart({ onScaffold }: { onScaffold: (prompt: string) => void }): JSX.Element {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick start</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Blank AI project', desc: 'Begin from scratch with full control.', prompt: 'Blank AI project', icon: <BuildIcon /> },
          { title: 'Study guide assistant', desc: 'Generate student study guides.', prompt: 'Study guide assistant', icon: <BookIcon /> },
          { title: 'Course FAQ chatbot', desc: 'Answer common course questions.', prompt: 'Course FAQ chatbot', icon: <HelpCircleIcon /> },
        ].map((card) => (
          <div key={card.title} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{card.title}</div>
                <div className="mt-1 text-sm text-asu-gray-700">{card.desc}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-asu-gold/60 text-asu-black">
                {card.icon}
              </div>
            </div>
            <button onClick={() => onScaffold(card.prompt)} className="mt-4 rounded-full bg-asu-maroon px-3 py-1.5 text-sm text-white">Continue</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Templates({ onViewAll, onUseTemplate }: { onViewAll: () => void; onUseTemplate: (title: string) => void }): JSX.Element {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Teaching templates</h3>
        <button onClick={onViewAll} className="text-sm text-asu-maroon">View all</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-xl border border-asu-gray-300 bg-white p-4">
            <div className={`h-20 w-full rounded-lg bg-gradient-to-br ${t.accentClass}`} />
            <div className="mt-3 text-base font-semibold">{t.name}</div>
            <div className="mt-1 text-sm text-asu-gray-700">{t.description}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-asu-gray-200 px-2 py-0.5 text-xs text-asu-maroon">
                {t.badge}
              </span>
              <button onClick={() => onUseTemplate(t.name)} className="text-sm text-asu-maroon">Use template</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Recent({ items, onOpen, isFavorite, onToggle, currentUserEmail }: { items: Project[]; onOpen: (p: Project) => void; isFavorite: (id: string) => boolean; onToggle: (id: string) => void; currentUserEmail?: string }): JSX.Element {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <button className="text-sm text-asu-maroon">View all</button>
      </div>
      <div className="divide-y divide-asu-gray-300 overflow-hidden rounded-xl border border-asu-gray-300 bg-white">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-asu-gray-700">No projects yet. Create one to get started.</div>
        ) : (
          items.map((p) => (
            <ProjectRow key={p.id} project={p} onOpen={onOpen} isFavorite={isFavorite} onToggleFavorite={onToggle} currentUserEmail={currentUserEmail} />
          ))
        )}
      </div>
    </section>
  );
}

function SharedWithMe({ items, onOpen, currentUserEmail, isFavorite, onToggle }: { items: Project[]; onOpen: (p: Project) => void; currentUserEmail?: string; isFavorite?: (id: string) => boolean; onToggle?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shared with me</h3>
        <a href="/shared" className="text-sm text-asu-maroon">View all</a>
      </div>
      <div className="divide-y divide-asu-gray-300 overflow-hidden rounded-xl border border-asu-gray-300 bg-white">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-asu-gray-700">No shared projects yet.</div>
        ) : (
          items.map((p) => (
            <ProjectRow key={p.id} project={p} onOpen={onOpen} currentUserEmail={currentUserEmail} isFavorite={isFavorite} onToggleFavorite={onToggle} />
          ))
        )}
      </div>
    </section>
  );
}

function Favorites({ items, onOpen, onToggle, isFavorite, currentUserEmail }: { items: Project[]; onOpen: (p: Project) => void; onToggle: (id: string) => void; isFavorite: (id: string) => boolean; currentUserEmail?: string }): JSX.Element {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your favorites</h3>
      </div>
      <div className="divide-y divide-asu-gray-300 overflow-hidden rounded-xl border border-asu-gray-300 bg-white">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-asu-gray-700">No favorites yet. Click the star on a project to add it.</div>
        ) : (
          items.map((p) => (
            <ProjectRow key={p.id} project={p} onOpen={onOpen} isFavorite={isFavorite} onToggleFavorite={onToggle} currentUserEmail={currentUserEmail} />
          ))
        )}
      </div>
    </section>
  );
}

const defaultPrefs: LayoutPrefs = {
  order: ['hero', 'quickStart', 'templates', 'favorites', 'recent', 'shared'],
  visibility: {
    hero: true,
    quickStart: true,
    templates: true,
    favorites: true,
    recent: true,
    shared: true,
  },
};

export default function DashDefault({ onCreate, onOpenProject, projects, onScaffoldFromPrompt }: { onCreate: () => void; onOpenProject: (p: Project) => void; projects: Project[]; onScaffoldFromPrompt: (prompt: string) => void }): JSX.Element {
  const [prefs, setPrefs] = useLocalStorage<LayoutPrefs>('asu-ai-forge:prefs', defaultPrefs);
  const [open, setOpen] = React.useState(false);
  const { name, email } = useCurrentUserProfile();
  const { favoriteIds, toggleFavorite } = useFavoriteProjects(email);
  const favorites = projects.filter(p => favoriteIds.includes(p.id));

  // Compute shared with me based on invites/general access
  const sharedWithMe: Project[] = React.useMemo(() => {
    const userEmail = email || '';
    const list = projects.filter((p) => {
      const invites = Array.isArray(p.invites) ? p.invites : [];
      const general = (p.generalAccess as 'private' | 'view' | 'edit') || 'private';
      return general !== 'private' || invites.some((i) => i.email === userEmail);
    });
    if (list.length > 0) return list.slice(0, 5);
    // Fallback mock: show first few projects so the section is not empty
    return projects.slice(0, Math.min(3, projects.length));
  }, [projects, email]);

  const sectionMap: Record<SectionKey, JSX.Element> = {
    hero: <Hero onScaffold={onScaffoldFromPrompt} />,
    quickStart: <QuickStart onScaffold={onScaffoldFromPrompt} />,
    templates: <Templates onViewAll={() => window.location.assign('/templates')} onUseTemplate={(title) => onScaffoldFromPrompt(title)} />,
    favorites: <Favorites items={favorites} onOpen={onOpenProject} onToggle={toggleFavorite} isFavorite={(id) => favoriteIds.includes(id)} currentUserEmail={email} />,
    recent: <Recent items={projects} onOpen={onOpenProject} isFavorite={(id) => favoriteIds.includes(id)} onToggle={toggleFavorite} currentUserEmail={email} />,
    shared: <SharedWithMe items={sharedWithMe} onOpen={onOpenProject} currentUserEmail={email} isFavorite={(id) => favoriteIds.includes(id)} onToggle={toggleFavorite} />,
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{`Welcome back, ${name || 'friend'}.`}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            title="Layout settings"
            aria-label="Layout settings"
            className="rounded-full border border-asu-gray-300 bg-asu-white p-2 text-asu-black hover:border-asu-maroon"
          >
            <LayersIcon />
          </button>
        </div>
      </header>

      <div className="grid gap-10 max-w-6xl">
        {prefs.order.map((key) => (
          prefs.visibility[key] ? (
            <div key={key}>
              {sectionMap[key]}
            </div>
          ) : null
        ))}
      </div>

      <LayoutSettingsModal open={open} onClose={() => setOpen(false)} prefs={prefs} setPrefs={setPrefs} />
    </div>
  );
} 