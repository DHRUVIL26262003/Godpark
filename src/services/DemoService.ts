import { logService } from './LogService';

type ScenarioStep = {
    delay: number;
    action: () => void;
};

class DemoService {
    private isRunning = false;

    async startAttackScenario() {
        if (this.isRunning) return;
        this.isRunning = true;

        const timeline: ScenarioStep[] = [
            {
                delay: 0,
                action: () => logService.addLog({
                    id: 'demo-1', severity: 'INFO', eventID: 'START',
                    message: '--- DEMO SCENARIO STARTED: APT EMPULATION ---',
                    source: 'SYSTEM', user: 'ADMIN', category: 'System', timestamp: new Date().toISOString(), sourceIP: '127.0.0.1'
                })
            },
            {
                delay: 1000,
                action: () => logService.addLog({
                    id: 'demo-2', severity: 'WARN', eventID: 'SCAN',
                    message: 'Port Scan detected on ports 22, 80, 443, 3389.',
                    source: 'FW-ENT-01', user: 'N/A', category: 'Firewall', timestamp: new Date().toISOString(), sourceIP: '45.132.89.11'
                })
            },
            {
                delay: 2500,
                action: () => logService.addLog({
                    id: 'demo-3', severity: 'WARN', eventID: '4625',
                    message: 'Failed login attempt for user "admin".',
                    source: 'DC-01', user: 'admin', category: 'Security', timestamp: new Date().toISOString(), sourceIP: '45.132.89.11'
                })
            },
            {
                delay: 3000,
                action: () => logService.addLog({
                    id: 'demo-4', severity: 'WARN', eventID: '4625',
                    message: 'Failed login attempt for user "admin".',
                    source: 'DC-01', user: 'admin', category: 'Security', timestamp: new Date().toISOString(), sourceIP: '45.132.89.11'
                })
            },
            {
                delay: 3500,
                action: () => logService.addLog({
                    id: 'demo-5', severity: 'CRITICAL', eventID: '4625',
                    message: 'MULTIPLE FAILED LOGINS DETECTED (BRUTE FORCE).',
                    source: 'DC-01', user: 'admin', category: 'Security', timestamp: new Date().toISOString(), sourceIP: '45.132.89.11'
                })
            },
            {
                delay: 5000,
                action: () => logService.addLog({
                    id: 'demo-6', severity: 'CRITICAL', eventID: 'IDS-01',
                    message: 'SQL Injection blocked in /api/v1/login.',
                    source: 'IDS-01', user: 'N/A', category: 'Application', timestamp: new Date().toISOString(), sourceIP: '45.132.89.11'
                })
            },
            {
                delay: 6000,
                action: () => logService.addLog({
                    id: 'demo-7', severity: 'INFO', eventID: 'AI-RESP',
                    message: 'AI Analyst triggered for Incident #2991.',
                    source: 'AI-ENGINE', user: 'SYSTEM', category: 'System', timestamp: new Date().toISOString(), sourceIP: '10.0.0.50'
                })
            }
        ];

        for (const step of timeline) {
            await new Promise(r => setTimeout(r, step.delay));
            if (!this.isRunning) break;
            step.action();
        }

        this.isRunning = false;
    }

    stop() {
        this.isRunning = false;
    }
}

export const demoService = new DemoService();
