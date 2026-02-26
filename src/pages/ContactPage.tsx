import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecureInput } from '@/components/ui/SecureInput';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSecurity } from '@/contexts/SecurityContext';

export function ContactPage() {
  const { detectThreat } = useSecurity();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extra security check before submission
    if (detectThreat(formData.message, 'Contact Message Body')) {
      return;
    }

    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[#A7B1C6] max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our team for support, sales inquiries, or general questions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-[#A7B1C6] text-sm mb-2">For general inquiries:</p>
              <a href="mailto:support@whitelines.security" className="text-white hover:underline">
                support@whitelines.security
              </a>
            </div>

            <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-[#A7B1C6] text-sm mb-2">Mon-Fri, 9am-6pm EST:</p>
              <a href="tel:1-800-WHITE-SEC" className="text-white hover:underline">
                1-800-WHITE-SEC
              </a>
            </div>

            <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Office</h3>
              <p className="text-[#A7B1C6] text-sm">
                100 Security Plaza<br />
                Suite 500<br />
                New York, NY 10001
              </p>
            </div>

            <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Hours</h3>
              <p className="text-[#A7B1C6] text-sm">
                Monday - Friday: 9am - 6pm EST<br />
                Emergency Response: 24/7
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-[#0B1628] rounded-2xl p-8 border border-white/5"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-[#A7B1C6]">Name</Label>
                  <SecureInput
                    sourceName="Contact Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#A7B1C6]">Email</Label>
                  <SecureInput
                    sourceName="Contact Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-[#A7B1C6]">Subject</Label>
                <SecureInput
                  sourceName="Contact Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="bg-white/5 border-white/10 text-white mt-1"
                  required
                />
              </div>

              <div className="mb-6">
                <Label className="text-[#A7B1C6]">Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    // Real-time check for message body as well
                    detectThreat(e.target.value, 'Contact Message Body');
                  }}
                  placeholder="Tell us more about your security needs..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white mt-1 resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-white text-[#050B14] hover:bg-white/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
