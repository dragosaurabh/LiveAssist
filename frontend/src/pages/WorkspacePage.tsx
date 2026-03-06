import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ActionModal from '../components/ActionModal';
import HandoffModal from '../components/HandoffModal';
import { useSessionStore } from '../store/sessionStore';
import type { Issue } from '../store/sessionStore';
import {
    Send,
    Upload,
    Mic,
    MicOff,
    ZoomIn,
    ZoomOut,
    Monitor,
    Download,
    ChevronRight,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Info,
    Eye,
    Undo2,
    Play,
    Users,
    Gauge,
} from 'lucide-react';

// Mock issues for demo
const mockIssues: Issue[] = [
    {
        id: 'iss_1',
        title: 'Button Alignment Issue',
        description: 'The login button is misaligned due to parent flex container using flex-start instead of center.',
        severity: 'critical',
        confidence: 0.94,
        boundingBox: { x: 120, y: 80, width: 180, height: 45, label: 'Misaligned Button', color: 'red' },
        suggestedFix: {
            file: 'login.css',
            patch: '.login-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
            explanation: 'Change justify-content to center to fix button alignment.',
            confidence: 0.94,
        },
        status: 'detected',
    },
    {
        id: 'iss_2',
        title: 'Low Color Contrast',
        description: 'Text color #999 on background #fff has a contrast ratio of 2.85:1, below the WCAG AA minimum of 4.5:1.',
        severity: 'warning',
        confidence: 0.88,
        boundingBox: { x: 300, y: 160, width: 140, height: 30, label: 'Low Contrast', color: 'yellow' },
        suggestedFix: {
            file: 'theme.css',
            patch: '.subtitle {\n  color: #595959; /* 7:1 contrast ratio */\n}',
            explanation: 'Darken text color to meet WCAG AA contrast requirements.',
            confidence: 0.88,
        },
        status: 'detected',
    },
    {
        id: 'iss_3',
        title: 'Missing ARIA Label',
        description: 'The search input field lacks an aria-label attribute, making it inaccessible to screen readers.',
        severity: 'info',
        confidence: 0.82,
        boundingBox: { x: 80, y: 240, width: 200, height: 35, label: 'Missing ARIA', color: 'blue' },
        suggestedFix: {
            file: 'search.tsx',
            patch: '<input\n  type="search"\n  aria-label="Search"\n  placeholder="Search..."\n/>',
            explanation: 'Add aria-label to make the input accessible to screen readers.',
            confidence: 0.82,
        },
        status: 'detected',
    },
];

const initialMessages = [
    {
        role: 'system' as const,
        content: 'Session started. Upload a screenshot or describe the UI problem you need help with.',
        type: 'text' as const,
    },
];

