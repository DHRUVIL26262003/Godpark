

import { HeroSection } from '@/sections/HeroSection';
import { ProductReveal } from '@/sections/ProductReveal';
import { ServicesSection } from '@/sections/ServicesSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { PricingSection } from '@/sections/PricingSection';
import { CTASection } from '@/sections/CTASection';
import { db } from '@/lib/database';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const products = db.getProducts();

  return (
    <main className="bg-[#050B14]">
      <HeroSection onNavigate={onNavigate} />



      {/* Product 1 - Secure USB Kit */}
      <ProductReveal
        id={products[0].id}
        name={products[0].name}
        description={products[0].description}
        fullDescription={products[0].fullDescription}
        price={products[0].price}
        image={products[0].image}
        specs={products[0].specs}
        layout="left-image"
        onNavigate={onNavigate}
      />

      {/* Product 2 - Encrypted External Drive */}
      <ProductReveal
        id={products[1].id}
        name={products[1].name}
        description={products[1].description}
        fullDescription={products[1].fullDescription}
        price={products[1].price}
        image={products[1].image}
        specs={products[1].specs}
        layout="right-image"
        onNavigate={onNavigate}
      />

      {/* Product 3 - Cybersecurity Course */}
      <ProductReveal
        id={products[2].id}
        name={products[2].name}
        description={products[2].description}
        fullDescription={products[2].fullDescription}
        price={products[2].price}
        image={products[2].image}
        specs={products[2].specs}
        layout="left-image"
        onNavigate={onNavigate}
      />

      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection onNavigate={onNavigate} />
      <CTASection onNavigate={onNavigate} />
    </main>
  );
}
