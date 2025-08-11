import React from 'react';

export type LearnArticle = {
  id: string;
  title: string;
  summary: string;
  category: 'Getting Started' | 'Prompting' | 'Models & Parameters' | 'Knowledge & RAG' | 'Building & Iteration' | 'Sharing & Deployment' | 'Troubleshooting';
  tags: string[];
  content: React.ReactNode;
};

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-asu-gray-800">{children}</p>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-6 text-lg font-semibold">{children}</h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-4 text-base font-semibold">{children}</h3>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <pre className="mt-3 overflow-auto rounded-lg border border-asu-gray-300 bg-asu-gray-100 p-3 text-sm text-asu-black">{children}</pre>
);

const Callout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-3 rounded-lg border border-info-blue/30 bg-info-blue/10 p-3">
    <div className="text-sm font-semibold text-asu-black">{title}</div>
    <div className="mt-1 text-sm text-asu-gray-800">{children}</div>
  </div>
);

export const ARTICLES: LearnArticle[] = [
  {
    id: 'getting-started-overview',
    title: 'Overview: Build your first AI project',
    summary: 'A quick, opinionated path from idea to working project in the ASU AI Portal.',
    category: 'Getting Started',
    tags: ['overview', 'first-project'],
    content: (
      <div>
        <Callout title="Outcome">
          You’ll create a named project, configure a model, optionally add knowledge, and test an example within ~10 minutes.
        </Callout>
        <H2>1) Plan (2 min)</H2>
        <ul className="mt-2 list-disc pl-5 text-asu-gray-800">
          <li>Audience: who is it for? Student, instructor, staff?</li>
          <li>Job to be done: 1–2 sentences on the task.</li>
          <li>Inputs → Outputs: what you provide vs. what you want back.</li>
        </ul>
        <H2>2) Create (1 min)</H2>
        <P>From the Dashboard, click <strong>Create new</strong> or open <strong>Templates</strong> and choose a starter. Rename the project.</P>
        <H2>3) Configure (3 min)</H2>
        <H3>Model and temperature</H3>
        <P>Pick a general model first. Start with temperature 0.7. Lower to 0.3 for deterministic tasks like rubrics; raise to 0.9 for brainstorming.</P>
        <H3>System instructions</H3>
        <P>Describe persona, scope, and guardrails in 3–6 bullet points. Add a short example if your output has a format.</P>
        <H2>4) Add knowledge (optional, 2 min)</H2>
        <P>Upload finalized PDFs or clean text. Enable retrieval and start with: Top‑K 6, chunk size 800, overlap 120.</P>
        <H2>5) Iterate (2 min, ongoing)</H2>
        <P>Open <strong>Build</strong>, try a realistic prompt, and adjust one variable at a time. Save examples you care about.</P>
        <H3>Checklist</H3>
        <ul className="mt-2 list-disc pl-5 text-asu-gray-800">
          <li>Project has a clear name and description</li>
          <li>System instructions set tone and constraints</li>
          <li>Optional knowledge uploaded and retrieval enabled</li>
          <li>One saved example in Build to compare against</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'prompting-basics',
    title: 'Prompting basics for reliable outputs',
    summary: 'A practical recipe for durable prompts: role, goal, steps, constraints, and examples.',
    category: 'Prompting',
    tags: ['prompting', 'quality'],
    content: (
      <div>
        <H2>The R-G-S-C-E pattern</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li><strong>Role</strong>: who is the assistant?</li>
          <li><strong>Goal</strong>: what should the output achieve?</li>
          <li><strong>Steps</strong>: how to approach the task</li>
          <li><strong>Constraints</strong>: formatting, tone, limits</li>
          <li><strong>Examples</strong>: 1–2 short exemplars (few‑shot)</li>
        </ul>
        <Code>{`Role: You are a course assistant for BIO 101.
Goal: Produce 5 quiz questions aligned to outcomes.
Steps:
1) Read the attached outline
2) Create a mix of recall and reasoning questions
3) Provide an answer key
Constraints: Plain text, 1–2 sentences per question, unbiased, no copyrighted text.
Example (format):
Q1) What is the function of mitochondria?
A1) Energy production via ATP synthesis.`}</Code>
        <H2>Few‑shot vs schema</H2>
        <P>When the output must follow a strict format, give a compact example or describe a JSON schema that the answer must match.</P>
        <Code>{`Respond as JSON with keys: {"question": string, "answer": string}. Generate an array of 5 objects.`}</Code>
        <H2>Anti‑patterns</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Overlong essays as prompts → use bullets</li>
          <li>Vague asks like "be detailed" → specify counts, formats</li>
          <li>Combining multiple tasks → split into steps</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'models-parameters',
    title: 'Models and parameters: what they do',
    summary: 'What temperature, tokens, and retrieval settings mean — with recommended defaults by task.',
    category: 'Models & Parameters',
    tags: ['models', 'temperature', 'tokens', 'top-k'],
    content: (
      <div>
        <H2>Core generation</H2>
        <ul className="mt-2 list-disc pl-5 text-asu-gray-800">
          <li><strong>Temperature</strong>: higher = more creative; lower = more deterministic. Start at 0.7; 0.3 for rubric-like tasks; 0.9 for ideation.</li>
          <li><strong>Output tokens</strong>: max length of the answer. Use 512–1024 for summaries; 2048+ for long plans.</li>
        </ul>
        <H2>Retrieval (RAG)</H2>
        <ul className="mt-2 list-disc pl-5 text-asu-gray-800">
          <li><strong>Top‑K</strong>: number of chunks retrieved. Start at 6; raise when answers miss facts; lower if responses drift.</li>
          <li><strong>Chunk size</strong>: 600–1000 chars. Larger improves continuity, smaller improves precision.</li>
          <li><strong>Overlap</strong>: 80–160 chars to avoid cutting sentences in half.</li>
        </ul>
        <H2>Suggested defaults by task</H2>
        <ul className="mt-2 list-disc pl-5 text-asu-gray-800">
          <li>Study guide: temp 0.7, tokens 1024, Top‑K 6</li>
          <li>Rubric builder: temp 0.3, tokens 1024, Top‑K 4</li>
          <li>FAQ chatbot: temp 0.5, tokens 768, Top‑K 8</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'rag-setup',
    title: 'Add knowledge with Retrieval‑Augmented Generation',
    summary: 'How to prepare files, tune retrieval, and get grounded, citeable answers.',
    category: 'Knowledge & RAG',
    tags: ['rag', 'files', 'retrieval'],
    content: (
      <div>
        <H2>Prepare your sources</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Prefer text‑based PDFs or Markdown over images or scans.</li>
          <li>Split long documents into logical sections (≤ 2–5 MB each).</li>
          <li>Remove duplicates; keep one canonical version.</li>
        </ul>
        <H2>Tune retrieval</H2>
        <P>Start with Top‑K 6, chunk size 800, overlap 120. If answers omit key facts, raise Top‑K to 8–10. If responses wander, lower to 4.</P>
        <H3>Grounding and citations</H3>
        <P>Ask the model to cite the title or page of the source where each answer was found. Penalize content that is not supported.</P>
        <Code>{`When you answer, list the source title and page number for each claim.
If a claim is not supported by the provided sources, say "Not found in sources."`}</Code>
        <H3>Quality checklist</H3>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Files are clean and final (no draft markers)</li>
          <li>Search finds the exact sentences you expect</li>
          <li>Answers include explicit citations or disclaimers</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'iteration-guide',
    title: 'Iterate effectively: a 10‑minute loop',
    summary: 'A tight loop to improve outputs systematically — pick examples, change one thing, compare, repeat.',
    category: 'Building & Iteration',
    tags: ['iteration', 'quality'],
    content: (
      <div>
        <H2>Choose anchor examples</H2>
        <P>Create 3 realistic prompts with target outputs (golden answers). Save them in Build.</P>
        <H2>Run the loop</H2>
        <ol className="list-decimal pl-5 text-asu-gray-800 space-y-2">
          <li>Change one variable (prompt bullet, temperature, Top‑K).</li>
          <li>Re‑run the same examples; compare side‑by‑side.</li>
          <li>Score against your acceptance criteria (clarity, accuracy, tone).</li>
          <li>Keep changes that improve ≥2 examples without hurting others.</li>
        </ol>
        <Callout title="Tip">
          Keep a short changelog inside the project description (what changed and why). It makes improvements traceable.
        </Callout>
      </div>
    ),
  },
  {
    id: 'sharing-permissions',
    title: 'Share safely: roles and viewer mode',
    summary: 'Collaborate with editors and viewers; choose the right access for classes and teams.',
    category: 'Sharing & Deployment',
    tags: ['sharing', 'roles'],
    content: (
      <div>
        <H2>Roles</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li><strong>Editor</strong>: can change prompts, files, and settings.</li>
          <li><strong>Viewer</strong>: can run the experience but cannot modify it.</li>
        </ul>
        <H2>Access levels</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li><strong>Private</strong>: only invited users can open.</li>
          <li><strong>Anyone with link (view)</strong>: great for classes or reviews.</li>
          <li><strong>Anyone with link (edit)</strong>: use sparingly; for hack sessions.</li>
        </ul>
        <Callout title="Student data">
          Avoid uploading FERPA‑protected information. Keep shared projects free of personally identifiable data.
        </Callout>
      </div>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting: common issues and fixes',
    summary: 'A quick decision guide to fix randomness, missing facts, or bad formatting.',
    category: 'Troubleshooting',
    tags: ['debugging', 'quality'],
    content: (
      <div>
        <H2>If the output is too random</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Lower temperature (0.7 → 0.4 → 0.3)</li>
          <li>Add constraints: counts, bullet formats, and examples</li>
        </ul>
        <H2>If answers miss facts</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Raise Top‑K (6 → 8 or 10)</li>
          <li>Improve sources (split large files, remove noise)</li>
        </ul>
        <H2>If formatting is off</H2>
        <ul className="list-disc pl-5 text-asu-gray-800 space-y-1">
          <li>Provide an explicit example or JSON schema</li>
          <li>Increase output tokens if the response gets cut off</li>
        </ul>
      </div>
    ),
  },
];

export const ALL_TAGS = Array.from(new Set(ARTICLES.flatMap(a => a.tags))).sort();
export const ALL_CATEGORIES = Array.from(new Set(ARTICLES.map(a => a.category)));


