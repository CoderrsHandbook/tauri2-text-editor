import { X, FileCode2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Tabs() {
    const { tabs, activeTabId, setActiveTabId, closeTab } = useStore();

    if (tabs.length === 0) return null;

    return (
        <div className="h-11 bg-white dark:bg-[#111827] flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 px-2 items-end gap-1">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`
            group flex items-center h-9 min-w-[140px] max-w-[220px] px-3 rounded-t-xl cursor-pointer text-[13px] font-medium transition-all relative
            ${activeTabId === tab.id
                            ? 'bg-slate-50 dark:bg-[#0b101e] text-blue-500 shadow-[0_-2px_10px_-5px_rgba(59,130,246,0.3)]'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
          `}
                >
                    {/* Active indicator bar */}
                    {activeTabId === tab.id && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}

                    <div className={`p-1 rounded-md mr-2 ${activeTabId === tab.id ? 'bg-blue-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <FileCode2 size={12} className={activeTabId === tab.id ? 'text-blue-500' : 'text-slate-400'} />
                    </div>

                    <span className="flex-1 truncate mr-2">{tab.name}</span>

                    <div className="flex items-center">
                        {tab.isDirty && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover:hidden" />
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                            className={`
                p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors
                ${tab.isDirty ? 'hidden group-hover:flex' : 'flex'}
              `}
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
