import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ActionModal from '../components/ActionModal';
import type { Issue } from '../store/sessionStore';
import {
    Upload,
    FileImage,
    AlertTriangle,
    Info,
    CheckCircle2,
    Eye,
    Play,
    Sparkles,
    ArrowRight,
    Gauge,
    Zap,
} from 'lucide-react';

const mockAnalysisResults: Issue[] = [
    {
        id: 'a1',
        title: 'Low Color Contrast on CTA',
        description: 'Button text "#aaa" on "#eee" background fails WCAG AA (ratio 1.94:1). Minimum required is 4.5:1.',
        severity: 'critical',
        confidence: 0.96,
        suggestedFix: { file: 'button.css', patch: '.cta-btn {\n  color: #1a1a1a;\n  background: #3b82f6;\n}', explanation: 'Use high-contrast color pairing', confidence: 0.96 },
        status: 'detected',
    },
    {
        id: 'a2',
        title: 'Missing ARIA Labels on Form',
        description: 'Input fields lack aria-label or associated <label> elements, making the form inaccessible.',
        severity: 'critical',
        confidence: 0.93,
        suggestedFix: { file: 'form.tsx', patch: '<label htmlFor="email">Email</label>\n<input id="email" aria-required="true" />', explanation: 'Add semantic labels to all form inputs', confidence: 0.93 },
        status: 'detected',
    },
    {
        id: 'a3',
        title: 'Improper Heading Hierarchy',
        description: 'Page jumps from <h1> to <h4>, skipping h2 and h3. This breaks screen reader navigation.',
        severity: 'warning',
        confidence: 0.89,
        suggestedFix: { file: 'page.tsx', patch: '<h1>Dashboard</h1>\n<h2>Overview</h2>\n<h3>Recent Activity</h3>', explanation: 'Use sequential heading levels without skipping', confidence: 0.89 },
        status: 'detected',
    },
    {
        id: 'a4',
        title: 'Small Tap Target',
        description: 'Close button is 24x24px. WCAG recommends a minimum target size of 44x44px for touch devices.',
        severity: 'warning',
        confidence: 0.85,
        suggestedFix: { file: 'modal.css', patch: '.close-btn {\n  min-width: 44px;\n  min-height: 44px;\n  padding: 10px;\n}', explanation: 'Increase tap target to 44px minimum', confidence: 0.85 },
        status: 'detected',
    },
    {
        id: 'a5',
        title: 'Layout Misalignment',
        description: 'Footer links are not vertically centered due to inconsistent line-height values.',
        severity: 'info',
        confidence: 0.78,
        suggestedFix: { file: 'footer.css', patch: '.footer-links {\n  display: flex;\n  align-items: center;\n  line-height: 1.5;\n}', explanation: 'Normalize line-height for consistent alignment', confidence: 0.78 },
        status: 'detected',
    },
];

