import React from 'react';

type Props = { open: boolean; onClose: () => void };

export default function ProviderKeysModal({ open, onClose }: Props) {
  const [openaiKey, setOpenaiKey] = React.useState('');
  const [geminiKey, setGeminiKey] = React.useState('');
  const [metaKey, setMetaKey] = React.useState('');
  const [novaKey, setNovaKey] = React.useState('');
  const [o1Key, setO1Key] = React.useState('');
  const [titanKey, setTitanKey] = React.useState('');
  const [awsKey, setAWSKey] = React.useState('');

  React.useEffect(() => {
    if (open) {
      try {
        setOpenaiKey(window.localStorage.getItem('asu-ai-forge:OPENAI_API_KEY') || '');
        setGeminiKey(window.localStorage.getItem('asu-ai-forge:GEMINI_API_KEY') || '');
        setMetaKey(window.localStorage.getItem('asu-ai-forge:META_API_KEY') || '');
        setNovaKey(window.localStorage.getItem('asu-ai-forge:NOVA_API_KEY') || '');
        setO1Key(window.localStorage.getItem('asu-ai-forge:O1_API_KEY') || '');
        setTitanKey(window.localStorage.getItem('asu-ai-forge:TITAN_API_KEY') || '');
        setAWSKey(window.localStorage.getItem('asu-ai-forge:AWS_API_KEY') || '');
      } catch {}
    }
  }, [open]);

  if (!open) return null;

  const save = () => {
    try {
      window.localStorage.setItem('asu-ai-forge:OPENAI_API_KEY', openaiKey.trim());
      window.localStorage.setItem('asu-ai-forge:GEMINI_API_KEY', geminiKey.trim());
      window.localStorage.setItem('asu-ai-forge:META_API_KEY', metaKey.trim());
      window.localStorage.setItem('asu-ai-forge:NOVA_API_KEY', novaKey.trim());
      window.localStorage.setItem('asu-ai-forge:O1_API_KEY', o1Key.trim());
      window.localStorage.setItem('asu-ai-forge:TITAN_API_KEY', titanKey.trim());
      window.localStorage.setItem('asu-ai-forge:AWS_API_KEY', awsKey.trim());
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-asu-gray-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Provider Keys</div>
          <button className="text-asu-maroon" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-asu-gray-700">OpenAI API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-..." />
            <div className="mt-1 text-xs text-asu-gray-700">Stored locally in your browser. Leave blank to use mock responses.</div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Google Gemini API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIza..." />
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Meta Llama API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={metaKey} onChange={(e) => setMetaKey(e.target.value)} placeholder="LLM|..." />
            <div className="mt-1 text-xs text-asu-gray-700">
              Get your API key from the{' '}
              <a href="https://llama.developer.meta.com" target="_blank" rel="noopener noreferrer" className="text-asu-maroon underline">
                Llama Developer Portal
              </a>
              . Format: LLM|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Nova API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={novaKey} onChange={(e) => setNovaKey(e.target.value)} placeholder="nova_..." />
            <div className="mt-1 text-xs text-asu-gray-700">
              Enter your Nova API key. Format: nova_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">O1 API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={o1Key} onChange={(e) => setO1Key(e.target.value)} placeholder="o1_..." />
            <div className="mt-1 text-xs text-asu-gray-700">
              Enter your O1 API key. Format: o1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">Titan API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={titanKey} onChange={(e) => setTitanKey(e.target.value)} placeholder="titan_..." />
            <div className="mt-1 text-xs text-asu-gray-700">
              Enter your Titan API key. Format: titan_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          <div>
            <label className="text-sm text-asu-gray-700">AWS API Key</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-asu-gray-300 bg-white px-3 py-2" value={awsKey} onChange={(e) => setAWSKey(e.target.value)} placeholder="AKIA..." />
            <div className="mt-1 text-xs text-asu-gray-700">
              Enter your AWS API key. Format: AKIAxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="rounded-full border border-asu-gray-300 bg-white px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="rounded-full bg-asu-maroon px-4 py-2 text-white" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


