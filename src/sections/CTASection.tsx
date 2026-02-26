import { useState } from 'react';
import { ArrowRight, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface CTASectionProps {
  onNavigate: (page: Page) => void;
}

export function CTASection({ onNavigate }: CTASectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section className="relative py-24 lg:py-32 bg-[#0B1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Content */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to secure your business?
          </h2>
          <p className="text-lg text-[#A7B1C6] max-w-2xl mx-auto mb-8">
            Get a quote in minutes. No commitment required.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onNavigate('contact')}
              size="lg"
              className="bg-white text-[#050B14] hover:bg-white/90 font-medium px-8"
            >
              Get a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href="mailto:support@whitelines.security">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 font-medium px-8"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-[#050B14] rounded-2xl p-8 border border-white/5 card-shadow mb-16"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-[#A7B1C6] mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#A7B1C6]/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#A7B1C6] mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#A7B1C6]/50"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-[#A7B1C6] mb-2">Company</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company name"
              className="bg-white/5 border-white/10 text-white placeholder:text-[#A7B1C6]/50"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-[#A7B1C6] mb-2">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your security needs..."
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-[#A7B1C6]/50 resize-none"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white text-[#050B14] hover:bg-white/90 font-medium"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <button onClick={() => onNavigate('home')} className="text-sm text-[#A7B1C6] hover:text-white transition-colors">
                Privacy
              </button>
              <button onClick={() => onNavigate('home')} className="text-sm text-[#A7B1C6] hover:text-white transition-colors">
                Terms
              </button>
              <button onClick={() => onNavigate('home')} className="text-sm text-[#A7B1C6] hover:text-white transition-colors">
                Security
              </button>
            </div>
            <p className="text-sm text-[#A7B1C6]">
              © {new Date().getFullYear()} Whitelines Security Solutions
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
