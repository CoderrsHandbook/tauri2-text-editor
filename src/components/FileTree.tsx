import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode2, Folder, FolderOpen, RefreshCw, FolderPlus } from 'lucide-react';
import { readDir } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { useStore } from '../store/useStore';

interface FileNode {
    name: string;
    path: string;
    isDir: boolean;
}

function FileTreeItem({ node, level, onFileClick }: {
    node: FileNode;
    level: number;
    onFileClick: (path: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadChildren = async () => {
        if (!node.isDir || children.length > 0) return;
        setIsLoading(true);
        try {
            const entries = await readDir(node.path);
            const nodes = entries.map(e => ({
                name: e.name || '',
                path: `${node.path}/${e.name}`,
                isDir: e.isDirectory || false
            })).sort((a, b) => {
                if (a.isDir === b.isDir) return a.name.localeCompare(b.name);
                return a.isDir ? -1 : 1;
            });
            setChildren(nodes);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = async () => {
        if (node.isDir) {
            setIsExpanded(!isExpanded);
            if (!isExpanded && !children.length) await loadChildren();
        } else {
            onFileClick(node.path);
        }
    };

    return (
        <div className="select-none">
            <div
                className={`group flex items-center gap-2 py-1 prune rounded-lg cursor-pointer transition-all duration-150 mx-2
          ${level === 0 ? 'mt-1' : ''}
          hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200 dark:active:bg-slate-700
        `}
                style={{ paddingLeft: `${level * 16 + 8}px`, paddingRight: '8px' }}
                onClick={handleClick}
            >
                <div className="w-4 h-4 flex items-center justify-center">
                    {node.isDir ? (
                        isLoading ? (
                            <RefreshCw size={12} className="animate-spin text-slate-400" />
                        ) : isExpanded ? (
                            <ChevronDown size={14} className="text-slate-500" />
                        ) : (
                            <ChevronRight size={14} className="text-slate-500" />
                        )
                    ) : null}
                </div>

                <span className={`flex-shrink-0 ${node.isDir ? 'text-blue-500/80 dark:text-blue-400/80' : 'text-slate-400'}`}>
                    {node.isDir ? (isExpanded ? <FolderOpen size={16} strokeWidth={2} /> : <Folder size={16} strokeWidth={2} />) : <FileCode2 size={16} strokeWidth={2} />}
                </span>

                <span className={`truncate text-[13px] ${node.isDir ? 'font-semibold' : 'font-medium'} ${node.isDir ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 opacity-90'}`}>
                    {node.name}
                </span>
            </div>

            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {children.map(c => (
                        <FileTreeItem key={c.path} node={c} level={level + 1} onFileClick={onFileClick} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileTree() {
    const [rootNode, setRootNode] = useState<FileNode | null>(null);
    const openFileByPath = useStore(s => s.openFileByPath);

    const handleOpenFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
        });
        if (selected && typeof selected === 'string') {
            const path = selected;
            setRootNode({
                name: path.split(/[\\\/]/).pop() || 'Folder',
                path,
                isDir: true
            });
        }
    };

    return (
        <div className="h-full flex flex-col pt-2">
            <div className="px-4 py-2">
                <button
                    onClick={handleOpenFolder}
                    className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    <FolderPlus size={16} />
                    <span>Open Workspace</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                {rootNode ? (
                    <FileTreeItem node={rootNode} level={0} onFileClick={openFileByPath} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 opacity-40 shadow-inner">
                            <Folder size={32} className="text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Workspace Empty</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed max-w-[140px]">
                            Open a folder to start managing your project files.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
