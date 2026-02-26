export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Threat {
    id: number;
    type: string;
    target: string;
    origin: string;
    severity: ThreatSeverity;
    timestamp: number;
}

type ThreatListener = (threat: Threat) => void;

class ThreatSimulationService {
    private listeners: ThreatListener[] = [];
    private intervalId: any = null;
    private threatTypes = [
        'DDoS Attack', 'SQL Injection', 'XSS Attempt', 'Brute Force',
        'Malware Beacon', 'Data Exfiltration', 'Port Scanning', 'Ransomware',
        'Zero-Day Exploit', 'Man-in-the-Middle', 'Phishing Campaign'
    ];
    private targets = [
        'Finance Gateway', 'User Database', 'Admin Portal', 'API Endpoint',
        'Cloud Storage', 'Email Server', 'Firewall', 'Load Balancer',
        'Authentication Service', 'Payment Processor'
    ];
    private origins = [
        'Unknown Proxy', 'Tor Exit Node', 'Botnet (Mirai)', 'Compromised IoT',
        'North America', 'Eastern Europe', 'East Asia', 'South America',
        'West Asia', 'Cloud Instance (AWS)', 'Cloud Instance (Azure)'
    ];

    start() {
        if (this.intervalId) return;

        // Visibility API listener
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        this.scheduleNextWithCheck();
    }

    stop() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    private handleVisibilityChange = () => {
        if (document.hidden) {
            if (this.intervalId) {
                clearTimeout(this.intervalId);
                this.intervalId = null;
            }
        } else {
            this.scheduleNextWithCheck();
        }
    }

    private scheduleNextWithCheck() {
        if (this.intervalId) return;

        const scheduleNext = () => {
            if (document.hidden) return; // double check

            const delay = Math.random() * 3000 + 500;
            this.intervalId = setTimeout(() => {
                this.generateThreat();
                this.intervalId = null; // Clear id before scheduling next
                scheduleNext();
            }, delay);
        };

        scheduleNext();
    }

    subscribe(listener: ThreatListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private generateThreat() {
        const severityRoll = Math.random();
        let severity: ThreatSeverity = 'low';
        if (severityRoll > 0.95) severity = 'critical';
        else if (severityRoll > 0.8) severity = 'high';
        else if (severityRoll > 0.6) severity = 'medium';

        const threat: Threat = {
            id: Date.now(),
            type: this.getRandom(this.threatTypes),
            target: this.getRandom(this.targets),
            origin: this.getRandom(this.origins),
            severity,
            timestamp: Date.now()
        };

        this.notify(threat);
    }

    private notify(threat: Threat) {
        this.listeners.forEach(listener => listener(threat));
    }

    private getRandom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export const threatSimulation = new ThreatSimulationService();
