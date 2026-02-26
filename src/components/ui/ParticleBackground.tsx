import { useEffect, useRef } from 'react';

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            speed: number;
            char: string;
            color: string;
            fontSize: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.speed = Math.random() * 2 + 1;
                this.char = String.fromCharCode(0x30A0 + Math.random() * 96); // Katakana
                this.color = `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.1})`;
                this.fontSize = Math.floor(Math.random() * 14) + 10;
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas!.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas!.width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize}px monospace`;
                ctx.fillText(this.char, this.x, this.y);
            }
        }

        const initParticles = () => {
            particles = [];
            const numberOfParticles = Math.floor(window.innerWidth / 20); // Density based on width
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a subtle overlay to create trails (optional)
            // ctx.fillStyle = 'rgba(5, 11, 20, 0.1)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();

                // Randomly change character
                if (Math.random() > 0.95) {
                    particle.char = String.fromCharCode(0x30A0 + Math.random() * 96);
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-30"
            style={{ background: 'transparent' }}
        />
    );
}
