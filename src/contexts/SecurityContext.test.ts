import { describe, it, expect } from 'vitest';

// We'll test the pure logic function separated from the React Context for easier unit testing
// In a real scenario, we might export this helper or test the hook with renderHook
const THREAT_PATTERNS = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/gm,
    /javascript:/gi,
    /on\w+=/gi,
    /'\s*OR\s*1=1/gi,
    /;\s*DROP\s+TABLE/gi,
    /UNION\s+SELECT/gi,
    /--/g,
];

function detectThreat(input: string): boolean {
    for (const pattern of THREAT_PATTERNS) {
        if (pattern.test(input)) {
            return true;
        }
    }
    return false;
}

describe('Security Logic', () => {
    it('should detect XSS script tags', () => {
        expect(detectThreat('<script>alert("xss")</script>')).toBe(true);
    });

    it('should detect SQL Injection OR clause', () => {
        expect(detectThreat("' OR 1=1")).toBe(true);
    });

    it('should detect SQL Injection DROP TABLE', () => {
        expect(detectThreat("; DROP TABLE users")).toBe(true);
    });

    it('should detect malicious event handlers', () => {
        expect(detectThreat('<img src=x onerror=alert(1)>')).toBe(true);
    });

    it('should allow safe normal text', () => {
        expect(detectThreat('Hello world, this is a safe message.')).toBe(false);
        expect(detectThreat('user@example.com')).toBe(false);
    });
});
