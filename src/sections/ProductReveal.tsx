import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface ProductRevealProps {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  image: string;
  specs: string[];
  layout: 'left-image' | 'right-image';
  onNavigate: (page: Page) => void;
}

export function ProductReveal({
  id,
  name,
  fullDescription,
  price,
  image,
  specs,
  layout,
  onNavigate,
}: ProductRevealProps) {
  const { addToCart } = useCart();
  const isLeftImage = layout === 'left-image';

  const handleAddToCart = () => {
    addToCart({
      itemId: id,
      type: 'product',
      name,
      price,
      quantity: 1,
      image,
    });
    toast.success(`${name} added to cart`);
  };

  return (
    <section className="relative min-h-[80vh] w-full bg-[#050B14] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[80vh]">
        {/* Image Panel */}
        <div className={`relative h-[50vh] lg:h-auto ${isLeftImage ? 'lg:order-1' : 'lg:order-2'}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/60 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Content Panel */}
        <div className={`relative bg-[#0B1628] flex items-center ${isLeftImage ? 'lg:order-2' : 'lg:order-1'}`}>
          {/* Divider Line */}
          <div className={`hidden lg:block absolute top-0 w-[2px] h-full bg-white ${isLeftImage ? 'left-0' : 'right-0'}`} />

          <div className="px-8 py-16 lg:px-16 lg:py-24 max-w-xl">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {name}
              </h2>

              <p className="text-[#A7B1C6] text-lg leading-relaxed">
                {fullDescription}
              </p>

              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-white">${price.toFixed(2)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {specs.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 text-sm text-[#A7B1C6] bg-white/5 px-3 py-1.5 rounded-full"
                  >
                    <Check className="h-3 w-3 text-white" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="bg-white text-[#050B14] hover:bg-white/90 font-medium"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => onNavigate('products')}
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
