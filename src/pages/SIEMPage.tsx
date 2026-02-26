import { useState, useEffect } from 'react';
import { logService, type LogEntry } from '@/services/LogService';
import { aiAnalystService, type AnalysisResult } from '@/services/AIAnalystService';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Shield, Terminal, Download, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SIEMPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('ALL');
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const initial = logService.getInitialLogs();
        setLogs(initial);
        logService.start();

        const unsubscribe = logService.subscribe((log) => {
            setLogs(prev => [log, ...prev].slice(0, 50)); // Reduced buffer for performance
        });

        return () => {
            unsubscribe();
            logService.stop();
        };
    }, []);

    const handleAnalyze = async (log: LogEntry) => {
        setSelectedLog(log);
        setIsAnalyzing(true);
        setAnalysis(null);
        try {
            const result = await aiAnalystService.analyzeLog(log);
            setAnalysis(result);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        (filter === '' || log.message.toLowerCase().includes(filter.toLowerCase()) || log.eventID.includes(filter)) &&
        (severityFilter === 'ALL' || log.severity === severityFilter)
    );

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Security Information & Event Management
                    </h1>
                    <p className="text-[#A7B1C6] font-mono text-sm mt-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        CENTRALIZED LOG AGGREGATION | RETENTION: 90 DAYS
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                        onClick={() => import('@/services/DemoService').then(({ demoService }) => demoService.startAttackScenario())}
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Run Attack Demo
                    </Button>
                    <Button variant="outline" className="border-white/10 text-[#A7B1C6]">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A7B1C6]" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Search Event ID, Message, Source..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <select
                    className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                >
                    <option value="ALL">All Severities</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="CRITICAL">CRITICAL</option>
                </select>
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-md px-4 justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-[#A7B1C6] font-mono">LIVE STREAMING</span>
                </div>
            </div>

            {/* Compliance Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0B1628] border border-white/10 rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-green-500/10 p-3 rounded-full">
                        <Shield className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <div className="text-xs text-[#A7B1C6] uppercase tracking-wider">NIST 800-53</div>
                        <div className="text-lg font-bold text-white">COMPLIANT</div>
                    </div>
                </div>
                <div className="bg-[#0B1628] border border-white/10 rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-blue-500/10 p-3 rounded-full">
                        <Terminal className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-xs text-[#A7B1C6] uppercase tracking-wider">Log Retention</div>
                        <div className="text-lg font-bold text-white">90 DAYS</div>
                    </div>
                </div>
                <div className="bg-[#0B1628] border border-white/10 rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-yellow-500/10 p-3 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-xs text-[#A7B1C6] uppercase tracking-wider">Active Threats</div>
                        <div className="text-lg font-bold text-white">0 CRITICAL</div>
                    </div>
                </div>
                <div className="bg-[#0B1628] border border-white/10 rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-purple-500/10 p-3 rounded-full">
                        <Filter className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-xs text-[#A7B1C6] uppercase tracking-wider">MITRE ATT&CK</div>
                        <div className="text-lg font-bold text-white">MAPPED</div>
                    </div>
                </div>
            </div>

            {/* Log Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border border-white/10 rounded-lg overflow-hidden bg-[#050B14]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-white/5 text-[#A7B1C6] uppercase border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3">Severity</th>
                                    <th className="px-4 py-3">Event ID</th>
                                    <th className="px-4 py-3">Message</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredLogs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`hover:bg-white/5 transition-colors ${selectedLog?.id === log.id ? 'bg-white/10 border-l-2 border-blue-500' : ''}`}
                                    >
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                                                log.severity === 'ERROR' ? 'bg-orange-500/20 text-orange-500' :
                                                    log.severity === 'WARN' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {log.severity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-white">{log.eventID}</td>
                                        <td className="px-4 py-2 text-white max-w-xs truncate">{log.message}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleAnalyze(log)}
                                                className="text-blue-400 hover:text-blue-300 underline"
                                            >
                                                Analyze
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Analyst Panel */}
                <div className="border border-white/10 rounded-lg bg-[#050B14] p-4 flex flex-col h-full">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">AI Security Analyst</h3>
                    </div>

                    {isAnalyzing ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <Activity className="w-8 h-8 text-purple-500 animate-spin" />
                            <p className="text-[#A7B1C6] animate-pulse text-xs font-mono">ANALYZING THREAT VECTORS...</p>
                        </div>
                    ) : analysis ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-white/5 p-3 rounded border border-white/10">
                                <span className="text-xs text-[#A7B1C6] uppercase block mb-1">Root Cause</span>
                                <p className="text-sm text-red-400 font-bold">{analysis.rootCause}</p>
                            </div>

                            <div>
                                <span className="text-xs text-[#A7B1C6] uppercase block mb-1">AI Recommendation</span>
                                <ul className="space-y-2">
                                    {analysis.remediationSteps.map((step, i) => (
                                        <li key={i} className="flex items-start text-sm text-white">
                                            <span className="text-green-500 mr-2">➜</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <span className="text-xs text-[#A7B1C6] uppercase">Confidence Score</span>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500"
                                            style={{ width: `${analysis.confidenceScore * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-purple-400 font-bold">
                                        {(analysis.confidenceScore * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                <Zap className="w-4 h-4 mr-2" />
                                Auto-Remediate
                            </Button>

                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <p className="text-[#A7B1C6] text-sm">Select a log entry to perform AI-driven root cause analysis and remediation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
