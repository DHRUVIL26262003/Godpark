import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Whitelines made it easy to secure our client files without slowing anyone down.",
    author: 'Alex R.',
    role: 'Operations Lead',
    avatar: 'AR',
  },
  {
    id: 2,
    quote: "The audit gave us a clear plan we actually followed. Highly recommended for any small business.",
    author: 'Priya M.',
    role: 'Studio Founder',
    avatar: 'PM',
  },
  {
    id: 3,
    quote: "Setup was hands-on, fast, and jargon-free. Finally, security that makes sense.",
    author: 'Jordan T.',
    role: 'Creative Director',
    avatar: 'JT',
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Trusted by teams
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#0B1628] rounded-2xl p-8 border border-white/5 card-shadow"
            >
              <Quote className="h-8 w-8 text-white/20 mb-6" />
              <p className="text-[#A7B1C6] text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-sm text-[#A7B1C6]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
