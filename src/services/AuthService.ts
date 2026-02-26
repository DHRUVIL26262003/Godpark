import type { User } from '@/types';

// Mock user database
const MOCK_USERS = [
    { email: 'user@example.com', password: 'password', name: 'Demo User', role: 'user' },
    { email: 'admin@whitelines.com', password: 'admin', name: 'Admin User', role: 'admin' }
];

const STORAGE_KEY = 'whitelines_auth_token';
const USER_KEY = 'whitelines_user';

export const AuthService = {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const user = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const token = `jwt-${Date.now()}-${Math.random().toString(36).substr(2)}`;
        const userData: User = {
            id: '1',
            name: user.name,
            email: user.email,
            role: user.role as 'user' | 'admin'
        };

        // Persist session
        localStorage.setItem(STORAGE_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        return { user: userData, token };
    },

    register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (MOCK_USERS.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        // In a real app, we'd hash the password here
        const newUser = { email, password, name, role: 'user' };
        MOCK_USERS.push(newUser);

        const token = `jwt-${Date.now()}-${Math.random().toString(36).substr(2)}`;
        const userData: User = {
            id: Math.random().toString(36).substr(2),
            name,
            email,
            role: 'user'
        };

        localStorage.setItem(STORAGE_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        return { user: userData, token };
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(STORAGE_KEY);
    }
};
