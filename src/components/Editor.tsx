import { useEffect, useRef } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { Code2, Hash, Sparkles } from 'lucide-react';

export default function Editor() {
    const { tabs, activeTabId, updateTabContent, theme, settings, saveFile } = useStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Add keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            saveFile();
        });

        // Custom theme for Monaco to match our app
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
                { token: 'string', foreground: '50fa7b' },
                { token: 'variable', foreground: 'f8f8f2' },
                { token: 'type', foreground: '8be9fd', fontStyle: 'bold' },
                { token: 'function', foreground: 'bd93f9' },
                { token: 'number', foreground: 'bd93f9' },
            ],
            colors: {
                'editor.background': '#0b101e',
                'editor.lineHighlightBackground': '#1e293b50',
                'editorCursor.foreground': '#3b82f6',
                'editor.selectionBackground': '#3b82f640',
                'editor.inactiveSelectionBackground': '#3b82f620',
                'editorLineNumber.foreground': '#475569',
                'editorLineNumber.activeForeground': '#3b82f6',
                'editorIndentGuide.background': '#ffffff10',
                'editorIndentGuide.activeBackground': '#ffffff20',
            }
        });

        monaco.editor.defineTheme('custom-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'd946ef', fontStyle: 'bold' },
                { token: 'string', foreground: '10b981' },
                { token: 'variable', foreground: '1e293b' },
                { token: 'type', foreground: '0ea5e9', fontStyle: 'bold' },
                { token: 'function', foreground: '8b5cf6' },
            ],
            colors: {
                'editor.background': '#f8fafc',
                'editor.lineHighlightBackground': '#f1f5f9',
                'editorCursor.foreground': '#3b82f6',
                'editor.selectionBackground': '#3b82f630',
                'editorLineNumber.foreground': '#cbd5e1',
                'editorLineNumber.activeForeground': '#3b82f6',
            }
        });

        // Focus editor
        editor.focus();
    };

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, [activeTabId]);

    if (!activeTab) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b101e] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
                </div>

                <div className="animate-slide-up flex flex-col items-center max-w-md text-center px-6 relative z-10">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-white dark:bg-[#111827] rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 relative z-10">
                            <Code2 size={48} className="text-blue-500 animate-pulse" />
                        </div>
                        <div className="absolute -top-2 -right-2 p-2 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/20 text-white z-20">
                            <Sparkles size={16} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Build Something?</span>
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10">
                        Open a file or create a new one to start writing code.
                        All your work is handled securely with Tauri 2.0.
                    </p>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <ShortcutItem icon={<Hash size={14} />} label="New File" keybind="Ctrl+N" />
                        <ShortcutItem icon={<Hash size={14} />} label="Open File" keybind="Ctrl+O" />
                        <ShortcutItem icon={<Hash size={14} />} label="Settings" keybind="Ctrl+," />
                        <ShortcutItem icon={<Hash size={14} />} label="App Theme" keybind="Alt+T" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden relative">
            <MonacoEditor
                height="100%"
                language={activeTab.language}
                value={activeTab.content}
                theme={theme === 'dark' ? 'custom-dark' : 'custom-light'}
                onChange={(value) => updateTabContent(activeTab.id, value || '')}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: settings.fontSize,
                    tabSize: settings.tabSize,
                    wordWrap: settings.wordWrap ? 'on' : 'off',
                    lineNumbers: settings.lineNumbers ? 'on' : 'off',
                    minimap: { enabled: settings.minimap },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 20 },
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                    fontLigatures: true,
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: 'on',
                    cursorBlinking: 'smooth',
                    renderLineHighlight: 'all',
                }}
            />

            {/* Unsaved Indicator Overlay */}
            {activeTab.isDirty && (
                <div className="absolute top-6 right-8 flex items-center gap-2 bg-blue-500 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-xl shadow-blue-500/20 animate-in zoom-in duration-300 pointer-events-none uppercase">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Unsaved Changes
                </div>
            )}
        </div>
    );
}

function ShortcutItem({ icon, label, keybind }: { icon: any, label: string, keybind: string }) {
    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                {icon}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">{label}</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">{keybind}</span>
            </div>
        </div>
    );
}
