import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon, SettingsIcon, HomeIcon, FolderIcon, UsersIcon, LayersIcon, BookIcon, HelpCircleIcon, MenuIcon } from './icons';

type Props = { onNewProject?: () => void };

export default function Sidebar({ onNewProject }: Props) {
  const location = useLocation();
  const nav = [
    { to: '/', label: 'Dashboard', icon: HomeIcon },
    { to: '/projects', label: 'My projects', icon: FolderIcon },
    { to: '/templates', label: 'Templates', icon: LayersIcon },
    { to: '/shared', label: 'Shared with me', icon: UsersIcon },
    { to: '/learn', label: 'Learn', icon: BookIcon },
    { to: '/help', label: 'Help & feedback', icon: HelpCircleIcon },
  ];
  const STORAGE_KEY = 'asu-ai-forge:sidebar-collapsed';
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {}
  }, [collapsed]);


  return (
    <>
      <aside className={`hidden lg:flex ${collapsed ? 'lg:w-20 px-3' : 'lg:w-72 px-6'} flex-col border-r border-asu-gray-300 bg-asu-white py-6 transition-all sticky top-0 h-screen overflow-y-auto shrink-0`}>
        <div className="flex items-center gap-2">
          <img
            src="/site-logo.png"
            alt="Site logo"
            className="h-6 w-auto cursor-pointer"
            title={collapsed ? 'Open sidebar' : 'ASU AI Portal'}
            onClick={() => collapsed && setCollapsed(false)}
          />
          {!collapsed && <div className="text-xl font-semibold tracking-tight">AI Portal</div>}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="ml-auto rounded-full border border-asu-gray-300 bg-white p-2 hover:border-asu-maroon"
            >
              <MenuIcon />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            title="Open sidebar"
            aria-label="Open sidebar"
            className="mt-3 self-center h-9 w-9 rounded-full border border-asu-gray-300 bg-white text-asu-black hover:border-asu-maroon flex items-center justify-center"
          >
            <MenuIcon />
          </button>
        )}

        <div className="flex-1 overflow-auto mt-4">
          <button
            onClick={onNewProject}
            title="Create new project"
            aria-label="Create new project"
            className={`mb-4 group ${collapsed ? 'mx-auto flex h-10 w-10 items-center justify-center rounded-full p-0' : 'flex items-center gap-2 rounded-full px-5 py-3'} border border-asu-gray-300 bg-asu-white text-asu-maroon transition hover:border-asu-maroon`}
          >
            <PlusIcon />
            {!collapsed && <span className="font-medium">Create new</span>}
          </button>

          <nav className="grid gap-1">
            {nav.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={`${collapsed ? 'justify-center' : 'gap-3'} flex items-center rounded-lg px-3 py-2 text-left transition ${active ? 'bg-asu-gray-200 font-semibold text-asu-rich-black' : 'hover:bg-asu-gray-100 text-asu-black'}`}
                >
                  <Icon />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sticky bottom-4">
          <Link
            to="/settings"
            className="block w-full rounded-2xl border border-asu-gray-300 p-3 bg-white hover:border-asu-maroon"
            title="Settings"
            aria-label="Settings"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-asu-gray-300" />
              {!collapsed && <div className="text-sm">Settings</div>}
              <div className="ml-auto text-asu-gray-700"><SettingsIcon /></div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}


