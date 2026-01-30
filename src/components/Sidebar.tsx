import { FileText, History, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import FileTree from './FileTree';

export default function Sidebar() {
    const {
        sidebarOpen,
        toggleSidebar,
        sidebarTab,
        recentFiles,
        openFileByPath
    } = useStore();

    if (!sidebarOpen) return null;

    return (
        <div className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <h2 className="text-[11px] uppercase font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {sidebarTab === 'files' ? 'Explorer' : 'Recent Activity'}
                </h2>
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {sidebarTab === 'files' ? (
                    <FileTree />
                ) : (
                    <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
                        {recentFiles.length > 0 ? (
                            recentFiles.map((path) => (
                                <button
                                    key={path}
                                    onClick={() => openFileByPath(path)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            <FileText size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                                {path.split(/[\\\/]/).pop()}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate opacity-60">
                                                {path}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center p-8">
                                <History size={48} className="mb-4" />
                                <p className="text-xs font-medium uppercase tracking-widest">No Recent Files</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
