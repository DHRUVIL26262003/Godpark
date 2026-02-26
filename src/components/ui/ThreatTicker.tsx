import { useEffect, useState } from 'react';
import { ShieldAlert, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { threatSimulation, type Threat } from '@/services/ThreatSimulationService';

export function ThreatTicker() {
    const [threats, setThreats] = useState<Threat[]>([]);

    useEffect(() => {
        threatSimulation.start();
        const unsubscribe = threatSimulation.subscribe((newThreat) => {
            setThreats(prev => [newThreat, ...prev].slice(0, 10)); // Keep last 10
        });

        return () => {
            unsubscribe();
            threatSimulation.stop();
        };
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B1628]/95 backdrop-blur-md border-t border-white/10 h-10 flex items-center shadow-lg shadow-black/50">
            <div className="bg-red-500/10 px-4 h-full flex items-center border-r border-white/10 min-w-fit">
                <span className="flex items-center text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                    <ShieldAlert className="w-3 h-3 mr-2" />
                    Live Threat Feed
                </span>
            </div>

            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <AnimatePresence mode="popLayout">
                    {threats.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-4 text-xs text-[#A7B1C6] flex items-center"
                        >
                            <Activity className="w-3 h-3 mr-2 animate-spin" />
                            Establishing secure connection to global threat grid...
                        </motion.div>
                    ) : (
                        <div className="flex items-center space-x-8 px-4 w-full">
                            {threats.map((threat) => (
                                <motion.div
                                    key={threat.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center space-x-2 text-xs min-w-fit"
                                >
                                    <Globe className="w-3 h-3 text-[#A7B1C6]/50" />
                                    <span className="font-mono text-white/50">{threat.origin}</span>
                                    <span className="text-[#A7B1C6]">→</span>
                                    <span className={`font-bold ${threat.severity === 'critical' ? 'text-red-500' :
                                            threat.severity === 'high' ? 'text-orange-500' :
                                                threat.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                        }`}>
                                        {threat.type.toUpperCase()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-[#0B1628] px-4 h-full flex items-center border-l border-white/10 z-10 hidden sm:flex">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-[#A7B1C6] font-mono">SYSTEM ONLINE</span>
                </div>
            </div>
        </div>
    );
}
