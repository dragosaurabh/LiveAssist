import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    Home,
    Layers,
    FileText,
    Settings,
    Zap,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/workspace', icon: Layers, label: 'Sessions' },
    { to: '/analyzer', icon: FileText, label: 'Analyzer' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside
            className={`h-screen flex flex-col bg-surface-950 border-r border-white/5 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-2 px-5 py-5 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                </div>
                {!collapsed && <span className="text-sm font-bold text-white tracking-tight">LiveAssist</span>}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-primary-600/15 text-primary-400'
                                : 'text-surface-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="mx-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-surface-500 hover:text-surface-300 hover:bg-white/5 transition-all"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
            </button>

            {/* User */}
            <div className="border-t border-white/5 p-3">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                            <p className="text-[10px] text-surface-500 truncate">{user?.email}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button onClick={handleLogout} className="text-surface-500 hover:text-surface-300 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
