import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import ShareModal from './components/ShareModal';
import BuildModal from './components/BuildModal';
import { useProjects } from './components/ProjectsStore';
import { Project } from './types';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectEditorPage from './pages/ProjectEditorPage';
import { useCurrentUserEmail } from './components/UserProfile';
import { scaffoldProjectFromPrompt } from './services/scaffold';
import SettingsPage from './pages/SettingsPage';
import TemplatesPage from './pages/TemplatesPage';
import LearnPage from './pages/LearnPage';
import LearnArticlePage from './pages/LearnArticlePage';
import ViewerPage from './pages/ViewerPage';

function AppRoutes() {
  const navigate = useNavigate();
  const { projects, create, update, get, listSharedWith } = useProjects();
  const { email } = useCurrentUserEmail();
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [buildOpen, setBuildOpen] = React.useState(false);

  const openNewProject = () => {
    const p = create('Untitled Project');
    setActiveProject(p);
    navigate(`/project/${p.id}`);
  };

  const openExisting = (p: Project) => {
    setActiveProject(p);
    navigate(`/project/${p.id}`);
  };

  const generateFromPrompt = async (prompt: string) => {
    const config = await scaffoldProjectFromPrompt(prompt);
    const p = create(config.projectName || 'Untitled Project');
    const next: Project = {
      ...p,
      ...config,
      updatedAt: new Date().toISOString(),
    };
    update(next);
    setActiveProject(next);
    navigate(`/project/${next.id}`, { state: { openGuide: true } });
  };

  const ProjectRouteWrapper = () => {
    const { id } = useParams();
    const location = useLocation() as any;
    React.useEffect(() => {
      if (location?.state?.project) {
        setActiveProject(location.state.project as Project);
        return;
      }
      if (!id) return;
      const p = get(id);
      if (p) setActiveProject(p);
    }, [id, projects, location?.state?.project]);
    if (!activeProject) return (
      <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
        <div className="mx-auto max-w-3xl p-6">Loading project…</div>
      </div>
    );
    const invites = Array.isArray(activeProject.invites) ? activeProject.invites : [];
    const generalAccess = (activeProject.generalAccess as 'private' | 'view' | 'edit') || 'private';
    const isViewerOnly = generalAccess === 'view' || invites.some((i) => i.email === email && i.role === 'view');
    const isAnyoneCanEdit = generalAccess === 'edit';
    const isEditor = isAnyoneCanEdit || invites.some((i) => i.email === email && i.role === 'edit');
    if (!isEditor && isViewerOnly) {
      return <ViewerPage project={activeProject} />;
    }
    return (
      <ProjectEditorPage
        project={activeProject}
        onBack={() => navigate('/')}
        onSave={(p) => {
          update(p);
          setActiveProject(p);
        }}
        onOpenShare={(p) => {
          setActiveProject(p);
          setShareOpen(true);
        }}
        onOpenBuild={(p) => {
          setActiveProject(p);
          setBuildOpen(true);
        }}
        onNewProject={openNewProject}
        guideDefaultOpen={!!location?.state?.openGuide}
        defaultTab={location?.state?.defaultTab as any}
      />
    );
  };

  const ViewerRouteWrapper = () => {
    const { id } = useParams();
    const [proj, setProj] = React.useState<Project | null>(null);
    React.useEffect(() => {
      if (!id) return;
      const p = get(id);
      if (p) setProj(p);
    }, [id]);
    if (!proj) {
      return (
        <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
          <div className="mx-auto max-w-3xl p-6">Loading…</div>
        </div>
      );
    }
    return <ViewerPage project={proj} />;
  };

  return (
    <div className="App font-sans">
      <Routes>
        <Route path="/" element={<DashboardPage projects={projects} onCreate={openNewProject} onOpenProject={openExisting} onScaffoldFromPrompt={generateFromPrompt} />} />
        <Route path="/projects" element={<ProjectsPage projects={projects} onCreate={openNewProject} onOpenProject={openExisting} />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:id" element={<LearnArticlePage />} />
        <Route path="/project/:id" element={<ProjectRouteWrapper />} />
        <Route path="/view/:id" element={<ViewerRouteWrapper />} />
        <Route path="/shared" element={<ProjectsPage projects={listSharedWith(email)} onCreate={openNewProject} onOpenProject={openExisting} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} project={activeProject} onUpdate={(p) => update(p)} />
      <BuildModal open={buildOpen} onClose={() => setBuildOpen(false)} project={activeProject} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App; 