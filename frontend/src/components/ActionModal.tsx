import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import type { Issue } from '../store/sessionStore';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExecute: () => void;
    issue: Issue | null;
}

export default function ActionModal({ isOpen, onClose, onExecute, issue }: ActionModalProps) {
    const [reason, setReason] = useState('');
    const [approver, setApprover] = useState('');

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
                        className="w-full max-w-md mx-4"
                    >
                        <div className="card !p-0 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                                        <ShieldAlert className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Confirm Action</h2>
                                        <p className="text-xs text-surface-500">Review before executing</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-surface-400" />
                                </button>
                            </div>

                            {/* Warning */}
                            <div className="px-6 py-4">
                                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-300">Critical: This action cannot be undone.</p>
                                        <p className="text-xs text-red-400/70 mt-1">
                                            The following patch will be applied to your codebase.
                                        </p>
                                    </div>
                                </div>

                                {/* Patch preview */}
                                {issue?.suggestedFix && (
                                    <div className="bg-surface-900/80 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-xs text-surface-400 font-mono">{issue.suggestedFix.file}</span>
                                        </div>
                                        <pre className="text-xs text-emerald-300/80 font-mono leading-relaxed overflow-x-auto">
                                            {issue.suggestedFix.patch}
                                        </pre>
                                    </div>
                                )}

                                {/* Fields */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-surface-400 mb-1.5">
                                            Reason for execution
                                        </label>
                                        <input
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="e.g. Fix alignment issue on login page"
                                            className="w-full bg-surface-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-600 border border-white/5 focus:border-primary-500/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-400 mb-1.5">
                                            Owner / Approver
                                        </label>
                                        <input
                                            value={approver}
                                            onChange={(e) => setApprover(e.target.value)}
                                            placeholder="e.g. @saurabh"
                                            className="w-full bg-surface-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-600 border border-white/5 focus:border-primary-500/50 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                                <button onClick={onClose} className="btn-secondary !py-2.5 !px-5 text-sm">
                                    Cancel
                                </button>
                                <button onClick={onExecute} className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 !bg-gradient-to-r !from-red-500 !to-red-600 !shadow-red-500/25">
                                    Execute
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
