import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        provider: 'google' | 'github' | 'sso';
    } | null;
    permissions: {
        microphone: boolean;
        screenRecording: boolean;
    };
    login: (provider: 'google' | 'github' | 'sso') => void;
    logout: () => void;
    grantPermissions: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    permissions: {
        microphone: false,
        screenRecording: false,
    },
    login: (provider) =>
        set({
            isAuthenticated: true,
            user: {
                id: 'usr_demo_001',
                name: 'Saurabh Singh',
                email: 'saurabh@example.com',
                avatar: '',
                provider,
            },
        }),
    logout: () =>
        set({
            isAuthenticated: false,
            user: null,
            permissions: { microphone: false, screenRecording: false },
        }),
    grantPermissions: () =>
        set({ permissions: { microphone: true, screenRecording: true } }),
}));
