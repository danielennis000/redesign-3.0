import React from 'react';

export type SectionKey = 'hero' | 'quickStart' | 'templates' | 'recent' | 'shared' | 'favorites';

export type LayoutPrefs = {
  order: SectionKey[];
  visibility: Record<SectionKey, boolean>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  prefs: LayoutPrefs;
  setPrefs: (next: LayoutPrefs) => void;
};

const labels: Record<SectionKey, string> = {
  hero: 'Hero (Prompt Builder)',
  quickStart: 'Quick Start',
  templates: 'Teaching Templates',
  recent: 'Recent Projects',
  shared: 'Shared With Me',
  favorites: 'Favorites'
};

export default function LayoutSettingsModal({ open, onClose, prefs, setPrefs }: Props) {
  // Normalize persisted preferences (remove unknown keys, add missing ones)
  const ALL_SECTIONS: SectionKey[] = ['hero', 'quickStart', 'templates', 'favorites', 'recent', 'shared'];
  const order = React.useMemo(() => {
    const validOnly = (prefs.order || []).filter((k: any): k is SectionKey => ALL_SECTIONS.includes(k as SectionKey));
    const missing = ALL_SECTIONS.filter((k) => !validOnly.includes(k));
    return [...validOnly, ...missing];
  }, [prefs.order]);

  React.useEffect(() => {
    const vis: Record<SectionKey, boolean> = { ...prefs.visibility } as any;
    let changed = false;
    // Drop visibility for unknown keys
    for (const key of Object.keys(vis)) {
      if (!ALL_SECTIONS.includes(key as SectionKey)) {
        delete (vis as any)[key];
        changed = true;
      }
    }
    // Ensure every section has a visibility value
    ALL_SECTIONS.forEach((k) => {
      if (vis[k] === undefined) {
        vis[k] = true;
        changed = true;
      }
    });
    // Ensure order is normalized
    const validOnly = (prefs.order || []).filter((k: any): k is SectionKey => ALL_SECTIONS.includes(k as SectionKey));
    const missing = ALL_SECTIONS.filter((k) => !validOnly.includes(k));
    const normalizedOrder = [...validOnly, ...missing];
    if (changed || normalizedOrder.join('|') !== (prefs.order || []).join('|')) {
      setPrefs({ ...prefs, order: normalizedOrder, visibility: vis });
    }
  }, [prefs, setPrefs]);

  if (!open) return null;

  const move = (key: SectionKey, delta: number) => {
    const idx = order.indexOf(key);
    if (idx === -1) return;
    const next = [...order];
    const target = idx + delta;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setPrefs({ ...prefs, order: next });
  };

  const toggle = (key: SectionKey) => {
    setPrefs({
      ...prefs,
      visibility: { ...prefs.visibility, [key]: !prefs.visibility[key] },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Layout settings</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>

        <div className="text-sm text-asu-gray-700">
          Reorder sections or toggle visibility. Your preferences are saved to this device.
        </div>

        <div className="mt-4 grid gap-2">
          {order.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-asu-gray-300 p-3">
              <div className="flex items-center gap-3">
                <input
                  id={`vis-${key}`}
                  type="checkbox"
                  className="h-4 w-4"
                  checked={!!prefs.visibility[key]}
                  onChange={() => toggle(key)}
                />
                <label htmlFor={`vis-${key}`} className="select-none">
                  {labels[key]}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-asu-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  onClick={() => move(key, -1)}
                  disabled={order.indexOf(key) === 0}
                >Up</button>
                <button
                  className="rounded-full border border-asu-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  onClick={() => move(key, 1)}
                  disabled={order.indexOf(key) === order.length - 1}
                >Down</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
