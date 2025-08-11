import React from 'react';
import { Project } from '../types';

type Props = {
  project: Project;
  onOpen: (p: Project) => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  currentUserEmail?: string;
};

export default function ProjectRow({ project, onOpen, isFavorite, onToggleFavorite, currentUserEmail }: Props) {
  const initials = React.useMemo(() => {
    const name = project.projectName || 'AI';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');
  }, [project.projectName]);

  const sharedOwner = React.useMemo(() => {
    const owner = project.ownerEmail || '';
    const me = currentUserEmail || '';
    if (!owner) return '';
    if (me && owner.toLowerCase() === me.toLowerCase()) return '';
    return owner;
  }, [project.ownerEmail, currentUserEmail]);

  const favorite = isFavorite ? isFavorite(project.id) : false;
  const toggle = () => onToggleFavorite && onToggleFavorite(project.id);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="min-w-0 flex items-center gap-3">
        {project.profileImageDataUrl ? (
          <img src={project.profileImageDataUrl} alt="Project avatar" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-asu-gray-300 text-asu-black flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{project.projectName}</div>
          <div className="mt-0.5 truncate text-sm text-asu-gray-700">{project.description || 'No description'}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-asu-gray-700">
            {project.category && (
              <span className="rounded-full bg-asu-gray-200 px-2 py-0.5 text-[11px] text-asu-gray-700">{project.category}</span>
            )}
            {sharedOwner && (
              <span className="rounded-full bg-asu-gray-200 px-2 py-0.5 text-[11px] text-asu-gray-700">Shared by {sharedOwner}</span>
            )}
            <span className="hidden sm:inline">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3 text-sm">
        {onToggleFavorite && (
          <button onClick={toggle} className={`rounded-full border px-3 py-1 ${favorite ? 'border-asu-maroon text-asu-maroon' : 'border-asu-gray-300 text-asu-black'}`}>{favorite ? '★' : '☆'}</button>
        )}
        <button onClick={() => onOpen(project)} className="rounded-full border border-asu-gray-300 px-3 py-1">Open</button>
      </div>
    </div>
  );
}


