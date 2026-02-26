import { useState, useEffect } from 'react';
import { useSecurity } from '@/contexts/SecurityContext';
import { Terminal, ChevronUp, ChevronDown, Activity, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ThreatLevel } from '@/contexts/SecurityContext';
import { motion, AnimatePresence } from 'framer-motion';

export function SecurityHUD() {
    const { logs, threatLevel } = useSecurity();
    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Flash alert when threat level changes to HIGH
    useEffect(() => {
        if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [threatLevel]);

    const getThreatColor = (level: ThreatLevel) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-500 border-red-500 bg-red-500/10';
            case 'HIGH': return 'text-orange-500 border-orange-500 bg-orange-500/10';
            case 'MEDIUM': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
            default: return 'text-green-500 border-green-500 bg-green-500/10';
        }
    };

    return (
        <>
            {/* Critical Alert Overlay */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-500 p-8 rounded-xl flex flex-col items-center animate-pulse">
                            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                            <h2 className="text-3xl font-bold text-red-500 uppercase tracking-widest">Security Breach Detected</h2>
                            <p className="text-red-400 mt-2 font-mono">Active Defense Systems Engaged</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mini Status Indicator (Always Visible) */}
            <motion.div
                className="fixed bottom-20 left-6 z-50 flex flex-col gap-2"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all ${isOpen ? 'bg-[#0B1628]/90 border-white/20' : getThreatColor(threatLevel)
                        } hover:scale-105`}
                >
                    {threatLevel === 'LOW' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    <span className="font-mono text-xs font-bold">
                        SEC_LEVEL: {threatLevel}
                    </span>
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
            </motion.div>

            {/* Expanded Console */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-32 left-6 z-50 w-80 md:w-96 bg-[#050B14]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden font-mono text-xs"
                    >
                        {/* Console Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                            <div className="flex items-center space-x-2 text-[#A7B1C6]">
                                <Terminal className="w-3 h-3" />
                                <span>Security Logs</span>
                            </div>
                            <Activity className={`w-3 h-3 ${threatLevel === 'LOW' ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
                        </div>

                        {/* Console Body */}
                        <div className="h-64 overflow-y-auto p-4 space-y-2 bg-black/50">
                            {logs.length === 0 ? (
                                <div className="text-center text-white/30 py-8 italic">
                                    No threat activity detected.
                                    <br />System nominal.
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-white/10 pl-2 py-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`font-bold ${log.severity === 'HIGH' || log.severity === 'CRITICAL' ? 'text-red-400' : 'text-blue-400'
                                                }`}>
                                                [{log.type}]
                                            </span>
                                            <span className="text-white/30 text-[10px]">
                                                {log.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-[#A7B1C6]">{log.details}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="bg-white/10 px-1 rounded text-white/50">src: {log.source}</span>
                                            {log.blocked && (
                                                <span className="text-red-500 bg-red-500/10 px-1 rounded font-bold">BLOCKED</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
