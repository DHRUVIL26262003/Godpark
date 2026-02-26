import type { Product, Service, Customer, Order, User } from '@/types';

// In-memory database simulation
class Database {
  private customers: Customer[] = [];
  private orders: Order[] = [];
  private currentUser: User | null = null;

  // Products data
  private products: Product[] = [
    {
      id: 'prod-1',
      name: 'Secure USB Kit',
      description: 'Hardware-encrypted USB storage with automatic lockout',
      fullDescription: 'Carry sensitive files with hardware-encrypted storage and automatic lockout. Setup takes under a minute. Includes encrypted USB drive preloaded with secure file vault software, designed for safe document transport.',
      price: 49.99,
      type: 'physical',
      stockQuantity: 150,
      image: '/product_usb.jpg',
      specs: ['Encrypted', 'USB-C', 'macOS/Windows']
    },
    {
      id: 'prod-2',
      name: 'Encrypted External Drive',
      description: '1TB hardware-encrypted drive with AES-256 encryption',
      fullDescription: 'Backup entire projects with AES-256 hardware encryption and rapid USB-C speeds. Built for daily use. Designed for businesses that need reliable, secure data storage.',
      price: 129.99,
      type: 'physical',
      stockQuantity: 75,
      image: '/product_drive.jpg',
      specs: ['1TB', 'AES-256', 'USB-C']
    },
    {
      id: 'prod-3',
      name: 'Cybersecurity Starter Course',
      description: 'Beginner-friendly cybersecurity fundamentals course',
      fullDescription: 'A practical guide to passwords, phishing, and device hygiene—designed for teams without an IT department. PDF + Video bundle with instant digital delivery.',
      price: 79.99,
      type: 'digital',
      stockQuantity: -1, // Unlimited for digital
      image: '/product_course.jpg',
      specs: ['PDF + Video', 'Instant delivery']
    }
  ];

  // Services data
  private services: Service[] = [
    {
      id: 'serv-1',
      name: 'Small Business Security Audit',
      description: 'Comprehensive network vulnerability assessment',
      fullDescription: 'Network vulnerability assessment, basic firewall review, and security improvement report. Our experts will analyze your infrastructure and provide actionable recommendations.',
      price: 299,
      features: ['Network vulnerability assessment', 'Basic firewall review', 'Security improvement report', '2-hour on-site visit'],
      duration: '2-3 hours'
    },
    {
      id: 'serv-2',
      name: 'Personal Data Protection Setup',
      description: 'Secure device configuration and password manager setup',
      fullDescription: 'Secure device configuration, password manager setup, and encryption setup guidance. We help you establish a strong security foundation for all your personal devices.',
      price: 149,
      features: ['Secure device configuration', 'Password manager setup', 'Encryption setup guidance', '1-hour remote session'],
      duration: '1 hour'
    },
    {
      id: 'serv-3',
      name: 'Incident Response Consultation',
      description: 'Emergency consultation for security incidents',
      fullDescription: '1-hour emergency consultation with malware response strategy and risk mitigation plan. Available 24/7 for critical security incidents.',
      price: 499,
      features: ['1-hour emergency consultation', 'Malware response strategy', 'Risk mitigation plan', '24/7 availability'],
      duration: '1 hour'
    }
  ];

  // Product methods
  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  updateProductStock(id: string, quantity: number): boolean {
    const product = this.products.find(p => p.id === id);
    if (product && product.type === 'physical') {
      product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
      return true;
    }
    return false;
  }

  // Service methods
  getServices(): Service[] {
    return [...this.services];
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  // Customer methods
  createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      createdAt: new Date()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  getCustomerByEmail(email: string): Customer | undefined {
    return this.customers.find(c => c.email === email);
  }

  validateCustomer(email: string, password: string): Customer | null {
    const customer = this.customers.find(c => c.email === email);
    if (customer && customer.passwordHash === this.hashPassword(password)) {
      return customer;
    }
    return null;
  }

  // Order methods
  createOrder(orderData: Omit<Order, 'id' | 'orderDate'>): Order {
    const order: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderDate: new Date()
    };
    this.orders.push(order);
    return order;
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.orders.filter(o => o.customerId === customerId);
  }

  // Auth methods
  login(email: string, password: string): User | null {
    const customer = this.validateCustomer(email, password);
    if (customer) {
      this.currentUser = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      };
      return this.currentUser;
    }
    return null;
  }

  register(data: { name: string; email: string; phone: string; password: string }): User | null {
    if (this.getCustomerByEmail(data.email)) {
      return null; // Email already exists
    }
    const customer = this.createCustomer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: this.hashPassword(data.password)
    });
    this.currentUser = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Utility
  private hashPassword(password: string): string {
    // Simple hash simulation (in production, use bcrypt)
    return btoa(password + 'salt');
  }
}

// Singleton instance
export const db = new Database();
