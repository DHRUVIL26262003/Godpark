// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  type: 'physical' | 'digital';
  stockQuantity: number;
  image: string;
  specs: string[];
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  features: string[];
  duration?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  itemId: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  image?: string;
  bookingDetails?: BookingDetails;
}

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  notes?: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: Date;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: Date;
  shippingAddress?: Address;
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemType: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  bookingDetails?: BookingDetails;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
