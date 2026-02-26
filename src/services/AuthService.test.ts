import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './AuthService';

describe('AuthService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should login successfully with valid credentials', async () => {
        const { user, token } = await AuthService.login('user@example.com', 'password');

        expect(user).toBeDefined();
        expect(user.email).toBe('user@example.com');
        expect(token).toBeDefined();
        expect(localStorage.getItem('whitelines_auth_token')).toBe(token);
    });

    it('should fail login with invalid credentials', async () => {
        await expect(AuthService.login('user@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should register a new user', async () => {
        const { user, token } = await AuthService.register('New User', 'new@example.com', 'password');

        expect(user.name).toBe('New User');
        expect(token).toBeDefined();
        expect(AuthService.getCurrentUser()).toEqual(user);
    });

    it('should logout correctly', async () => {
        await AuthService.login('user@example.com', 'password');
        expect(AuthService.isAuthenticated()).toBe(true);

        AuthService.logout();
        expect(AuthService.isAuthenticated()).toBe(false);
        expect(localStorage.getItem('whitelines_auth_token')).toBeNull();
    });
});
