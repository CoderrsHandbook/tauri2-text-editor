import { X, Keyboard, Type, Layout, Save, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SettingsDialog() {
    const { settingsOpen, toggleSettings, settings, updateSettings } = useStore();

    if (!settingsOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <Settings size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Preferences</h2>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Configure your workspace</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleSettings}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {/* Editor Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Type size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Editor Appearance</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Font Size</label>
                                    <span className="text-xs font-mono font-bold text-blue-500">{settings.fontSize}px</span>
                                </div>
                                <input
                                    type="range" min="10" max="24" value={settings.fontSize}
                                    onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Tab Size</label>
                                    <span className="text-xs font-mono font-bold text-blue-500">{settings.tabSize} spaces</span>
                                </div>
                                <input
                                    type="range" min="2" max="8" step="2" value={settings.tabSize}
                                    onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Layout Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Layout size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Interface & Behavior</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'wordWrap', label: 'Word Wrap', desc: 'Wrap long lines to fit' },
                                { id: 'lineNumbers', label: 'Line Numbers', desc: 'Show numbering gutter' },
                                { id: 'minimap', label: 'Minimap', desc: 'Show code overview map' },
                            ].map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => updateSettings({ [opt.id]: !settings[opt.id as keyof typeof settings] })}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${settings[opt.id as keyof typeof settings]
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${settings[opt.id as keyof typeof settings] ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/40' : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                        {settings[opt.id as keyof typeof settings] && <div className="w-2 h-2 bg-white rounded-full shadow-inner" />}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{opt.label}</h4>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{opt.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Auto Save Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Save size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Auto Persistence</h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight">Auto-save Modifications</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Automatically save changes after a set delay</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                                    className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${settings.autoSave ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.autoSave ? 'left-8' : 'left-1'}`} />
                                </button>
                            </div>

                            {settings.autoSave && (
                                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase">
                                        <span>Saving Interval</span>
                                        <span className="text-emerald-500 font-mono">{settings.autoSaveInterval / 1000}s</span>
                                    </div>
                                    <input
                                        type="range" min="1000" max="30000" step="1000" value={settings.autoSaveInterval}
                                        onChange={(e) => updateSettings({ autoSaveInterval: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Shortcuts Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Keyboard size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Quick Access</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <table className="w-full text-left text-[12px]">
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { key: 'Ctrl + N', action: 'New Document' },
                                        { key: 'Ctrl + O', action: 'Open File' },
                                        { key: 'Ctrl + S', action: 'Save Work' },
                                        { key: 'Ctrl + ,', action: 'Preferences' },
                                        { key: 'Alt + T', action: 'Toggle Theme' },
                                        { key: 'Ctrl + F', action: 'Search / Find' },
                                        { key: 'Ctrl + H', action: 'Global Replace' },
                                    ].map((s) => (
                                        <tr key={s.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
                                                <span className="font-mono text-[11px] font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{s.key}</span>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400 font-bold tracking-tight">{s.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex justify-end">
                    <button
                        onClick={toggleSettings}
                        className="px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 active:shadow-none"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
