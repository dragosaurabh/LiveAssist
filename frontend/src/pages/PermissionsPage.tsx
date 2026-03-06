import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mic, Monitor, Shield, CheckCircle2 } from 'lucide-react';

export default function PermissionsPage() {
    const navigate = useNavigate();
    const { grantPermissions, user } = useAuthStore();

    const handleGrant = () => {
        grantPermissions();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[30%] w-[500px] h-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-lg px-6"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Permissions Required</h1>
                    <p className="text-surface-400 text-sm">
                        LiveAssist needs access to your microphone and screen to provide real-time assistance.
                    </p>
                </div>

                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-xl p-4 mb-6 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-surface-400">{user.email}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                    </motion.div>
                )}

                <div className="space-y-3 mb-8">
                    {[
                        {
                            icon: Mic,
                            title: 'Microphone Access',
                            desc: 'For voice commands and live transcription',
                            gradient: 'from-blue-500 to-cyan-400',
                        },
                        {
                            icon: Monitor,
                            title: 'Screen Recording',
                            desc: 'For screen sharing and UI analysis',
                            gradient: 'from-violet-500 to-purple-400',
                        },
                    ].map((perm, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="card flex items-center gap-4 !py-5"
                        >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${perm.gradient} flex items-center justify-center shrink-0`}>
                                <perm.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{perm.title}</p>
                                <p className="text-xs text-surface-400">{perm.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                >
                    <button onClick={handleGrant} className="btn-primary w-full text-center">
                        Grant Permissions
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-center text-sm text-surface-500 hover:text-surface-300 transition-colors py-2"
                    >
                        Skip for now
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
