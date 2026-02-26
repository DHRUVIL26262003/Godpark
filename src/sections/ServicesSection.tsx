import { Shield, User, AlertTriangle, ArrowRight } from 'lucide-react';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

const services = [
  {
    id: 'serv-1',
    icon: Shield,
    title: 'Small Business Security Audit',
    description: 'Network review, firewall check, and a prioritized action plan.',
    price: 299,
  },
  {
    id: 'serv-2',
    icon: User,
    title: 'Personal Data Protection Setup',
    description: 'Secure your devices, passwords, and cloud accounts.',
    price: 149,
  },
  {
    id: 'serv-3',
    icon: AlertTriangle,
    title: 'Incident Response Consultation',
    description: 'Fast guidance when something goes wrong.',
    price: 499,
  },
];

interface ServicesSectionProps {
  onNavigate?: (page: Page) => void;
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  return (
    <section className="relative py-24 lg:py-32 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Security Services
          </h2>
          <p className="text-lg text-[#A7B1C6] max-w-2xl">
            From setup to incident response—expert help when you need it.
          </p>
          <div className="h-[2px] w-24 bg-white mt-6" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => onNavigate?.('services')}
                className="group bg-[#0B1628] rounded-2xl p-8 border border-white/5 card-shadow cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-[#A7B1C6] mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    ${service.price}
                  </span>
                  <span className="flex items-center text-sm text-[#A7B1C6] group-hover:text-white transition-colors">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
