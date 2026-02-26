import { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecureInput } from '@/components/ui/SecureInput';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(loginData);
    setIsLoading(false);
    if (success) {
      onNavigate('account');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }
    setIsLoading(true);
    const success = await register({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
    });
    setIsLoading(false);
    if (success) {
      onNavigate('account');
    }
  };

  return (
    <main className="min-h-screen bg-[#050B14] flex items-center justify-center pt-16 pb-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <span className="text-2xl font-semibold text-white">Whitelines</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0B1628] rounded-2xl p-8 border border-white/5 card-shadow">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-[#050B14]">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-[#050B14]">
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="text-[#A7B1C6]">Email</Label>
                  <SecureInput
                    sourceName="Login Email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#A7B1C6]">Password</Label>
                  <div className="relative">
                    <SecureInput
                      sourceName="Login Password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white mt-1 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C6]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded bg-white/5 border-white/10" />
                    <span className="text-[#A7B1C6]">Remember me</span>
                  </label>
                  <button type="button" className="text-white hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-[#050B14] hover:bg-white/90 font-medium"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label className="text-[#A7B1C6]">Full Name</Label>
                  <SecureInput
                    sourceName="Register Name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#A7B1C6]">Email</Label>
                  <SecureInput
                    sourceName="Register Email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#A7B1C6]">Phone</Label>
                  <SecureInput
                    sourceName="Register Phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[#A7B1C6]">Password</Label>
                  <div className="relative">
                    <SecureInput
                      sourceName="Register Password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white mt-1 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C6]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-[#A7B1C6]">Confirm Password</Label>
                  <SecureInput
                    sourceName="Register Confirm Password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-[#050B14] hover:bg-white/90 font-medium"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button onClick={() => onNavigate('home')} className="text-sm text-[#A7B1C6] hover:text-white transition-colors">
            ← Back to home
          </button>
        </div>
      </div>
    </main>
  );
}
