import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    Plus,
    TrendingUp,
    CheckCircle2,
    Clock,
    Brain,
    ArrowRight,
    MoreHorizontal,
    Mic,
    Camera,
    Monitor,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};

const metrics = [
    { icon: TrendingUp, label: 'Total Sessions', value: '127', change: '+12%', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10' },
    { icon: CheckCircle2, label: 'Success Rate', value: '94.2%', change: '+3.1%', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/10' },
    { icon: Clock, label: 'Time Saved', value: '48h', change: '+8h', color: 'text-violet-400', bg: 'from-violet-500/20 to-violet-600/10' },
    { icon: Brain, label: 'AI Confidence', value: '91.5%', change: '+1.2%', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10' },
];

const recentSessions = [
    { name: 'Login Page Debug', date: 'Mar 5, 2026', type: 'Screenshot', status: 'completed', icon: Camera },
    { name: 'Dashboard Layout Fix', date: 'Mar 5, 2026', type: 'Voice', status: 'completed', icon: Mic },
    { name: 'Onboarding Flow Review', date: 'Mar 4, 2026', type: 'Screen Share', status: 'active', icon: Monitor },
    { name: 'Settings Page Audit', date: 'Mar 4, 2026', type: 'Screenshot', status: 'completed', icon: Camera },
    { name: 'Checkout Form Debug', date: 'Mar 3, 2026', type: 'Voice', status: 'paused', icon: Mic },
];

export default function DashboardPage() {
    const navigate = useNavigate();

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
                            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                            <p className="text-sm text-surface-400">Welcome back. Here's your session overview.</p>
                        </div>
                        <button
                            onClick={() => navigate('/workspace')}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Session
                        </button>
                    </motion.div>

                    {/* Start Session Card */}
                    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
                        <div className="card gradient-border !p-0 overflow-hidden">
                            <div className="relative p-8">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-600/10 to-transparent rounded-bl-full" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-2">Start a new debugging session</h2>
                                        <p className="text-sm text-surface-400 max-w-lg">
                                            Upload a screenshot, share your screen, or start a voice conversation with the AI agent.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/workspace')}
                                        className="btn-primary flex items-center gap-2 shrink-0"
                                    >
                                        Start Session
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {metrics.map((metric, i) => (
                            <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible" className="card">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.bg} flex items-center justify-center`}>
                                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        {metric.change}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-white mb-0.5">{metric.value}</p>
                                <p className="text-xs text-surface-500">{metric.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Sessions */}
                    <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Recent Sessions</h2>
                            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                                View all
                            </button>
                        </div>
                        <div className="card !p-0 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">
                                            Session
                                        </th>
                                        <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">
                                            Date
                                        </th>
                                        <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">
                                            Type
                                        </th>
                                        <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">
                                            Status
                                        </th>
                                        <th className="text-right text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSessions.map((session, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                                            onClick={() => navigate('/workspace')}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center">
                                                        <session.icon className="w-4 h-4 text-surface-400" />
                                                    </div>
                                                    <span className="text-sm font-medium text-white">{session.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-surface-400">{session.date}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-surface-300 bg-surface-800 px-2.5 py-1 rounded-lg">
                                                    {session.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${session.status === 'completed'
                                                            ? 'badge-success'
                                                            : session.status === 'active'
                                                                ? 'badge-info'
                                                                : 'badge-warning'
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${session.status === 'completed'
                                                                ? 'bg-emerald-400'
                                                                : session.status === 'active'
                                                                    ? 'bg-blue-400 pulse-live'
                                                                    : 'bg-amber-400'
                                                            }`}
                                                    />
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-surface-500 hover:text-surface-300 transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
