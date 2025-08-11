import { Project } from '../types';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function getOpenAIKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:OPENAI_API_KEY');
  } catch {
    return null;
  }
}

function getGeminiKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:GEMINI_API_KEY');
  } catch {
    return null;
  }
}

function getMetaKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:META_API_KEY');
  } catch {
    return null;
  }
}

function getNovaKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:NOVA_API_KEY');
  } catch {
    return null;
  }
}

function getO1Key(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:O1_API_KEY');
  } catch {
    return null;
  }
}

function getTitanKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:TITAN_API_KEY');
  } catch {
    return null;
  }
}

function getAWSKey(): string | null {
  try {
    return window.localStorage.getItem('asu-ai-forge:AWS_API_KEY');
  } catch {
    return null;
  }
}

export async function chatOnce(project: Project, messages: ChatMessage[]): Promise<string> {
  const openaiKey = getOpenAIKey();
  const geminiKey = getGeminiKey();
  const metaKey = getMetaKey();
  const novaKey = getNovaKey();
  const o1Key = getO1Key();
  const titanKey = getTitanKey();
  const awsKey = getAWSKey();

  // If no keys, return a mocked response
  if (!openaiKey && !geminiKey && !metaKey && !novaKey && !o1Key && !titanKey && !awsKey) {
    const user = [...messages].reverse().find((m) => m.role === 'user');
    const input = user?.content ?? '';
    const ragInfo = project.rag.enabled ? `RAG(topK=${project.rag.topK})` : 'RAG(disabled)';
    const memoryInfo = project.memory.enabled ? `memory(window=${project.memory.window})` : 'memory(disabled)';
    return `Mocked ${project.model.provider}/${project.model.label} (temp=${project.temperature}, tokens=${project.outputTokens}) with ${ragInfo}, ${memoryInfo}.
System: ${project.systemInstructions || '(none)'}
Input: ${input}
— This is a simulated response. Set a provider key in Provider Keys to call real models.`;
  }

  // Route by provider
  if (project.model.provider === 'OpenAI' && openaiKey) {
    const body = {
      model: project.model.id,
      messages: [
        ...(project.systemInstructions ? [{ role: 'system', content: project.systemInstructions }] : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: project.outputTokens,
      temperature: project.temperature,
    } as const;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenAI error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  if (project.model.provider === 'Google' && geminiKey) {
    const sys = project.systemInstructions
      ? [{ role: 'user', parts: [{ text: project.systemInstructions }] }]
      : [];
    const userText = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    const body = {
      contents: [
        ...sys,
        { role: 'user', parts: [{ text: userText }] },
      ],
      generationConfig: {
        temperature: project.temperature,
        maxOutputTokens: project.outputTokens,
      },
    } as const;
    const model = project.model.id;
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Gemini error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    const out = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return out ?? '';
  }

  if (project.model.provider === 'Meta' && metaKey) {
    const body = {
      model: project.model.id,
      messages: [
        ...(project.systemInstructions ? [{ role: 'system', content: project.systemInstructions }] : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: project.outputTokens,
      temperature: project.temperature,
      stream: false,
    } as const;

    try {
      const resp = await fetch('https://api.llama.com/compat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${metaKey}`,
        },
        body: JSON.stringify(body),
      });
      
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Llama API error: ${resp.status} ${text}`);
      }
      
      const data = await resp.json();
      return data.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      console.error('Llama API call failed:', error);
      throw new Error(`Llama API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (project.model.provider === 'Nova' && novaKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    return `Nova API call placeholder for model ${project.model.id}. Your prompt: ${lastUser?.content ?? ''}. Configure a Nova endpoint to enable real calls.`;
  }

  if (project.model.provider === 'O1' && o1Key) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    return `O1 API call placeholder for model ${project.model.id}. Your prompt: ${lastUser?.content ?? ''}. Configure an O1 endpoint to enable real calls.`;
  }

  if (project.model.provider === 'Titan' && titanKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    return `Titan API call placeholder for model ${project.model.id}. Your prompt: ${lastUser?.content ?? ''}. Configure a Titan endpoint to enable real calls.`;
  }

  if (project.model.provider === 'AWS' && awsKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    return `AWS API call placeholder for model ${project.model.id}. Your prompt: ${lastUser?.content ?? ''}. Configure an AWS endpoint to enable real calls.`;
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  return `No matching provider key for ${project.model.provider}. Prompt: ${lastUser?.content ?? ''}`;
}


