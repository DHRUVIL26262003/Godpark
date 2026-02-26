import { Shield, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
    const { isSafeMode, toggleSafeMode } = useTheme();
    return (
        <footer className="border-t border-white/10 bg-[#050B14] text-[#A7B1C6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-white">
                            <Shield className="h-6 w-6" />
                            <span className="text-xl font-bold">Whitelines</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Advanced security solutions for the modern digital era. Protecting your infrastructure with AI-driven intelligence.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-[#A7B1C6] hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-[#A7B1C6] hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
                            <a href="#" className="text-[#A7B1C6] hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Solutions</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Threat Detection</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Network Security</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cloud Protection</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Zero Trust</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
                        <p className="text-sm mb-4">Subscribe to our security briefings.</p>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 flex-1"
                            />
                            <Button size="icon" className="bg-white text-black hover:bg-white/90">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Whitelines Security. All rights reserved.</p>

                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-[#A7B1C6]">Safe Mode</span>
                            <button
                                onClick={toggleSafeMode}
                                className={`w-10 h-5 rounded-full transition-colors relative ${isSafeMode ? 'bg-white' : 'bg-white/10'}`}
                            >
                                <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${isSafeMode ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex space-x-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
