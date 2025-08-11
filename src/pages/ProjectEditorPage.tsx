import React from 'react';
import Sidebar from '../components/Sidebar';
import ProjectEditor from '../components/ProjectEditor';
import { Project } from '../types';
import HelperChat from '../components/HelperChat';

type Props = {
  project: Project | null;
  onBack: () => void;
  onSave: (p: Project) => void;
  onOpenShare: (p: Project) => void;
  onOpenBuild: (p: Project) => void;
  onNewProject: () => void;
  guideDefaultOpen?: boolean;
  defaultTab?: 'basics' | 'behavior' | 'knowledge' | 'memory';
};

export default function ProjectEditorPage({ project, onBack, onSave, onOpenShare, onOpenBuild, onNewProject, guideDefaultOpen, defaultTab }: Props) {
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar onNewProject={onNewProject} />
        <main className="flex-1">
          <ProjectEditor project={project} onBack={onBack} onSave={onSave} onOpenShare={onOpenShare} onOpenBuild={onOpenBuild} defaultTab={defaultTab} />
        </main>
      </div>
      {project && <HelperChat project={project} defaultOpen={guideDefaultOpen} />}
    </div>
  );
}


