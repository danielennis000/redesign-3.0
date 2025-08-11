export type Provider =
  | 'OpenAI'
  | 'Anthropic'
  | 'Google'
  | 'Mistral'
  | 'Meta'
  | 'Nova'
  | 'O1'
  | 'Titan'
  | 'AWS';

export type ModelOption = {
  provider: Provider;
  id: string;
  label: string;
  contextWindow: number;
  description: string;
};

export type RagSettings = {
  enabled: boolean;
  topK: number;
  chunkSize: number;
  overlap: number;
};

export type MemorySettings = {
  enabled: boolean;
  window: number; // number of messages to retain
};

export type KnowledgeFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  // Optional data URL preview for images/small files
  dataUrl?: string;
  // Optional extracted text for text-based files (.txt, .md, .json)
  text?: string;
  addedAt: string;
};

export type Invite = {
  email: string;
  role: 'view' | 'edit';
};

export type ViewerConfig = {
  enableChat: boolean;
  showDescription: boolean;
  allowFileUpload: boolean;
  allowDictation: boolean;
  exposeModelPicker?: boolean;
  exposeTemperature?: boolean;
};

export type Project = {
  id: string;
  projectName: string;
  displayName: string;
  description: string;
  category?: string; // e.g., Teaching, Assessment, Student, Assistant
  ownerEmail?: string;
  profileImageDataUrl?: string;
  enableDictation: boolean;
  systemInstructions: string;
  model: ModelOption;
  temperature: number; // 0..2
  outputTokens: number; // max output tokens
  rag: RagSettings;
  memory: MemorySettings;
  knowledgeBase: KnowledgeFile[];
  // Sharing
  generalAccess: 'private' | 'view' | 'edit';
  invites: Invite[];
  viewerConfig: ViewerConfig;
  createdAt: string;
  updatedAt: string;
};

