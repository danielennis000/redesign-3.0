import React from 'react';

const EMAIL_KEY = 'asu-ai-forge:current-user-email';
const NAME_KEY = 'asu-ai-forge:current-user-name';

export function useCurrentUserEmail() {
  const [email, setEmail] = React.useState<string>(() => {
    try {
      return window.localStorage.getItem(EMAIL_KEY) || '';
    } catch {
      return '';
    }
  });
  React.useEffect(() => {
    try {
      window.localStorage.setItem(EMAIL_KEY, email);
    } catch {}
  }, [email]);
  return { email, setEmail } as const;
}

export function useCurrentUserProfile() {
  const { email, setEmail } = useCurrentUserEmail();
  const [name, setName] = React.useState<string>(() => {
    try {
      return window.localStorage.getItem(NAME_KEY) || '';
    } catch {
      return '';
    }
  });
  React.useEffect(() => {
    try {
      window.localStorage.setItem(NAME_KEY, name);
    } catch {}
  }, [name]);
  return { email, setEmail, name, setName } as const;
}

type ModalProps = { open: boolean; onClose: () => void };

export function ProfileModal({ open, onClose }: ModalProps) {
  const { email, setEmail, name, setName } = useCurrentUserProfile();
  const [draftEmail, setDraftEmail] = React.useState(email);
  const [draftName, setDraftName] = React.useState(name);
  React.useEffect(() => {
    if (open) {
      setDraftEmail(email);
      setDraftName(name);
    }
  }, [open, email, name]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Profile</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-asu-gray-700">Preferred name</label>
            <input className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g., Daniel" />
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Email</label>
            <input className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} placeholder="you@asu.edu" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="rounded-full border border-asu-gray-300 bg-white px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="rounded-full bg-asu-maroon px-4 py-2 text-white" onClick={() => { setEmail(draftEmail); setName(draftName); onClose(); }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


