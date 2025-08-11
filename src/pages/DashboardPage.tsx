import React from 'react';
import DashDefault from '../components/DashDefault';
import Sidebar from '../components/Sidebar';
import { Project } from '../types';

type Props = {
  projects: Project[];
  onCreate: () => void;
  onOpenProject: (p: Project) => void;
  onScaffoldFromPrompt: (prompt: string) => void;
};

export default function DashboardPage({ projects, onCreate, onOpenProject, onScaffoldFromPrompt }: Props) {
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar onNewProject={onCreate} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {/* Remove embedded sidebar from DashDefault; it only renders the dashboard content now */}
          <DashDefault onCreate={onCreate} onOpenProject={onOpenProject} projects={projects} onScaffoldFromPrompt={onScaffoldFromPrompt} />
        </main>
      </div>
    </div>
  );
}