export const MODEL_OPTIONS: ModelOption[] = [
  // AWS Models
  { provider: 'AWS', id: 'claude3_opus', label: 'Claude 3 Opus', contextWindow: 200000, description: 'High cost, with most advanced intelligence' },
  { provider: 'AWS', id: 'llama3-405b', label: 'Llama 3 405B', contextWindow: 128000, description: 'High-capacity reasoning' },
  { provider: 'AWS', id: 'nova-pro', label: 'Nova Pro', contextWindow: 300000, description: 'General-purpose multimodal model' },
  { provider: 'AWS', id: 'llama3_2-3b', label: 'Llama 3.2 3B', contextWindow: 128000, description: 'Efficient chat model' },
  { provider: 'AWS', id: 'claude2_1', label: 'Claude 2.1', contextWindow: 100000, description: 'Stable general-purpose chat' },
  { provider: 'AWS', id: 'claude3_sonnet', label: 'Claude 3 Sonnet', contextWindow: 200000, description: 'Recommended for creative tasks' },
  { provider: 'AWS', id: 'nova-lite', label: 'Nova Lite', contextWindow: 300000, description: 'Efficient multimodal text & vision' },
  { provider: 'AWS', id: 'nova-micro', label: 'Nova Micro', contextWindow: 128000, description: 'Low-latency text completions' },
  { provider: 'AWS', id: 'mistral-7b', label: 'Mistral 7B', contextWindow: 8000, description: 'Efficient general-purpose text' },
  { provider: 'AWS', id: 'llama3_2-90b', label: 'Llama 3.2 90B', contextWindow: 128000, description: 'Multimodal vision & chat' },
  { provider: 'AWS', id: 'llama3-70b', label: 'Llama 3 70B', contextWindow: 128000, description: 'High-quality text generation' },
  { provider: 'AWS', id: 'llama3-8b', label: 'Llama 3 8B', contextWindow: 128000, description: 'Balanced chat performance' },
  { provider: 'AWS', id: 'claude3_haiku', label: 'Claude 3 Haiku', contextWindow: 200000, description: 'Fast, low-latency tasks' },
  { provider: 'AWS', id: 'mistral-large', label: 'Mistral Large', contextWindow: 128000, description: 'High-quality text modeling' },
  { provider: 'AWS', id: 'claudeinstant', label: 'Claude Instant', contextWindow: 100000, description: 'Fast chat & QA' },
  { provider: 'AWS', id: 'claude3_7_sonnet', label: 'Claude 3.7 Sonnet', contextWindow: 200000, description: 'Advanced creative and coding tasks' },
  { provider: 'AWS', id: 'claude2', label: 'Claude 2', contextWindow: 100000, description: 'General-purpose chat' },
  { provider: 'AWS', id: 'llama3_2-1b', label: 'Llama 3.2 1B', contextWindow: 128000, description: 'Lightweight chat model' },
  { provider: 'AWS', id: 'titang1lite', label: 'Titan G1 Lite', contextWindow: 4000, description: 'Lightweight text tasks' },
  { provider: 'AWS', id: 'titang1express', label: 'Titan G1 Express', contextWindow: 8000, description: 'Express embeddings' },
  { provider: 'AWS', id: 'mistral-8x7b', label: 'Mistral 8x7B', contextWindow: 128000, description: 'Ensemble efficiency' },
  { provider: 'AWS', id: 'claude3_5_sonnet', label: 'Claude 3.5 Sonnet', contextWindow: 200000, description: 'High-speed intelligent tasks' },
  { provider: 'AWS', id: 'llama3_2-11b', label: 'Llama 3.2 11B', contextWindow: 128000, description: 'Vision-enabled chat' },

  // OpenAI Models
  { provider: 'OpenAI', id: 'o1', label: 'O1', contextWindow: 200000, description: 'Recommended for reasoning' },
  { provider: 'OpenAI', id: 'gpt4-32k', label: 'GPT-4 32K', contextWindow: 32000, description: 'Large context comprehension' },
  { provider: 'OpenAI', id: 'gpt3_5-16k', label: 'GPT-3.5 Turbo 16K', contextWindow: 16000, description: 'Extended context chat' },
  { provider: 'OpenAI', id: 'o3-mini', label: 'O3 Mini', contextWindow: 200000, description: 'Fast reasoning & chat' },
  { provider: 'OpenAI', id: 'o3', label: 'O3', contextWindow: 200000, description: 'Recommended for complex reasoning' },
  { provider: 'OpenAI', id: 'gpt4_1-nano', label: 'GPT-4.1 Nano', contextWindow: 1000000, description: 'Compact multimodal chat' },
  { provider: 'OpenAI', id: 'gpt4_1', label: 'GPT-4.1', contextWindow: 1000000, description: 'Vision-enabled GPT-4' },
  { provider: 'OpenAI', id: 'gpt4_1-mini', label: 'GPT-4.1 Mini', contextWindow: 1000000, description: 'Great for quick coding and analysis' },
  { provider: 'OpenAI', id: 'gpt4o_mini', label: 'GPT-4o Mini', contextWindow: 128000, description: 'Cost effective for most tasks' },
  { provider: 'OpenAI', id: 'gpt4o', label: 'GPT-4o', contextWindow: 128000, description: 'Great for most tasks' },
  { provider: 'OpenAI', id: 'gpt4turbo', label: 'GPT-4 Turbo', contextWindow: 128000, description: 'Optimized GPT-4' },
  { provider: 'OpenAI', id: 'gpt3_5', label: 'GPT-3.5 Turbo', contextWindow: 4000, description: 'Efficient chat model' },
  { provider: 'OpenAI', id: 'o4-mini', label: 'O4 Mini', contextWindow: 200000, description: 'Cost-efficient reasoning' },

  // Google (Gemini API)
  { provider: 'Google', id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', contextWindow: 1000000, description: 'Adaptive thinking, cost efficiency' },
  { provider: 'Google', id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', contextWindow: 1000000, description: 'Next generation features, speed, and realtime streaming' },
  { provider: 'Google', id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', contextWindow: 1000000, description: 'Cost efficiency and low latency' },

  // Meta (Llama API models)
  { provider: 'Meta', id: 'Llama-4-Maverick-17B-128E-Instruct-FP8', label: 'Llama 4 Maverick 17B', contextWindow: 128000, description: 'Industry-leading multimodal model with 128 experts' },
  { provider: 'Meta', id: 'Llama-4-Scout-17B-16E-Instruct-FP8', label: 'Llama 4 Scout 17B', contextWindow: 128000, description: 'Class-leading multimodal model with superior intelligence' },
];

export function createDefaultProject(partial?: Partial<Project>): Project {
  const now = new Date().toISOString();
  const defaultModel = MODEL_OPTIONS[0];
  return {
    id: crypto.randomUUID(),
    projectName: 'Untitled Project',
    displayName: 'My AI',
    description: '',
    enableDictation: false,
    systemInstructions: '',
    model: defaultModel,
    temperature: 0.7,
    outputTokens: 1024,
    rag: { enabled: false, topK: 5, chunkSize: 800, overlap: 120 },
    memory: { enabled: true, window: 20 },
    knowledgeBase: [],
    generalAccess: 'private',
    invites: [],
    viewerConfig: {
      enableChat: true,
      showDescription: true,
      allowFileUpload: false,
      allowDictation: false,
      exposeModelPicker: false,
      exposeTemperature: false,
    },
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}


