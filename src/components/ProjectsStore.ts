import React from 'react';
import { Project, createDefaultProject, Invite } from '../types';

const STORAGE_KEY = 'asu-ai-forge:projects-v1';
const UPDATE_EVENT = 'asu-ai-forge:projects-updated';

export function useProjects() {
  const [projects, setProjects] = React.useState<Project[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Project[]) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  // Sync across multiple hook instances and tabs/windows
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key !== STORAGE_KEY) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const next = raw ? (JSON.parse(raw) as Project[]) : [];
        setProjects(next);
      } catch {}
    };
    const onUpdated = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const next = raw ? (JSON.parse(raw) as Project[]) : [];
        setProjects(next);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(UPDATE_EVENT, onUpdated as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(UPDATE_EVENT, onUpdated as EventListener);
    };
  }, []);

  const create = (name?: string) => {
    const p = createDefaultProject({ projectName: name ?? 'Untitled Project' });
    setProjects((arr) => {
      const next = [p, ...arr];
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new Event(UPDATE_EVENT)); } catch {}
      return next;
    });
    return p;
  };

  const update = (p: Project) => {
    setProjects((arr) => {
      const next = arr.map((x) => (x.id === p.id ? p : x));
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new Event(UPDATE_EVENT)); } catch {}
      return next;
    });
  };

  const remove = (id: string) => {
    setProjects((arr) => {
      const next = arr.filter((x) => x.id !== id);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new Event(UPDATE_EVENT)); } catch {}
      return next;
    });
  };

  const removeMany = (ids: string[]) => {
    const idSet = new Set(ids);
    setProjects((arr) => {
      const next = arr.filter((x) => !idSet.has(x.id));
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new Event(UPDATE_EVENT)); } catch {}
      return next;
    });
  };

  const get = (id: string) => projects.find((p) => p.id === id) ?? null;

  const listSharedWith = (email: string) =>
    projects.filter((p) => p.invites?.some((i: Invite) => i.email === email) || p.generalAccess !== 'private');

  return { projects, create, update, remove, removeMany, get, listSharedWith } as const;
}


// Favorites are stored per-user (by email) as a set of project IDs
const favKey = (email: string) => `asu-ai-forge:favorites:${email || 'anon'}`;

export function useFavoriteProjects(email: string) {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem(favKey(email));
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });
  React.useEffect(() => {
    try { window.localStorage.setItem(favKey(email), JSON.stringify(favoriteIds)); } catch {}
  }, [email, favoriteIds]);

  const isFavorite = (id: string) => favoriteIds.includes(id);
  const toggleFavorite = (id: string) => {
    setFavoriteIds((ids) => ids.includes(id) ? ids.filter(x => x !== id) : [id, ...ids]);
  };
  return { favoriteIds, isFavorite, toggleFavorite } as const;
}