export default function AnalyzerPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setUploadedImage(url);

        // Simulate analysis
        setIsAnalyzing(true);
        setTimeout(() => {
            setIssues(mockAnalysisResults);
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        setIsAnalyzing(true);
        setTimeout(() => {
            setIssues(mockAnalysisResults);
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleApply = (issue: Issue) => {
        setSelectedIssue(issue);
        setShowActionModal(true);
    };

    const handleExecute = () => {
        if (selectedIssue) {
            setIssues((prev) =>
                prev.map((i) => (i.id === selectedIssue.id ? { ...i, status: 'applied' as const } : i))
            );
            setShowActionModal(false);
        }
    };

    const handleApplyAll = () => {
        setIssues((prev) => prev.map((i) => ({ ...i, status: 'applied' as const })));
    };

    const severityConfig = {
        critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'badge-critical', label: 'High' },
        warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'badge-warning', label: 'Medium' },
        info: { icon: Info, color: 'text-blue-400', bg: 'badge-info', label: 'Low' },
    };

    const appliedCount = issues.filter((i) => i.status === 'applied').length;
    const score = issues.length > 0 ? Math.round((appliedCount / issues.length) * 100) : 0;

    return (
        <div className="flex h-screen bg-surface-950">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Screenshot Analyzer</h1>
                            <p className="text-sm text-surface-400">
                                Upload a screenshot. The AI will detect UI and accessibility issues.
                            </p>
                        </div>
                        {issues.length > 0 && (
                            <button onClick={handleApplyAll} className="btn-primary flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Apply All Fixes
                            </button>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Left: Upload & Preview */}
                        <div className="col-span-5">
                            {!uploadedImage ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="card !p-0 overflow-hidden"
                                >
                                    <div className="border-2 border-dashed border-white/10 hover:border-primary-500/30 rounded-xl m-1 p-16 text-center transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FileImage className="w-16 h-16 text-surface-700 mx-auto mb-4" />
                                        <p className="text-sm text-surface-400 mb-2">
                                            Drag & drop a screenshot here, or click to upload
                                        </p>
                                        <p className="text-xs text-surface-600">PNG, JPG, or WebP — max 10MB</p>
                                        <button className="btn-primary !py-2 !px-5 text-sm mt-6">
                                            <Upload className="w-4 h-4 inline mr-2" />
                                            Upload Screenshot
                                        </button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUpload}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card !p-3">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded screenshot"
                                        className="w-full rounded-xl shadow-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            setUploadedImage(null);
                                            setIssues([]);
                                        }}
                                        className="mt-3 text-xs text-surface-500 hover:text-surface-300 transition-colors"
                                    >
                                        Upload a different screenshot
                                    </button>
                                </motion.div>
                            )}

                            {/* Score card */}
                            {issues.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="card mt-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-white flex items-center gap-2">
                                            <Gauge className="w-4 h-4 text-primary-400" />
                                            Fix Progress
                                        </span>
                                        <span className="text-lg font-bold gradient-text">{score}%</span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-surface-800 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400"
                                        />
                                    </div>
                                    <p className="text-xs text-surface-500 mt-2">
                                        {appliedCount} of {issues.length} fixes applied
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Issues */}
                        <div className="col-span-7">
                            {isAnalyzing ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-16">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <p className="text-sm text-surface-400">Analyzing screenshot with Gemini AI...</p>
                                    <p className="text-xs text-surface-600 mt-1">Detecting UI issues, accessibility problems, and layout inconsistencies</p>
                                </motion.div>
                            ) : issues.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-16">
                                    <Sparkles className="w-12 h-12 text-surface-700 mx-auto mb-4" />
                                    <p className="text-sm text-surface-400">Upload a screenshot to begin analysis</p>
                                    <p className="text-xs text-surface-600 mt-1">The AI will detect issues and suggest fixes automatically</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {issues.map((issue, i) => {
                                            const config = severityConfig[issue.severity];
                                            return (
                                                <motion.div
                                                    key={issue.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.08 }}
                                                    className={`card !p-5 ${issue.status === 'applied' ? 'opacity-60' : ''}`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-start gap-3">
                                                            <config.icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} />
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bg}`}>
                                                                        {config.label}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-surface-400 leading-relaxed">{issue.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                                                            <span className="text-xs text-surface-500">{Math.round(issue.confidence * 100)}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Patch */}
                                                    {issue.suggestedFix && (
                                                        <div className="bg-surface-900/80 rounded-lg p-3 mb-3">
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                                <span className="text-[10px] text-surface-500 font-mono">{issue.suggestedFix.file}</span>
                                                            </div>
                                                            <pre className="text-[11px] text-emerald-300/80 font-mono leading-relaxed">
                                                                {issue.suggestedFix.patch}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        {issue.status === 'applied' ? (
                                                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                Applied
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <button className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    Preview
                                                                </button>
                                                                <button className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    Explain
                                                                </button>
                                                                <button
                                                                    onClick={() => handleApply(issue)}
                                                                    className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1"
                                                                >
                                                                    <Play className="w-3 h-3" />
                                                                    Apply
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <ActionModal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                onExecute={handleExecute}
                issue={selectedIssue}
            />
        </div>
    );
}
