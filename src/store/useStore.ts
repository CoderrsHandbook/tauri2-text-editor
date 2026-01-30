import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export interface FileTab {
    id: string;
    path: string;
    name: string;
    content: string;
    language: string;
    isDirty: boolean;
}

export interface EditorSettings {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    lineNumbers: boolean;
    minimap: boolean;
    autoSave: boolean;
    autoSaveInterval: number;
}

export interface StoreState {
    tabs: FileTab[];
    activeTabId: string | null;
    theme: 'dark' | 'light';
    sidebarOpen: boolean;
    sidebarTab: 'files' | 'recent';
    recentFiles: string[];
    settingsOpen: boolean;
    settings: EditorSettings;

    initializeApp: () => Promise<void>;
    openFile: () => Promise<void>;
    openFileByPath: (path: string) => Promise<void>;
    createNewFile: () => void;
    saveFile: () => Promise<void>;
    saveFileAs: () => Promise<void>;
    closeTab: (id: string) => void;
    updateTabContent: (id: string, content: string) => void;
    updateTabLanguage: (id: string, language: string) => void;
    setActiveTabId: (id: string) => void;
    toggleTheme: () => void;
    updateSettings: (settings: Partial<EditorSettings>) => void;
    toggleSettings: () => void;
    setSidebarTab: (tab: 'files' | 'recent') => void;
    toggleSidebar: () => void;
}

export const LANGUAGE_MAP: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    toml: 'toml',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    sh: 'shell',
    sql: 'sql',
    xml: 'xml',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
};

const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAP[ext] || 'plaintext';
};

export const useStore = create<StoreState>((set, get) => ({
    tabs: [],
    activeTabId: null,
    theme: 'dark',
    sidebarOpen: true,
    sidebarTab: 'files',
    recentFiles: [],
    settingsOpen: false,
    settings: {
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        lineNumbers: true,
        minimap: true,
        autoSave: false,
        autoSaveInterval: 5000,
    },

    initializeApp: async () => {
        try {
            const recent = await invoke<string[]>('get_recent_files');
            set({ recentFiles: recent });
        } catch (err) {
            console.error('Failed to initialize app:', err);
        }
    },

    openFile: async () => {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'All Files', extensions: ['*'] }],
        });
        if (selected && typeof selected === 'string') {
            await get().openFileByPath(selected);
        }
    },

    openFileByPath: async (path: string) => {
        const existing = get().tabs.find((t) => t.path === path);
        if (existing) {
            set({ activeTabId: existing.id });
            return;
        }

        try {
            const content = await readTextFile(path);
            const name = path.split(/[\\\/]/).pop() || 'untitled';
            const newTab: FileTab = {
                id: Date.now().toString(),
                path,
                name,
                content,
                language: getLanguageFromPath(path),
                isDirty: false,
            };

            set((state) => ({
                tabs: [...state.tabs, newTab],
                activeTabId: newTab.id,
                recentFiles: [path, ...state.recentFiles.filter((f) => f !== path)].slice(0, 10),
            }));
            await invoke('add_recent_file', { path });
        } catch (err) {
            console.error('Failed to open file:', err);
        }
    },

    createNewFile: () => {
        const newTab: FileTab = {
            id: Date.now().toString(),
            path: 'untitled',
            name: 'Untitled',
            content: '',
            language: 'plaintext',
            isDirty: false,
        };
        set((state) => ({
            tabs: [...state.tabs, newTab],
            activeTabId: newTab.id,
        }));
    },

    saveFile: async () => {
        const { tabs, activeTabId } = get();
        const tab = tabs.find((t) => t.id === activeTabId);
        if (!tab) return;

        if (tab.path === 'untitled') {
            await get().saveFileAs();
            return;
        }

        try {
            await writeTextFile(tab.path, tab.content);
            set((state) => ({
                tabs: state.tabs.map((t) =>
                    t.id === activeTabId ? { ...t, isDirty: false } : t
                ),
            }));
        } catch (err) {
            console.error('Failed to save file:', err);
        }
    },

    saveFileAs: async () => {
        const { tabs, activeTabId } = get();
        const tab = tabs.find((t) => t.id === activeTabId);
        if (!tab) return;

        const selected = await save({
            defaultPath: tab.name === 'Untitled' ? undefined : tab.path,
        });

        if (selected) {
            try {
                await writeTextFile(selected, tab.content);
                const name = selected.split(/[\\\/]/).pop() || 'untitled';
                set((state) => ({
                    tabs: state.tabs.map((t) =>
                        t.id === activeTabId
                            ? { ...t, path: selected, name, isDirty: false, language: getLanguageFromPath(selected) }
                            : t
                    ),
                    recentFiles: [selected, ...state.recentFiles.filter((f) => f !== selected)].slice(0, 10),
                }));
                await invoke('add_recent_file', { path: selected });
            } catch (err) {
                console.error('Failed to save file as:', err);
            }
        }
    },

    closeTab: (id: string) => {
        const { tabs, activeTabId } = get();
        const tab = tabs.find((t) => t.id === id);
        if (tab?.isDirty) {
            // In a real app, we'd show a confirmation dialog
            // For this project, we'll just close it or the user can save first
        }

        const newTabs = tabs.filter((t) => t.id !== id);
        let newActiveId = activeTabId;

        if (activeTabId === id) {
            newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }

        set({ tabs: newTabs, activeTabId: newActiveId });
    },

    updateTabContent: (id: string, content: string) => {
        set((state) => ({
            tabs: state.tabs.map((t) =>
                t.id === id ? { ...t, content, isDirty: true } : t
            ),
        }));
    },

    updateTabLanguage: (id: string, language: string) => {
        set((state) => ({
            tabs: state.tabs.map((t) =>
                t.id === id ? { ...t, language } : t
            ),
        }));
    },

    setActiveTabId: (id: string) => {
        set({ activeTabId: id });
    },

    toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
    },

    updateSettings: (newSettings: Partial<EditorSettings>) => {
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        }));
    },

    toggleSettings: () => {
        set((state) => ({ settingsOpen: !state.settingsOpen }));
    },

    setSidebarTab: (tab: 'files' | 'recent') => {
        set({ sidebarTab: tab });
    },

    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },
}));