export default function WorkspacePage() {
    const { messages, issues, uploadedImage, isRecording, addMessage, setIssues, setUploadedImage, setRecording, applyFix, undoFix } = useSessionStore();
    const [inputText, setInputText] = useState('');
    const [zoom, setZoom] = useState(1);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showHandoffModal, setShowHandoffModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initialized = useRef(false);

    // Initialize session
    useEffect(() => {
        if (!initialized.current && messages.length === 0) {
            initialized.current = true;
            initialMessages.forEach((m) => addMessage(m));
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        addMessage({ role: 'user', content: inputText, type: 'text' });

        // Simulate AI response
        setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: 'I can see the UI issues. Let me analyze the screenshot and highlight the problems I detect.',
                type: 'text',
            });
        }, 800);

        setInputText('');
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        addMessage({ role: 'user', content: 'Uploaded a screenshot for analysis.', type: 'image', imageUrl: url });

        // Simulate analysis
        setIsAnalyzing(true);
        setTimeout(() => {
            setIssues(mockIssues);
            setIsAnalyzing(false);
            addMessage({
                role: 'assistant',
                content: `Analysis complete! I found ${mockIssues.length} issues:\n\n• **Button Alignment Issue** (Critical, 94% confidence)\n• **Low Color Contrast** (Warning, 88% confidence)\n• **Missing ARIA Label** (Info, 82% confidence)\n\nCheck the Suggested Fixes panel on the right for detailed patches.`,
                type: 'analysis',
                issues: mockIssues,
            });
        }, 2500);
    };

    const handleApplyFix = (issue: Issue) => {
        setSelectedIssue(issue);
        setShowActionModal(true);
    };

    const handleExecute = () => {
        if (selectedIssue) {
            applyFix(selectedIssue.id);
            setShowActionModal(false);
            addMessage({
                role: 'system',
                content: `✅ Patch applied: ${selectedIssue.title}`,
                type: 'text',
            });
        }
    };

    const performanceScore = issues.length > 0
        ? Math.round((issues.filter((i) => i.status === 'applied').length / issues.length) * 100)
        : 0;

    const severityIcon = (s: string) => {
        if (s === 'critical') return <AlertTriangle className="w-4 h-4 text-red-400" />;
        if (s === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
        return <Info className="w-4 h-4 text-blue-400" />;
    };

    return (
        <div className="flex h-screen bg-surface-950">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-live" />
                        <span className="text-sm font-medium text-white">Live Session</span>
                        <span className="text-xs text-surface-500">sess_{Date.now().toString(36)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowHandoffModal(true)}
                            className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5"
                        >
                            <Users className="w-3.5 h-3.5" />
                            Handoff
                        </button>
                        <button className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Report
                        </button>
                    </div>
                </div>

                {/* Three-panel layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Chat */}
                    <div className="w-[340px] flex flex-col border-r border-white/5">
                        <div className="flex-1 overflow-auto p-4 space-y-3">
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                                ? 'bg-primary-600/20 text-primary-100 rounded-br-md'
                                                : msg.role === 'assistant'
                                                    ? 'glass-light text-surface-200 rounded-bl-md'
                                                    : 'bg-surface-800/50 text-surface-400 text-xs italic rounded-md'
                                                }`}
                                        >
                                            {msg.role === 'assistant' && (
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                                                    <span className="text-xs font-semibold text-primary-400">AI Agent</span>
                                                </div>
                                            )}
                                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                            {msg.imageUrl && (
                                                <img src={msg.imageUrl} alt="Uploaded" className="mt-2 rounded-lg max-h-32 w-full object-cover" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isAnalyzing && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="glass-light rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs text-surface-400">Analyzing screenshot...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-white/5 p-4">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUpload}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-9 h-9 rounded-xl bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors"
                                >
                                    <Upload className="w-4 h-4 text-surface-400" />
                                </button>
                                <button
                                    onClick={() => setRecording(!isRecording)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500/20 text-red-400' : 'bg-surface-800 hover:bg-surface-700 text-surface-400'
                                        }`}
                                >
                                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask about UI issues..."
                                        className="w-full bg-surface-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-500 border border-white/5 focus:border-primary-500/50 focus:outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Center: Canvas */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 relative bg-surface-900/50 overflow-hidden flex items-center justify-center">
                            {uploadedImage ? (
                                <div className="relative" style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
                                    <img src={uploadedImage} alt="Screenshot" className="max-w-full max-h-[70vh] rounded-lg shadow-2xl" />
                                    {/* Overlay bounding boxes */}
                                    {issues.map((issue) =>
                                        issue.boundingBox ? (
                                            <motion.div
                                                key={issue.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: issue.status === 'applied' ? 0.3 : 1, scale: 1 }}
                                                className="absolute"
                                                style={{
                                                    left: issue.boundingBox.x,
                                                    top: issue.boundingBox.y,
                                                    width: issue.boundingBox.width,
                                                    height: issue.boundingBox.height,
                                                }}
                                            >
                                                <div
                                                    className={`w-full h-full border-2 rounded-lg ${issue.boundingBox.color === 'red'
                                                        ? 'border-red-500/70 bg-red-500/5'
                                                        : issue.boundingBox.color === 'yellow'
                                                            ? 'border-yellow-500/70 bg-yellow-500/5'
                                                            : 'border-blue-500/70 bg-blue-500/5'
                                                        }`}
                                                />
                                                <span
                                                    className={`absolute -top-6 left-0 text-[10px] font-medium px-2 py-0.5 rounded-md ${issue.boundingBox.color === 'red'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : issue.boundingBox.color === 'yellow'
                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                            : 'bg-blue-500/20 text-blue-400'
                                                        }`}
                                                >
                                                    {issue.boundingBox.label}
                                                </span>
                                            </motion.div>
                                        ) : null
                                    )}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Monitor className="w-20 h-20 text-surface-700 mx-auto mb-4" />
                                    <p className="text-surface-500 mb-2">No screenshot uploaded yet</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="btn-secondary text-sm !py-2 !px-5"
                                    >
                                        Upload Screenshot
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bottom controls */}
                        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-surface-950/50">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
                                    className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors"
                                >
                                    <ZoomIn className="w-4 h-4 text-surface-400" />
                                </button>
                                <span className="text-xs text-surface-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
                                <button
                                    onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                                    className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors"
                                >
                                    <ZoomOut className="w-4 h-4 text-surface-400" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload
                                </button>
                                <button className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5">
                                    <Monitor className="w-3.5 h-3.5" />
                                    Screen Share
                                </button>
                                <button className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Fixes */}
                    <div className="w-[340px] flex flex-col border-l border-white/5">
                        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Suggested Fixes</h3>
                            {issues.length > 0 && (
                                <span className="text-xs bg-primary-600/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">
                                    {issues.filter((i) => i.status === 'detected').length} pending
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto p-4 space-y-3">
                            <AnimatePresence>
                                {issues.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="w-10 h-10 text-surface-700 mx-auto mb-3" />
                                        <p className="text-sm text-surface-500">No issues detected yet</p>
                                        <p className="text-xs text-surface-600 mt-1">Upload a screenshot to get started</p>
                                    </div>
                                ) : (
                                    issues.map((issue, i) => (
                                        <motion.div
                                            key={issue.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`card !p-4 ${issue.status === 'applied' ? 'opacity-60' : ''}`}
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                {severityIcon(issue.severity)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-semibold text-white truncate">{issue.title}</h4>
                                                        <span
                                                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${issue.severity === 'critical'
                                                                ? 'badge-critical'
                                                                : issue.severity === 'warning'
                                                                    ? 'badge-warning'
                                                                    : 'badge-info'
                                                                }`}
                                                        >
                                                            {issue.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-surface-400 leading-relaxed">{issue.description}</p>
                                                </div>
                                            </div>

                                            {/* Confidence */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${issue.confidence * 100}%` }}
                                                        transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                                                        className={`h-full rounded-full ${issue.confidence > 0.9
                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                            : issue.confidence > 0.8
                                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                                                : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                                            }`}
                                                    />
                                                </div>
                                                <span className="text-xs text-surface-400 font-medium w-10 text-right">
                                                    {Math.round(issue.confidence * 100)}%
                                                </span>
                                            </div>

                                            {/* Code patch preview */}
                                            {issue.suggestedFix && (
                                                <div className="bg-surface-900/80 rounded-lg p-3 mb-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                        <span className="text-[10px] text-surface-400 font-mono">{issue.suggestedFix.file}</span>
                                                    </div>
                                                    <pre className="text-[11px] text-emerald-300/80 font-mono leading-relaxed overflow-x-auto">
                                                        {issue.suggestedFix.patch}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {issue.status === 'applied' ? (
                                                    <>
                                                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Applied
                                                        </span>
                                                        <button
                                                            onClick={() => undoFix(issue.id)}
                                                            className="ml-auto text-xs text-surface-400 hover:text-surface-200 flex items-center gap-1 transition-colors"
                                                        >
                                                            <Undo2 className="w-3.5 h-3.5" />
                                                            Undo
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            Preview
                                                        </button>
                                                        <button
                                                            onClick={() => handleApplyFix(issue)}
                                                            className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1"
                                                        >
                                                            <Play className="w-3 h-3" />
                                                            Apply
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Performance Score */}
                        {issues.length > 0 && (
                            <div className="border-t border-white/5 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-surface-400 flex items-center gap-1.5">
                                        <Gauge className="w-3.5 h-3.5" />
                                        Performance Score
                                    </span>
                                    <span className="text-sm font-bold text-white">{performanceScore}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-surface-800 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${performanceScore}%` }}
                                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ActionModal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                onExecute={handleExecute}
                issue={selectedIssue}
            />
            <HandoffModal
                isOpen={showHandoffModal}
                onClose={() => setShowHandoffModal(false)}
            />
        </div>
    );
}
