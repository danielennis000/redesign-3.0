import React from 'react';
import { Project } from '../types';

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
};

export default function BuildModal({ open, project, onClose }: Props) {
  const [building, setBuilding] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!open) {
      setBuilding(false);
      setLogs([]);
    }
  }, [open]);

  if (!open || !project) return null;

  const runBuild = async () => {
    setBuilding(true);
    setLogs((l) => [...l, 'Starting build…']);
    await new Promise((r) => setTimeout(r, 400));
    setLogs((l) => [...l, `Preparing project ${project.projectName} (${project.model.provider} / ${project.model.label})`]);
    await new Promise((r) => setTimeout(r, 600));
    if (project.rag.enabled) {
      setLogs((l) => [...l, `Indexing ${project.knowledgeBase.length} knowledge files…`]);
      await new Promise((r) => setTimeout(r, 600));
    }
    setLogs((l) => [...l, 'Optimizing prompt and safety settings…']);
    await new Promise((r) => setTimeout(r, 600));
    setLogs((l) => [...l, 'Generating deployment artifacts…']);
    await new Promise((r) => setTimeout(r, 800));
    setLogs((l) => [...l, 'Build complete. Deployment preview available.']);
    setBuilding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Build “{project.projectName}”</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>
        <div className="text-sm text-asu-gray-700">This simulates a build and shows progress logs.</div>

        <div className="mt-3 h-56 overflow-auto rounded-lg border border-asu-gray-300 bg-asu-gray-100 p-3 text-sm">
          {logs.map((line, idx) => (
            <div key={idx} className="font-mono">{line}</div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button disabled={building} className="rounded-full border border-asu-gray-300 bg-white px-4 py-2 disabled:opacity-50" onClick={onClose}>Close</button>
          <button disabled={building} className="rounded-full bg-asu-maroon px-4 py-2 text-white disabled:opacity-50" onClick={runBuild}>{building ? 'Building…' : 'Run build'}</button>
        </div>
      </div>
    </div>
  );
}


