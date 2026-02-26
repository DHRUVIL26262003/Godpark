import { useState } from 'react';
import { Calendar, Clock, Check, ArrowRight, Shield, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/database';
import { toast } from 'sonner';
import type { BookingDetails, Service } from '@/types';

export function ServicesPage() {
  const services = db.getServices();
  const { addToCart } = useCart();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    notes: '',
  });

  const handleBookService = () => {
    if (!selectedService) return;

    if (!bookingData.name || !bookingData.email || !bookingData.preferredDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addToCart({
      itemId: selectedService.id,
      type: 'service',
      name: selectedService.name,
      price: selectedService.price,
      quantity: 1,
      bookingDetails: bookingData as BookingDetails,
    });

    toast.success(`${selectedService.name} added to cart`);
    setSelectedService(null);
  };

  return (
    <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Security Services
          </h1>
          <p className="text-lg text-[#A7B1C6] max-w-2xl">
            Professional security services tailored to your business needs. Book a consultation or service appointment.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.id === 'serv-1' ? Shield : service.id === 'serv-2' ? User : AlertTriangle;
            return (
              <div
                key={service.id}
                className="bg-[#0B1628] rounded-2xl p-8 border border-white/5 card-shadow"
              >
                <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h2 className="text-2xl font-semibold text-white mb-3">
                  {service.name}
                </h2>
                <p className="text-[#A7B1C6] mb-6 leading-relaxed">
                  {service.fullDescription}
                </p>

                <div className="flex items-center space-x-4 mb-6 text-sm text-[#A7B1C6]">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </span>
                </div>

                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#A7B1C6]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-3xl font-bold text-white">
                    ${service.price}
                  </span>
                  <Button
                    onClick={() => setSelectedService(service)}
                    className="bg-white text-[#050B14] hover:bg-white/90"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-[#0B1628] rounded-2xl p-8 border border-white/5">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-[#A7B1C6]">Book appointments that fit your calendar</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Certified Experts</h3>
              <p className="text-sm text-[#A7B1C6]">Work with industry-certified security professionals</p>
            </div>
            <div className="text-center">
              <Check className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-[#A7B1C6]">Full refund if not satisfied with our service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="bg-[#0B1628] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Book {selectedService?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-[#A7B1C6]">Full Name *</Label>
              <Input
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                placeholder="John Doe"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-[#A7B1C6]">Email *</Label>
              <Input
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                placeholder="john@company.com"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-[#A7B1C6]">Phone</Label>
              <Input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-[#A7B1C6]">Preferred Date *</Label>
              <Input
                type="date"
                value={bookingData.preferredDate}
                onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label className="text-[#A7B1C6]">Additional Notes</Label>
              <Input
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                placeholder="Any specific requirements..."
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#A7B1C6]">Service Price</span>
                <span className="text-xl font-bold text-white">
                  ${selectedService?.price}
                </span>
              </div>
              <Button
                onClick={handleBookService}
                className="w-full bg-white text-[#050B14] hover:bg-white/90"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
