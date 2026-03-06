import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import {
    Settings,
    Shield,
    Key,
    AlertTriangle,
    BookOpen,
    ListChecks,
    Eye,
    EyeOff,
    Trash2,
    Plus,
    Copy,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';

const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
    { id: 'actions', label: 'Allowlisted Actions', icon: ListChecks },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'api', label: 'API Management', icon: Key },
];

const mockApiKeys = [
    { id: '1', name: 'Production Key', key: 'la_prod_xxxxxxxxxxxxxxxx', created: 'Feb 15, 2026', lastUsed: 'Mar 5, 2026' },
    { id: '2', name: 'Development Key', key: 'la_dev_xxxxxxxxxxxxxxxxx', created: 'Jan 20, 2026', lastUsed: 'Mar 4, 2026' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [aiRecording, setAiRecording] = useState(true);
    const [autoDelete, setAutoDelete] = useState(false);
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

    const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
        <button onClick={onToggle} className="transition-colors">
            {enabled ? (
                <ToggleRight className="w-8 h-8 text-primary-400" />
            ) : (
                <ToggleLeft className="w-8 h-8 text-surface-600" />
            )}
        </button>
    );

    return (
        <div className="flex h-screen bg-surface-950">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-8 py-8">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                        <p className="text-sm text-surface-400 mb-8">Manage your account, privacy, and API settings.</p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mb-8 border-b border-white/5 pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${activeTab === tab.id
                                        ? 'text-primary-400 border-primary-400'
                                        : 'text-surface-500 border-transparent hover:text-surface-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="card">
                                    <h3 className="text-base font-semibold text-white mb-4">General Settings</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Session auto-save', desc: 'Automatically save sessions to history', enabled: true },
                                            { label: 'Sound notifications', desc: 'Play audio alerts for AI responses', enabled: true },
                                            { label: 'Dark mode', desc: 'Use dark theme (default)', enabled: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-2">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{item.label}</p>
                                                    <p className="text-xs text-surface-500">{item.desc}</p>
                                                </div>
                                                <Toggle enabled={item.enabled} onToggle={() => { }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="text-base font-semibold text-white mb-4">AI Model</h3>
                                    <div className="space-y-3">
                                        {['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-pro'].map((model, i) => (
                                            <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 transition-colors cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="model"
                                                    defaultChecked={i === 0}
                                                    className="w-4 h-4 text-primary-500 accent-primary-500"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-white">{model}</p>
                                                    <p className="text-xs text-surface-500">
                                                        {i === 0 ? 'Fast, great for real-time analysis' : i === 1 ? 'Most capable, best accuracy' : 'Legacy model, stable'}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'playbooks' && (
                            <div className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-white">Playbooks</h3>
                                    <button className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
                                        <Plus className="w-3.5 h-3.5" />
                                        New Playbook
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {['Accessibility Audit', 'Visual Regression Check', 'Performance Analysis'].map((name, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-surface-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">{name}</p>
                                                    <p className="text-xs text-surface-500">Last edited {3 - i}d ago</p>
                                                </div>
                                            </div>
                                            <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Edit</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'actions' && (
                            <div className="card">
                                <h3 className="text-base font-semibold text-white mb-4">Allowlisted Actions</h3>
                                <p className="text-xs text-surface-400 mb-4">Actions in this list can be auto-executed without confirmation.</p>
                                <div className="space-y-2">
                                    {['CSS property changes', 'ARIA attribute additions', 'Color contrast fixes'].map((action, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <span className="text-sm text-white">{action}</span>
                                            </div>
                                            <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-secondary !py-2 !px-4 text-xs mt-4 flex items-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Action
                                </button>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <div className="card">
                                    <h3 className="text-base font-semibold text-white mb-4">Privacy Controls</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="text-sm font-medium text-white">Enable AI Recording</p>
                                                <p className="text-xs text-surface-500">Allow sessions to be recorded for AI training improvements</p>
                                            </div>
                                            <Toggle enabled={aiRecording} onToggle={() => setAiRecording(!aiRecording)} />
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="text-sm font-medium text-white">Auto-delete Logs</p>
                                                <p className="text-xs text-surface-500">Automatically delete session logs after 30 days</p>
                                            </div>
                                            <Toggle enabled={autoDelete} onToggle={() => setAutoDelete(!autoDelete)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="card !border-red-500/20">
                                    <h3 className="text-base font-semibold text-red-400 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Danger Zone
                                    </h3>
                                    <p className="text-xs text-surface-400 mb-4">
                                        Permanently delete all agent logs and session data. This action cannot be undone.
                                    </p>
                                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        Wipe Agent Logs
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <div className="card">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-semibold text-white">API Keys</h3>
                                        <button className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
                                            <Plus className="w-3.5 h-3.5" />
                                            Create New
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {mockApiKeys.map((apiKey) => (
                                            <div key={apiKey.id} className="p-4 rounded-xl bg-surface-800/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-white">{apiKey.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setShowKeys((s) => ({ ...s, [apiKey.id]: !s[apiKey.id] }))
                                                            }
                                                            className="text-surface-500 hover:text-surface-300 transition-colors"
                                                        >
                                                            {showKeys[apiKey.id] ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button className="text-surface-500 hover:text-surface-300 transition-colors">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-surface-400 font-mono mb-2">
                                                    {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••'}
                                                </p>
                                                <div className="flex items-center gap-4 text-[10px] text-surface-600">
                                                    <span>Created: {apiKey.created}</span>
                                                    <span>Last used: {apiKey.lastUsed}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
