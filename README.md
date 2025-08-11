# ASU AI Portal (CreateAI Builder)

A React + TypeScript portal for building, organizing, and sharing AI-powered projects. The UI follows ASU styling and supports personalizing the experience for the signed‑in user.

## Current Features

- **Sidebar with collapse/expand**
  - Persistent collapsed state
  - Clear expand control near the logo when collapsed
  - Footer Settings entry navigates to a unified settings page
- **Personalized dashboard**
  - Headline greets the user: “Welcome back, {preferred name}.”
  - Preferred name and email stored locally (Settings → Profile)
- **Projects**
  - List view with avatars (project image or initials)
  - Search and filters (Category, Provider)
  - Open and manage projects
- **Templates**
  - List view aligned to Projects styling/width
  - Search + filters (Provider, Tag, Category, Audience)
  - Use template → scaffolds a new project and opens the editor
- **Project Editor**
  - Configure model, prompts, RAG, memory, and viewer options
  - Share and Build modals
- **Layout preferences**
  - Reorder/Toggle dashboard sections; saved to localStorage
- **Unified Settings**
  - Profile (Preferred name, Email)
  - Interaction preferences (Personality, Style, Always‑know)
- **Responsive design** with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Run the app locally

This app lives in this subdirectory. Make sure you run commands here, not from the repo root.

1) Change into the app directory and install dependencies
```bash
cd /Users/danielennis/ai-apps/rebrand-create-ai/example/figma-mcp-test
npm install
```

2) Start the development server
```bash
npm start
```

3) Open http://localhost:3000 in your browser

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx               # Collapsible sidebar + footer Settings link
│   ├── DashDefault.tsx           # Dashboard content (personalized)
│   ├── ProjectsStore.ts          # Local storage project store
│   ├── ProjectEditor.tsx         # Project editor UI
│   ├── LayoutSettingsModal.tsx   # Dashboard layout preferences
│   ├── ShareModal.tsx, BuildModal.tsx
│   └── UserProfile.tsx           # Preferred name/email hooks and modal
├── pages/
│   ├── DashboardPage.tsx         # Dashboard shell (with Sidebar)
│   ├── ProjectsPage.tsx          # Projects list + search/filters
│   ├── TemplatesPage.tsx         # Templates list + search/filters
│   ├── ProjectEditorPage.tsx     # Editor with helper chat
│   └── SettingsPage.tsx          # Unified settings (Profile + Preferences)
├── services/
│   └── scaffold.ts               # Scaffolding from prompt/templates
├── hooks/
│   └── useLocalStorage.ts        # Persist preferences
├── types.ts                      # Strongly-typed models and options
├── App.tsx                       # Routes and modals
├── index.tsx                     # React entry
└── index.css                     # Tailwind styles
```

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Create React App** - Build tool

## Design System

The application uses ASU’s design system with Tailwind utilities:
- **Colors**: ASU Maroon (#8C1D40), ASU Gold (#FFC627), ASU White (#FFFFFF)
- **Typography**: System/Inter stack
- **Spacing**: Consistent Tailwind spacing scale

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production (outputs to `../../build`)
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Production build & preview

Build the optimized production bundle and optionally serve it locally:

```bash
cd /Users/danielennis/ai-apps/rebrand-create-ai/example/figma-mcp-test
npm run build
npx serve -s ../../build
```

Notes:
- The build output path is configured to `../../build` in `package.json` (`BUILD_PATH=../../build`).
- If port 3000 is busy, the dev server will prompt to use another port and print the new URL in the terminal.

## Notes

- All image assets live under `public/`
- State is persisted locally (localStorage). Clearing browser storage resets data.
- Replace `public/templates.json` to seed built‑in templates.

---

## Learning: Build and customize AIs with this portal

The Learn section (Sidebar → Learn) will walk you through how to:

1. Plan your AI
   - Define audience, use cases, inputs/outputs
   - Choose a starting point: Blank project vs Template
2. Create a project
   - Click “Create new” or pick a template; personalize name/description
   - Configure model and temperature in the editor
3. Add knowledge (RAG)
   - Upload files to the knowledge base; tune top‑K and chunking
   - When to enable/disable search
4. Shape behavior
   - Write system instructions; iterate using the Build modal
   - Set interaction style and “Always know” facts in Settings
5. Collaborate and share
   - Invite editors/viewers; set general access (private/view/edit)
   - Viewer mode for restricted access
6. Deploy and iterate
   - Use Build to test; Share to gather feedback
   - Track changes and update prompts/knowledge over time

This starter Learn page is just a primer. You can expand it into guides, videos, and live examples.