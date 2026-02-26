import type { LogEntry } from './LogService';

const API_KEY = import.meta.env.VITE_LLM_API_KEY || '';
const ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT || 'http://localhost:11434/v1';
const MODEL = import.meta.env.VITE_LLM_MODEL || 'llama3';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMConfig {
    apiKey: string;
    endpoint: string;
    model: string;
}

export class LLMService {
    private async callLLM(messages: ChatMessage[], jsonMode: boolean = false, config?: LLMConfig): Promise<string> {
        const apiKey = config?.apiKey || API_KEY;
        const endpoint = config?.endpoint || ENDPOINT;
        const model = config?.model || MODEL;

        try {
            const response = await fetch(`${endpoint}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.7,
                    response_format: jsonMode ? { type: "json_object" } : undefined
                })
            });

            if (!response.ok) {
                throw new Error(`LLM API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error("LLM Service Failed:", error);
            throw error;
        }
    }

    async chat(history: ChatMessage[], systemContext: string = '', config?: LLMConfig): Promise<string> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `You are the Whitelines AI Security Assistant. 
                Your goal is to help users with cybersecurity questions, product info, and platform navigation.
                
                CONTEXT:
                ${systemContext}
                
                Be professional, concise, and helpful. If you don't know something, advise contacting support.
                Do not facilitate malicious activity.`
            },
            ...history
        ];

        return this.callLLM(messages, false, config);
    }

    async analyzeSecurityLog(log: LogEntry, config?: LLMConfig): Promise<any> {
        const prompt = `
        Analyze the following security log event and provide a structured JSON response.
        
        LOG DETAILS:
        - Event ID: ${log.eventID}
        - Severity: ${log.severity}
        - Message: ${log.message}
        - Source: ${log.source}
        - Category: ${log.category}

        You must return valid JSON with these fields:
        {
            "summary": "Brief explanation of what happened",
            "rootCause": "The likely technical cause (e.g., Brute Force, Misconfiguration)",
            "remediationSteps": ["Step 1", "Step 2", "Step 3"],
            "confidenceScore": 0.95 (number between 0 and 1)
        }
        `;

        const messages: ChatMessage[] = [
            { role: 'system', content: "You are a Tier 3 Security Analyst AI. You output strict JSON only." },
            { role: 'user', content: prompt }
        ];

        try {
            const jsonStr = await this.callLLM(messages, true, config);
            return JSON.parse(jsonStr);
        } catch (error) {
            throw error;
        }
    }
}

export const llmService = new LLMService();
