import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onScaffold: (prompt: string) => void;
};

export default function GuidedSetupModal({ open, onClose, onScaffold }: Props) {
  const [type, setType] = React.useState('Course FAQ chatbot');
  const [subject, setSubject] = React.useState('');
  const [audience, setAudience] = React.useState('Students');
  const [includeRag, setIncludeRag] = React.useState(true);
  const [ragTopK, setRagTopK] = React.useState(6);
  const [notes, setNotes] = React.useState('');

  if (!open) return null;

  const submit = () => {
    const details = [
      `Project type: ${type}`,
      subject ? `Subject/course: ${subject}` : '',
      audience ? `Audience: ${audience}` : '',
      includeRag ? `Enable RAG with topK=${ragTopK}` : 'RAG disabled',
      notes ? `Notes: ${notes}` : '',
    ].filter(Boolean).join('\n');

    const prompt = `Create an AI project with the following details.\n${details}\nReturn: projectName, description, category, and systemInstructions.`;
    onScaffold(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Guided setup</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="text-sm text-asu-gray-700">Project type</label>
              <select className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Course FAQ chatbot</option>
                <option>Study guide assistant</option>
                <option>Rubric builder</option>
                <option>Research support</option>
                <option>Presentation & reporting</option>
                <option>Instructional design & training</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-asu-gray-700">Audience</label>
              <select className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option>Students</option>
                <option>Instructors</option>
                <option>Staff</option>
                <option>General</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Subject or course (optional)</label>
            <input className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., BIO 101" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-asu-gray-700">
              <input type="checkbox" className="h-4 w-4" checked={includeRag} onChange={(e) => setIncludeRag(e.target.checked)} />
              Enable RAG
            </label>
            {includeRag && (
              <div>
                <label className="text-sm text-asu-gray-700">Top K</label>
                <input type="number" min={1} className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={ragTopK} onChange={(e) => setRagTopK(Number(e.target.value))} />
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Notes (optional)</label>
            <textarea className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else to tailor the setup" />
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button className="rounded-full border border-asu-gray-300 bg-white px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="rounded-full bg-asu-maroon px-4 py-2 text-white" onClick={submit}>Create project</button>
          </div>
        </div>
      </div>
    </div>
  );
}


