import { useEffect, useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Tabs from './components/Tabs';
import Editor from './components/Editor';
import SettingsDialog from './components/SettingsDialog';
import { useStore } from './store/useStore';
import {
  Files,
  History,
  Settings as SettingsIcon,
  Search,
  Moon,
  Sun,
  Code2,
  FolderOpen,
  FilePlus,
  Save,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function App() {
  const {
    theme,
    initializeApp,
    toggleSettings,
    createNewFile,
    openFile,
    saveFile,
    sidebarOpen,
    toggleSidebar,
    sidebarTab,
    setSidebarTab,
    toggleTheme
  } = useStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            createNewFile();
            break;
          case 'o':
            e.preventDefault();
            openFile();
            break;
          case 's':
            e.preventDefault();
            saveFile();
            break;
          case ',':
            e.preventDefault();
            toggleSettings();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewFile, openFile, saveFile, toggleSettings]);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-[#0b0f1a] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Activity Bar (Left) */}
      <div className="w-16 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col items-center py-4 gap-4 z-50">
        <div className="mb-4 p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
          <Code2 size={24} className="text-white" />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <ActivityIcon
            icon={<Files size={20} />}
            active={sidebarOpen && sidebarTab === 'files'}
            onClick={() => {
              if (!sidebarOpen) toggleSidebar();
              setSidebarTab('files');
            }}
            title="Explorer"
          />
          <ActivityIcon
            icon={<History size={20} />}
            active={sidebarOpen && sidebarTab === 'recent'}
            onClick={() => {
              if (!sidebarOpen) toggleSidebar();
              setSidebarTab('recent');
            }}
            title="Recent Files"
          />
          <ActivityIcon
            icon={<Search size={20} />}
            active={false}
            onClick={() => { }}
            title="Search"
          />
        </div>

        <div className="flex flex-col gap-2">
          <ActivityIcon
            icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            active={false}
            onClick={toggleTheme}
            title="Toggle Theme"
          />
          <ActivityIcon
            icon={<SettingsIcon size={20} />}
            active={false}
            onClick={toggleSettings}
            title="Settings"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Custom Header / Title Bar */}
        <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1">
              <HeaderBtn icon={<FilePlus size={16} />} onClick={createNewFile} title="New" />
              <HeaderBtn icon={<FolderOpen size={16} />} onClick={openFile} title="Open" />
              <HeaderBtn icon={<Save size={16} />} onClick={saveFile} title="Save" />
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none select-none">
            <span className="text-blue-500 font-black">{"{"}</span>
            <span className="bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400">Coders handbook</span>
            <span className="text-blue-500 font-black">{"}"}</span>
            <span className="ml-1 text-[10px] opacity-60">Text Editor</span>
          </div>

          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0b101e] overflow-hidden">
            <Tabs />
            <div className="flex-1 relative">
              <Editor />
            </div>
            {/* Status Bar */}
            <StatusBar />
          </div>
        </div>
      </div>

      <SettingsDialog />
    </div>
  );
}

function StatusBar() {
  const { tabs, activeTabId, updateTabLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const activeTab = tabs.find(t => t.id === activeTabId);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeTab) return null;

  const supportedLanguages = [
    'javascript', 'typescript', 'python', 'rust', 'go', 'java', 'html', 'css',
    'json', 'markdown', 'yaml', 'toml', 'cpp', 'csharp', 'shell', 'php', 'ruby', 'sql'
  ];

  return (
    <div className="h-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center justify-between px-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="opacity-50 uppercase tracking-widest text-[9px]">UTF-8</span>
        </div>
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
          <span className="opacity-50 uppercase tracking-widest text-[9px]">Spaces: 2</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 hover:text-blue-500 transition-colors uppercase tracking-widest text-[9px] ${isOpen ? 'text-blue-500' : ''}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {activeTab.language}
          </button>

          {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-44 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in slide-in-from-bottom-2 duration-200">
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[9px] uppercase tracking-widest text-slate-400 font-black">
                Select Language
              </div>
              <div className="max-h-64 overflow-y-auto no-scrollbar py-1.5">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      updateTabLanguage(activeTab.id, lang);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-all text-[11px] font-semibold capitalize flex items-center justify-between ${activeTab.language === lang ? 'text-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : ''
                      }`}
                  >
                    {lang}
                    {activeTab.language === lang && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ icon, active, onClick, title }: { icon: any, active: boolean, onClick: () => void, title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-3 rounded-xl transition-all duration-300 relative group ${active
        ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
    >
      {icon}
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
      {!active && (
        <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none border border-slate-700">
          {title}
        </div>
      )}
    </button>
  );
}

function HeaderBtn({ icon, onClick, title }: { icon: any, onClick: () => void, title: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-600 dark:text-slate-400 text-xs font-medium active:scale-95"
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}

export default App;
