export interface LogEntry {
    id: string;
    timestamp: string;
    severity: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    source: string;
    eventID: string;
    message: string;
    user: string;
    sourceIP: string;
    category: 'System' | 'Security' | 'Application' | 'Firewall';
}

type LogListener = (log: LogEntry) => void;

class LogService {
    private logs: LogEntry[] = [];
    private listeners: LogListener[] = [];
    private intervalId: any = null;

    private users = ['SYSTEM', 'admin', 'dskum', 'service_account', 'network_service'];
    private sources = ['DC-01', 'WEB-01', 'DB-01', 'FW-ENT-01', 'IDS-01'];

    // NIST/Windows Event ID Mappings
    private eventTemplates = [
        { id: '4624', msg: 'An account was successfully logged on.', category: 'Security', severity: 'INFO' },
        { id: '4625', msg: 'An account failed to log on.', category: 'Security', severity: 'WARN' },
        { id: '1102', msg: 'The audit log was cleared.', category: 'Security', severity: 'CRITICAL' },
        { id: '4688', msg: 'A new process has been created.', category: 'System', severity: 'INFO' },
        { id: '7045', msg: 'A service was installed in the system.', category: 'System', severity: 'WARN' },
        { id: 'DENY', msg: 'Firewall blocked connection on port 445.', category: 'Firewall', severity: 'WARN' },
        { id: 'IDS-01', msg: 'Potential SQL Injection attempt detected.', category: 'Application', severity: 'CRITICAL' },
    ];

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => this.generateLog(), 2000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    subscribe(listener: LogListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    getInitialLogs(): LogEntry[] {
        // Generate some backlog
        return Array.from({ length: 20 }).map(() => this.createRandomLog());
    }

    private generateLog() {
        const log = this.createRandomLog();
        this.notify(log);
    }

    private createRandomLog(): LogEntry {
        const template = this.eventTemplates[Math.floor(Math.random() * this.eventTemplates.length)];
        const source = this.sources[Math.floor(Math.random() * this.sources.length)];
        const user = this.users[Math.floor(Math.random() * this.users.length)];

        return {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            severity: template.severity as any,
            source,
            eventID: template.id,
            message: template.msg,
            user,
            sourceIP: `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 255)}`,
            category: template.category as any,
        };
    }

    addLog(log: Omit<LogEntry, 'id'> & { id?: string }) {
        const fullLog: LogEntry = {
            ...log,
            id: log.id || Math.random().toString(36).substr(2, 9)
        };
        this.logs.unshift(fullLog);
        this.notify(fullLog);
    }

    private notify(log: LogEntry) {
        this.listeners.forEach(l => l(log));
    }
}

export const logService = new LogService();
