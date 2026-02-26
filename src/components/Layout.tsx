import type { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { Chatbot } from '@/components/Chatbot';
import { ThreatTicker } from '@/components/ui/ThreatTicker';
import { SecurityHUD } from '@/components/ui/SecurityHUD';
import { Toaster } from 'sonner';

import { Footer } from '@/components/Footer';

interface LayoutProps {
    children: ReactNode;
    currentPage: string;
    onNavigate: (page: any) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#050B14] pb-10 flex flex-col">
            <Navigation onNavigate={onNavigate} currentPage={currentPage as any} />

            <main className="flex-grow">
                {children}
            </main>

            <Footer />

            <ThreatTicker />
            <SecurityHUD />
            <CartDrawer onNavigate={onNavigate} />
            <Chatbot />

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0B1628',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            />
        </div>
    );
}
