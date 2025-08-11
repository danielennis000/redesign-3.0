import React from 'react';
import { Project, Invite } from '../types';
import { LinkIcon } from './icons';

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdate: (p: Project) => void;
};

type Access = 'private' | 'view' | 'edit';

export default function ShareModal({ open, project, onClose, onUpdate }: Props) {
  const [access, setAccess] = React.useState<Access>('private');
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [invites, setInvites] = React.useState<Invite[]>([]);

  React.useEffect(() => {
    if (open && project) {
      setInviteEmail('');
      setInvites(project.invites || []);
      setAccess(project.generalAccess || 'private');
    }
  }, [open, project]);

  if (!open || !project) return null;

  const copyLink = async () => {
    const url = `${window.location.origin}/project/${project.id}`;
    try {
      await navigator.clipboard.writeText(url);
      // no toast framework, keep silent
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Share “{project.projectName}”</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-asu-gray-700">General access</label>
            <select className="rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={access} onChange={(e) => setAccess(e.target.value as Access)}>
              <option value="private">Restricted — only invited</option>
              <option value="view">Anyone with link can view</option>
              <option value="edit">Anyone with link can edit</option>
            </select>
            <div className="flex items-center gap-2">
              <button onClick={copyLink} className="flex items-center gap-2 rounded-full border border-asu-gray-300 bg-white px-3 py-1.5 text-sm">
                <LinkIcon /> Copy link
              </button>
              <div className="text-xs text-asu-gray-700">Link: {window.location.origin}/project/{project.id}</div>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-asu-gray-700">Invite people</label>
            <div className="flex gap-2">
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@asu.edu" className="flex-1 rounded-lg border border-asu-gray-300 bg-white px-3 py-2" />
              <select id="role" className="rounded-lg border border-asu-gray-300 bg-white px-3 py-2">
                <option value="view">Viewer</option>
                <option value="edit">Editor</option>
              </select>
              <button className="rounded-full bg-asu-maroon px-3 py-2 text-sm text-white" onClick={() => {
                const role = (document.getElementById('role') as HTMLSelectElement).value as 'view' | 'edit';
                if (!inviteEmail) return;
                setInvites((v) => [...v, { email: inviteEmail, role }]);
                setInviteEmail('');
              }}>Invite</button>
            </div>
            <div className="grid gap-2">
              {invites.map((i) => (
                <div key={i.email} className="flex items-center justify-between rounded-lg border border-asu-gray-300 bg-white px-3 py-2">
                  <div className="text-sm">{i.email}</div>
                  <div className="text-xs text-asu-gray-700">{i.role === 'edit' ? 'Editor' : 'Viewer'}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="rounded-full border border-asu-gray-300 bg-white px-4 py-2" onClick={onClose}>Close</button>
            <button className="rounded-full bg-asu-maroon px-4 py-2 text-white" onClick={() => {
              const next: Project = {
                ...project,
                invites,
                generalAccess: access,
                updatedAt: new Date().toISOString(),
              };
              onUpdate(next);
              onClose();
            }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


