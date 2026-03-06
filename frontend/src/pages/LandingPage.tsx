import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    Monitor,
    Shield,
    ArrowRight,
    Play,
    Sparkles,
    Zap,
    Eye,
    Github,
    Figma,
    Code2,
    MessageSquare,
    Cloud,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const features = [
    {
        icon: Mic,
        title: 'Live Voice Assistance',
        description: 'Speak naturally with the AI agent. Real-time transcription and voice-driven debugging.',
        gradient: 'from-blue-500 to-cyan-400',
    },
    {
        icon: Eye,
        title: 'Screen Understanding',
        description: 'Upload screenshots or share your screen. The AI sees and understands your entire UI.',
        gradient: 'from-violet-500 to-purple-400',
    },
    {
        icon: Shield,
        title: 'Safe Action Sandbox',
        description: 'Preview and apply patches in a sandboxed environment. Every action logged and reversible.',
        gradient: 'from-emerald-500 to-teal-400',
    },
];

const integrations = [
    { name: 'GitHub', icon: Github },
    { name: 'Figma', icon: Figma },
    { name: 'VS Code', icon: Code2 },
    { name: 'Slack', icon: MessageSquare },
    { name: 'AWS', icon: Cloud },
];

const stats = [
    { value: '10K+', label: 'Sessions Analyzed' },
    { value: '94%', label: 'Fix Accuracy' },
    { value: '3.2s', label: 'Avg Response' },
    { value: '500+', label: 'Teams' },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-950 overflow-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
            </div>

            {/* Nav */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">LiveAssist</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm text-surface-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
                    <a href="#" className="hover:text-white transition-colors">Documentation</a>
                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-secondary text-sm !py-2.5 !px-5"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary text-sm !py-2.5 !px-5"
                    >
                        Get Started
                    </button>
                </div>
            </motion.nav>

            {/* Hero */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-surface-300 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span>Powered by Google Gemini multimodal AI</span>
                </motion.div>

                <motion.h1
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-extrabold leading-[1.08] mb-6 tracking-tight"
                >
                    <span className="text-white">Design, debug, and</span>
                    <br />
                    <span className="gradient-text">resolve — live.</span>
                </motion.h1>

                <motion.p
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Upload a screenshot or start a voice call. Our AI agent analyzes your UI
                    and helps fix issues in real time.
                </motion.p>

                <motion.div
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center gap-4 flex-wrap"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary flex items-center gap-2 text-base !py-3.5 !px-8"
                    >
                        Start Live Session
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="btn-secondary flex items-center gap-2 text-base !py-3.5 !px-8">
                        <Play className="w-4 h-4" />
                        View Demo
                    </button>
                </motion.div>

                {/* Hero visual - Workspace Preview */}
                <motion.div
                    custom={3}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-16 max-w-5xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden gradient-border">
                        <div className="glass rounded-2xl p-1">
                            <div className="bg-surface-900/80 rounded-xl overflow-hidden">
                                {/* Mock workspace header */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="flex-1 text-center text-xs text-surface-500">LiveAssist — Live Session</div>
                                </div>
                                {/* Mock workspace content */}
                                <div className="grid grid-cols-12 gap-0 h-[340px]">
                                    {/* Chat panel */}
                                    <div className="col-span-3 border-r border-white/5 p-4">
                                        <div className="space-y-3">
                                            <div className="glass-light rounded-xl p-3 text-xs text-surface-300">
                                                <p className="text-primary-400 font-medium mb-1">You</p>
                                                Why is the login button misaligned?
                                            </div>
                                            <div className="glass-light rounded-xl p-3 text-xs text-surface-300">
                                                <p className="text-emerald-400 font-medium mb-1">AI Agent</p>
                                                The parent container uses flex-start which causes uneven spacing. I suggest adjusting justify-content.
                                            </div>
                                            <div className="glass-light rounded-xl p-3 text-xs text-surface-300">
                                                <p className="text-primary-400 font-medium mb-1">You</p>
                                                Can you fix it?
                                            </div>
                                        </div>
                                    </div>
                                    {/* Canvas */}
                                    <div className="col-span-6 relative bg-surface-950/50 flex items-center justify-center">
                                        <div className="text-center">
                                            <Monitor className="w-16 h-16 text-surface-700 mx-auto mb-3" />
                                            <p className="text-sm text-surface-500">Screenshot Analysis Canvas</p>
                                        </div>
                                        {/* Overlay annotations */}
                                        <div className="absolute top-12 left-8 w-32 h-8 border-2 border-red-500/60 rounded-lg flex items-center justify-center">
                                            <span className="text-[10px] text-red-400 font-medium">Misaligned</span>
                                        </div>
                                        <div className="absolute top-24 right-12 w-28 h-6 border-2 border-yellow-500/60 rounded-lg flex items-center justify-center">
                                            <span className="text-[10px] text-yellow-400 font-medium">Low Contrast</span>
                                        </div>
                                        <div className="absolute bottom-16 left-16 w-24 h-6 border-2 border-blue-500/60 rounded-lg flex items-center justify-center">
                                            <span className="text-[10px] text-blue-400 font-medium">Missing ARIA</span>
                                        </div>
                                    </div>
                                    {/* Fixes panel */}
                                    <div className="col-span-3 border-l border-white/5 p-4">
                                        <p className="text-xs font-semibold text-surface-300 mb-3">Suggested Fixes</p>
                                        <div className="space-y-2">
                                            {['Fix Alignment', 'Improve Contrast', 'Add ARIA Label'].map((fix, i) => (
                                                <div key={i} className="glass-light rounded-lg p-2.5">
                                                    <p className="text-xs font-medium text-white">{fix}</p>
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-16 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                                                    style={{ width: `${92 - i * 8}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] text-surface-400">{92 - i * 8}%</span>
                                                        </div>
                                                        <button className="text-[10px] text-primary-400 font-medium">Apply</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                            <div className="text-sm text-surface-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything you need to debug UI, <span className="gradient-text">live.</span>
                    </h2>
                    <p className="text-surface-400 max-w-xl mx-auto">
                        From voice interaction to safe patching — LiveAssist gives your team superpowers.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="card group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Integrations */}
            <section id="integrations" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm text-surface-500 uppercase tracking-wider mb-3">Trusted by developers worldwide</p>
                    <h2 className="text-2xl font-bold text-white">Integrates with your favorite tools</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-12 flex-wrap"
                >
                    {integrations.map((integration, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            className="flex flex-col items-center gap-2 text-surface-500 hover:text-surface-300 transition-colors cursor-pointer"
                        >
                            <integration.icon className="w-8 h-8" />
                            <span className="text-xs">{integration.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-4xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card text-center !py-16 !px-12 gradient-border"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to debug <span className="gradient-text">smarter</span>?
                    </h2>
                    <p className="text-surface-400 max-w-lg mx-auto mb-8">
                        Start your first live session and let AI handle the heavy lifting. No credit card required.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary text-base !py-3.5 !px-10 inline-flex items-center gap-2"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-white">LiveAssist</span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-surface-500">
                            <a href="#" className="hover:text-surface-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-surface-300 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-surface-300 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-surface-300 transition-colors">Support</a>
                        </div>
                        <p className="text-xs text-surface-600">© 2026 LiveAssist. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
