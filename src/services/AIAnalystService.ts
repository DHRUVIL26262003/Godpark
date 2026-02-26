import { type LogEntry } from './LogService';

export interface AnalysisResult {
    id: string;
    relatedLogId: string;
    summary: string;
    rootCause: string;
    remediationSteps: string[];
    confidenceScore: number;
    timestamp: string;
}

class AIAnalystService {
    async analyzeLog(log: LogEntry): Promise<AnalysisResult> {
        // Simulation Mode: Rule-Based Analysis
        await new Promise(resolve => setTimeout(resolve, 1500));

        let summary = '';
        let rootCause = '';
        let remediationSteps: string[] = [];

        if (log.category === 'Security' && log.eventID === '4625') {
            summary = `Multiple failed login attempts detected from ${log.sourceIP}.`;
            rootCause = 'Potential Brute Force Attack against User Account.';
            remediationSteps = [
                'Lock out affected user account temporarily.',
                'Block Source IP at Firewall.',
                'Reset User Password.',
                'Review MFA Logs.'
            ];
        } else if (log.eventID === 'IDS-01') {
            summary = `SQL Injection signature match in HTTP Request from ${log.sourceIP}.`;
            rootCause = 'Unsanitized input in legacy application module.';
            remediationSteps = [
                'Isolate web server instance.',
                'Apply WAF Virtual Patch rule #942100.',
                'Review application source code for query parameterization.',
            ];
        } else if (log.category === 'Firewall' && log.severity === 'WARN') {
            summary = `Port Scan detected from external IP ${log.sourceIP}.`;
            rootCause = 'Reconnaissance activity indicating potential targeted attack.';
            remediationSteps = [
                'Block subnet at perimeter firewall.',
                'Enable strict mode on IPS.',
            ];
        } else {
            summary = `Anomaly detected in system behavior: ${log.message}`;
            rootCause = 'Unknown deviation from baseline.';
            remediationSteps = ['Investigate manual logs.', 'Escalate to Tier 2 Analyst.'];
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            relatedLogId: log.id,
            summary,
            rootCause,
            remediationSteps,
            confidenceScore: 0.85 + (Math.random() * 0.14),
            timestamp: new Date().toISOString()
        };
    }
}

export const aiAnalystService = new AIAnalystService();
