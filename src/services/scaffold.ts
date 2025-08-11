import { Project } from '../types';

function getOpenAIKey(): string | null {
  try { return window.localStorage.getItem('asu-ai-forge:OPENAI_API_KEY'); } catch { return null; }
}
function getGeminiKey(): string | null {
  try { return window.localStorage.getItem('asu-ai-forge:GEMINI_API_KEY'); } catch { return null; }
}

type Scaffold = Partial<Project>;

const SYSTEM_PROMPT = `You are an AI app scaffold generator. Given a user idea, output a compact JSON with keys: projectName, description, category(one of: Teaching, Assessment, Student, Assistant), systemInstructions, suggestedModel(one of: 'gpt-4.1','gpt-4o','gemini-1.5-pro','claude-3-sonnet','llama-3.1-70b-instruct'). Keep it minimal.`;

export async function scaffoldProjectFromPrompt(prompt: string): Promise<Scaffold> {
  const openai = getOpenAIKey();
  const gemini = getGeminiKey();
  const user = prompt.trim();
  // Try OpenAI first
  if (openai) {
    try {
      const body = {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: user },
        ],
        temperature: 0.2,
        max_tokens: 300,
      };
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openai}` },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      const text: string = data?.choices?.[0]?.message?.content || '';
      const json = safeParseJson(text);
      if (json) return mapToProject(json);
    } catch {}
  }
  // Fallback to Gemini
  if (gemini) {
    try {
      const body = {
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'user', parts: [{ text: user }] },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      };
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${gemini}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await resp.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const json = safeParseJson(text);
      if (json) return mapToProject(json);
    } catch {}
  }
  // Heuristic fallback
  return heuristicScaffold(user);
}

function safeParseJson(text: string): any | null {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function mapToProject(obj: any): Scaffold {
  const name: string = obj.projectName || 'Untitled Project';
  const desc: string = obj.description || '';
  const category: string | undefined = obj.category;
  const system: string = obj.systemInstructions || '';
  return { projectName: name, description: desc, category, systemInstructions: system };
}

function heuristicScaffold(input: string): Scaffold {
  const lowered = input.toLowerCase();
  const category = lowered.includes('quiz') || lowered.includes('grade') ? 'Assessment'
    : lowered.includes('study') || lowered.includes('student') ? 'Student'
    : lowered.includes('faq') || lowered.includes('assistant') ? 'Assistant'
    : 'Teaching';
  const projectName = input.length > 3 ? capitalize(input.slice(0, 60)) : 'Untitled Project';
  const description = input;
  const systemInstructions = `You are ${projectName}, an AI assistant for ${category}. Be helpful and concise.`;
  return { projectName, description, category, systemInstructions };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


