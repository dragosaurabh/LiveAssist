import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Zap, Chrome, Github, KeyRound } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const handleLogin = (provider: 'google' | 'github' | 'sso') => {
        login(provider);
        navigate('/permissions');
    };

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome to LiveAssist</h1>
                    <p className="text-surface-400 text-sm">Sign in to start your AI-powered debugging session</p>
                </motion.div>

                {/* Login buttons */}
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                    <button
                        onClick={() => handleLogin('google')}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl glass hover:bg-white/[0.08] transition-all text-sm font-medium text-white group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                            <Chrome className="w-5 h-5 text-surface-300" />
                        </div>
                        Continue with Google
                        <span className="ml-auto text-surface-600 text-xs">Recommended</span>
                    </button>

                    <button
                        onClick={() => handleLogin('github')}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl glass hover:bg-white/[0.08] transition-all text-sm font-medium text-white group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                            <Github className="w-5 h-5 text-surface-300" />
                        </div>
                        Continue with GitHub
                    </button>

                    <div className="flex items-center gap-3 py-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-surface-500">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                        onClick={() => handleLogin('sso')}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl glass hover:bg-white/[0.08] transition-all text-sm font-medium text-white group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                            <KeyRound className="w-5 h-5 text-surface-300" />
                        </div>
                        SSO Login
                    </button>
                </motion.div>

                {/* Footer */}
                <motion.p
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-center text-xs text-surface-600 mt-8"
                >
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-surface-400 hover:text-white transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-surface-400 hover:text-white transition-colors">Privacy Policy</a>.
                </motion.p>
            </motion.div>
        </div>
    );
}
