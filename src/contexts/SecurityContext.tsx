import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityLog {
    id: string;
    timestamp: Date;
    type: string;
    source: string;
    details: string;
    severity: ThreatLevel;
    blocked: boolean;
}

interface SecurityContextType {
    logs: SecurityLog[];
    threatLevel: ThreatLevel;
    logEvent: (type: string, source: string, details: string, severity?: ThreatLevel, blocked?: boolean) => void;
    detectThreat: (input: string, source: string) => boolean;
    clearLogs: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [threatLevel, setThreatLevel] = useState<ThreatLevel>('LOW');

    // XSS and SQL Injection patterns to detect
    const THREAT_PATTERNS = [
        /<script\b[^>]*>([\s\S]*?)<\/script>/gm, // XSS: script tags
        /javascript:/gi, // XSS: javascript protocol
        /on\w+=/gi, // XSS: event handlers
        /'\s*OR\s*1=1/gi, // SQLi: Classic OR 1=1
        /;\s*DROP\s+TABLE/gi, // SQLi: DROP TABLE
        /UNION\s+SELECT/gi, // SQLi: UNION based
        /--/g, // SQLi: Comment
    ];

    const logEvent = useCallback((type: string, source: string, details: string, severity: ThreatLevel = 'LOW', blocked: boolean = true) => {
        const newLog: SecurityLog = {
            id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            type,
            source,
            details,
            severity,
            blocked
        };

        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs

        // Escalate threat level based on recent critical events
        if (severity === 'CRITICAL' || severity === 'HIGH') {
            setThreatLevel('HIGH');
            // Auto-reset after 30 seconds
            setTimeout(() => setThreatLevel('LOW'), 30000);
        }

        if (blocked) {
            toast.error(`Security Alert: ${type} attempt blocked!`, {
                description: `Source: ${source}`,
            });
        }
    }, []);

    const detectThreat = useCallback((input: string, source: string): boolean => {
        for (const pattern of THREAT_PATTERNS) {
            if (pattern.test(input)) {
                logEvent('Malicious Input Detected', source, `Pattern matched: ${pattern}`, 'HIGH', true);
                return true;
            }
        }
        return false;
    }, [logEvent]);

    const clearLogs = () => setLogs([]);

    return (
        <SecurityContext.Provider value={{ logs, threatLevel, logEvent, detectThreat, clearLogs }}>
            {children}
        </SecurityContext.Provider>
    );
}

export function useSecurity() {
    const context = useContext(SecurityContext);
    if (context === undefined) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
}
