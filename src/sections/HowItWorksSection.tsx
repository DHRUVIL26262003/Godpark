import { ShoppingCart, Calendar, Shield } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ShoppingCart,
    title: 'Choose a product or service',
    description: 'Browse our catalog of security products and professional services.',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Schedule or checkout',
    description: 'Book a service appointment or purchase products instantly.',
  },
  {
    number: '03',
    icon: Shield,
    title: 'Get protected—fast',
    description: 'Receive your products or start your service within 24 hours.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[#A7B1C6] max-w-2xl mx-auto">
            Getting started with Whitelines is simple and straightforward.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[16.67%] right-[16.67%] h-[2px] bg-white/20" />

          <div className="grid md:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  {/* Number Circle */}
                  <div className="relative z-10 mx-auto mb-6">
                    <div className="h-20 w-20 bg-[#0B1628] border-2 border-white rounded-full flex items-center justify-center mx-auto">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="mono absolute -top-2 -right-2 h-8 w-8 bg-white text-[#050B14] rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#A7B1C6] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
