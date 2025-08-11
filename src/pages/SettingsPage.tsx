import React from 'react';
import Sidebar from '../components/Sidebar';
import { useCurrentUserProfile } from '../components/UserProfile';

type UserPrefs = {
  personality: string;
  interactionStyle: 'concise' | 'friendly' | 'technical';
  alwaysKnow: string; // facts the AI should always know
};

const KEY = 'asu-ai-forge:user-prefs';

function useUserPrefs() {
  const [prefs, setPrefs] = React.useState<UserPrefs>(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as UserPrefs) : { personality: '', interactionStyle: 'friendly', alwaysKnow: '' };
    } catch {
      return { personality: '', interactionStyle: 'friendly', alwaysKnow: '' };
    }
  });
  React.useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs]);
  return { prefs, setPrefs } as const;
}

export default function SettingsPage() {
  const { prefs, setPrefs } = useUserPrefs();
  const { name, setName, email, setEmail } = useCurrentUserProfile();
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-asu-gray-700">Control how the AI interacts with you and what it should always know.</p>
          </header>
          <div className="grid gap-4 lg:max-w-3xl">
            <section className="rounded-xl border border-asu-gray-300 bg-white p-4">
              <div className="mb-2 text-base font-semibold">Profile</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-asu-gray-700">Preferred name</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-asu-gray-300 px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Daniel"
                  />
                </div>
                <div>
                  <label className="text-sm text-asu-gray-700">Email</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-asu-gray-300 px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@asu.edu"
                  />
                </div>
              </div>
            </section>
            <section className="rounded-xl border border-asu-gray-300 bg-white p-4">
              <div className="mb-2 text-base font-semibold">Personality</div>
              <textarea className="w-full rounded-lg border border-asu-gray-300 px-3 py-2" rows={4} value={prefs.personality} onChange={(e) => setPrefs({ ...prefs, personality: e.target.value })} placeholder="E.g., encouraging mentor, humorous, direct…" />
            </section>
            <section className="rounded-xl border border-asu-gray-300 bg-white p-4">
              <div className="mb-2 text-base font-semibold">Interaction preferences</div>
              <select className="rounded-lg border border-asu-gray-300 px-3 py-2" value={prefs.interactionStyle} onChange={(e) => setPrefs({ ...prefs, interactionStyle: e.target.value as UserPrefs['interactionStyle'] })}>
                <option value="concise">Concise</option>
                <option value="friendly">Friendly</option>
                <option value="technical">Technical</option>
              </select>
            </section>
            <section className="rounded-xl border border-asu-gray-300 bg-white p-4">
              <div className="mb-2 text-base font-semibold">Always know</div>
              <textarea className="w-full rounded-lg border border-asu-gray-300 px-3 py-2" rows={4} value={prefs.alwaysKnow} onChange={(e) => setPrefs({ ...prefs, alwaysKnow: e.target.value })} placeholder="E.g., my name is…, I teach…, my class size is…, etc." />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}


