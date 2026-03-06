import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Send, CircleDot } from 'lucide-react';
import { useState } from 'react';

interface HandoffModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const agents = [
    { id: '1', name: 'Sarah Chen', status: 'available' as const, specialization: 'Frontend, CSS' },
    { id: '2', name: 'Marcus Rivera', status: 'available' as const, specialization: 'Accessibility, UX' },
    { id: '3', name: 'Priya Patel', status: 'busy' as const, specialization: 'Backend, API' },
    { id: '4', name: 'James Wilson', status: 'available' as const, specialization: 'Full Stack' },
];

export default function HandoffModal({ isOpen, onClose }: HandoffModalProps) {
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    const handleTransfer = () => {
        // Simulate transfer
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg mx-4"
                    >
                        <div className="card !p-0 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Transfer to Human Agent</h2>
                                        <p className="text-xs text-surface-500">Hand off this session to a team member</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-surface-400" />
                                </button>
                            </div>

                            <div className="px-6 py-4">
                                {/* Agents list */}
                                <p className="text-xs font-medium text-surface-400 mb-3 uppercase tracking-wider">Available Agents</p>
                                <div className="space-y-2 mb-5">
                                    {agents.map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => agent.status === 'available' && setSelectedAgent(agent.id)}
                                            disabled={agent.status === 'busy'}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedAgent === agent.id
                                                    ? 'bg-primary-600/15 border border-primary-500/30'
                                                    : agent.status === 'busy'
                                                        ? 'bg-surface-800/30 opacity-50 cursor-not-allowed'
                                                        : 'bg-surface-800/50 hover:bg-surface-800 border border-transparent'
                                                }`}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{agent.name}</p>
                                                <p className="text-xs text-surface-500">{agent.specialization}</p>
                                            </div>
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <CircleDot
                                                    className={`w-3 h-3 ${agent.status === 'available' ? 'text-emerald-400' : 'text-amber-400'
                                                        }`}
                                                />
                                                <span className={agent.status === 'available' ? 'text-emerald-400' : 'text-amber-400'}>
                                                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Notes */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-surface-400 mb-1.5">Notes for agent</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Provide context about the current session..."
                                        rows={3}
                                        className="w-full bg-surface-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-surface-600 border border-white/5 focus:border-primary-500/50 focus:outline-none resize-none"
                                    />
                                </div>

                                {/* Transcript preview */}
                                <div>
                                    <p className="text-xs font-medium text-surface-400 mb-1.5">Transcript Preview</p>
                                    <div className="bg-surface-900/80 rounded-xl p-3 max-h-32 overflow-auto space-y-2">
                                        <div className="text-xs">
                                            <span className="text-primary-400 font-medium">User: </span>
                                            <span className="text-surface-300">Why is this button misaligned?</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-emerald-400 font-medium">AI: </span>
                                            <span className="text-surface-300">The parent flex container uses flex-start alignment...</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-primary-400 font-medium">User: </span>
                                            <span className="text-surface-300">Can you fix it?</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                                <button onClick={onClose} className="btn-secondary !py-2.5 !px-5 text-sm">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTransfer}
                                    disabled={!selectedAgent}
                                    className={`btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 ${!selectedAgent ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                    Transfer Session
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
