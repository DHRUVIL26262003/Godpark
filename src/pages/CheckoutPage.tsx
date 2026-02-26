import { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/database';
import { toast } from 'sonner';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const orderItems = items.map(item => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.itemId,
      itemType: item.type,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      bookingDetails: item.bookingDetails,
    }));

    // Update inventory for physical products
    items.forEach(item => {
      if (item.type === 'product') {
        db.updateProductStock(item.itemId, item.quantity);
      }
    });

    // Create order record
    db.createOrder({
      customerId: user?.id || 'guest',
      items: orderItems,
      totalPrice: getTotalPrice(),
      status: 'completed',
      shippingAddress: {
        street: shippingData.street,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: shippingData.country,
      },
    });

    setIsProcessing(false);
    setStep('confirmation');
    clearCart();
    toast.success('Order completed successfully!');
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#0B1628] rounded-2xl p-12 border border-white/5">
            <Check className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-[#A7B1C6] mb-8">Add some products or services to get started.</p>
            <Button onClick={() => onNavigate('products')} className="bg-white text-[#050B14]">
              Browse Products
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center text-[#A7B1C6] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to cart
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="bg-[#0B1628] rounded-2xl p-8 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#A7B1C6]">Full Name</Label>
                      <Input
                        value={shippingData.name}
                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#A7B1C6]">Email</Label>
                      <Input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#A7B1C6]">Street Address</Label>
                    <Input
                      value={shippingData.street}
                      onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#A7B1C6]">City</Label>
                      <Input
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#A7B1C6]">State</Label>
                      <Input
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#A7B1C6]">ZIP Code</Label>
                      <Input
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-[#050B14] hover:bg-white/90 mt-4"
                  >
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-[#0B1628] rounded-2xl p-8 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <Label className="text-[#A7B1C6]">Card Number</Label>
                    <div className="relative">
                      <Input
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="bg-white/5 border-white/10 text-white mt-1 pr-10"
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A7B1C6]" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#A7B1C6]">Cardholder Name</Label>
                    <Input
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#A7B1C6]">Expiry Date</Label>
                      <Input
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#A7B1C6]">CVV</Label>
                      <Input
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="123"
                        className="bg-white/5 border-white/10 text-white mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      className="flex-1 border-white/20 text-white hover:bg-white/5"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-white text-[#050B14] hover:bg-white/90"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Order'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="bg-[#0B1628] rounded-2xl p-8 border border-white/5 text-center">
                <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Order Confirmed!</h2>
                <p className="text-[#A7B1C6] mb-8">
                  Thank you for your purchase. You'll receive a confirmation email shortly.
                </p>
                <Button onClick={() => onNavigate('home')} className="bg-white text-[#050B14]">
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-white">{item.name}</p>
                      <p className="text-[#A7B1C6]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A7B1C6]">Subtotal</span>
                  <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A7B1C6]">Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-[#A7B1C6]">
                <Truck className="h-4 w-4" />
                <span>Free shipping on all orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
