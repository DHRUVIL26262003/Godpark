import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 9,
    yearlyPrice: 7,
    description: 'Core protection + support',
    features: [
      'Basic threat monitoring',
      'Email support',
      'Monthly security reports',
      'Up to 5 team members',
    ],
    highlighted: false,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: 'Advanced policies + reporting',
    features: [
      'Advanced threat detection',
      'Priority support',
      'Weekly security reports',
      'Up to 25 team members',
      'Custom security policies',
      'API access',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Dedicated support + onboarding',
    features: [
      'Enterprise-grade security',
      '24/7 dedicated support',
      'Real-time monitoring',
      'Unlimited team members',
      'Custom integrations',
      'On-site consultation',
    ],
    highlighted: false,
  },
];

interface PricingSectionProps {
  onNavigate: (page: Page) => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative py-24 lg:py-32 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple pricing
          </h2>
          <p className="text-lg text-[#A7B1C6] max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business needs.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-[#A7B1C6]'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-white"
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-[#A7B1C6]'}`}>
              Yearly
              <span className="ml-2 text-xs text-green-400">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-[#0B1628] border-2 border-white'
                  : 'bg-[#0B1628] border border-white/5'
              } card-shadow`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center space-x-1 bg-white text-[#050B14] text-xs font-medium px-3 py-1 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-[#A7B1C6]">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.monthlyPrice ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-[#A7B1C6] ml-2">/user/month</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">Custom</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-[#A7B1C6] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onNavigate('contact')}
                className={`w-full ${
                  plan.highlighted
                    ? 'bg-white text-[#050B14] hover:bg-white/90'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.monthlyPrice ? 'Get Started' : 'Contact Sales'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
