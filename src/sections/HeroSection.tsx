import { useEffect, useRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const scanLineRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    // Simple CSS animation for scan line
    if (scanLineRef.current) {
      scanLineRef.current.style.animation = 'scanLine 1.1s ease-out forwards';
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-[#050B14] overflow-hidden flex items-center">
      <ParticleBackground />

      {/* Scan Line */}
      <div
        ref={scanLineRef}
        className="absolute left-1/2 top-0 w-[2px] h-full bg-white/90 z-10"
        style={{ transform: 'translateX(-50%) scaleY(0)', transformOrigin: 'top' }}
      >
        <div className="absolute inset-0 w-[10px] -left-[4px] bg-white/10 blur-sm" />
      </div>

      {/* Content Grid */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <span className="mono inline-block text-xs font-medium tracking-[0.08em] text-[#A7B1C6] uppercase">
              Whitelines Security
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[0.98]">
              Enterprise-Grade Security
            </h1>

            <p className="text-lg sm:text-xl text-[#A7B1C6] max-w-xl leading-relaxed">
              Protect your business with the same tools trusted by teams worldwide—made simple.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate('products')}
                size="lg"
                className="bg-white text-[#050B14] hover:bg-white/90 font-medium px-8 py-6 text-base btn-shadow"
              >
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => onNavigate('contact')}
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 font-medium px-8 py-6 text-base"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Right Image with 3D Tilt */}
          <motion.div
            className="relative hidden lg:block animate-fade-in-up"
            style={{
              animationDelay: '0.3s',
              perspective: 1000
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden card-shadow bg-[#0B1628]"
            >
              <img
                src="/hero_workspace.jpg"
                alt="Secure workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/40 to-transparent pointer-events-none" />

              {/* Floating Stats Card - Inside Tilt */}
              <div
                className="absolute -bottom-6 -left-6 bg-[#0B1628]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 card-shadow"
                style={{ transform: "translateZ(50px)" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-xs text-[#A7B1C6]">Uptime Guaranteed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Gradient (Subtle Overlay) */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#050B14]/80 to-[#050B14] pointer-events-none" />
    </section>
  );
}
