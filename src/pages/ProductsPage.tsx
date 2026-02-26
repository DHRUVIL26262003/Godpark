import { useState } from 'react';
import { ShoppingCart, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/database';
import { toast } from 'sonner';

export function ProductsPage() {
  const products = db.getProducts();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<'all' | 'physical' | 'digital'>('all');

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.type === filter);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      itemId: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Products
          </h1>
          <p className="text-lg text-[#A7B1C6] max-w-2xl">
            Enterprise-grade security hardware and digital resources for your business.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <Filter className="h-5 w-5 text-[#A7B1C6]" />
          <div className="flex space-x-2">
            {(['all', 'physical', 'digital'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-white text-[#050B14]'
                    : 'bg-white/5 text-[#A7B1C6] hover:bg-white/10 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#0B1628] rounded-2xl overflow-hidden border border-white/5 card-shadow group"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.type === 'physical'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {product.type === 'physical' ? 'Physical' : 'Digital'}
                  </span>
                  {product.type === 'physical' && product.stockQuantity > 0 && (
                    <span className="text-xs text-[#A7B1C6]">
                      {product.stockQuantity} in stock
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h2>
                <p className="text-[#A7B1C6] text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.specs.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 text-xs text-[#A7B1C6] bg-white/5 px-2 py-1 rounded"
                    >
                      <Check className="h-3 w-3" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-2xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.type === 'physical' && product.stockQuantity === 0}
                    className="bg-white text-[#050B14] hover:bg-white/90"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.type === 'physical' && product.stockQuantity === 0 
                      ? 'Out of Stock' 
                      : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
