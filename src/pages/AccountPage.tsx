import { useEffect, useState } from 'react';
import { User, Package, Calendar, LogOut, ChevronRight, Shield, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/database';
import type { Order } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

type Page = 'home' | 'products' | 'services' | 'login' | 'checkout' | 'contact' | 'account' | 'pricing';

interface AccountPageProps {
  onNavigate: (page: Page) => void;
}

// Mock Data for Charts
const LOGIN_ACTIVITY_DATA = [
  { day: 'Mon', logins: 4 },
  { day: 'Tue', logins: 2 },
  { day: 'Wed', logins: 7 },
  { day: 'Thu', logins: 5 },
  { day: 'Fri', logins: 9 },
  { day: 'Sat', logins: 3 },
  { day: 'Sun', logins: 4 },
];

const SECURITY_SCORE_DATA = [
  {
    name: 'Security Score',
    uv: 85,
    pv: 2400,
    fill: '#10B981',
  },
];

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    if (user) {
      const userOrders = db.getOrdersByCustomer(user.id);
      setOrders(userOrders);
    }
  }, [isAuthenticated, onNavigate, user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#050B14] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center space-x-2 text-[#A7B1C6]">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Verified Account</span>
                <span>•</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Chart 1: Login Activity */}
          <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Login Activity (Last 7 Days)
              </h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LOGIN_ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#A7B1C6"
                    tick={{ fill: '#A7B1C6', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#A7B1C6"
                    tick={{ fill: '#A7B1C6', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050B14', borderColor: '#ffffff20', color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar
                    dataKey="logins"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Security Score */}
          <div className="bg-[#0B1628] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center relative">
            <h2 className="text-lg font-semibold text-white flex items-center absolute top-6 left-6">
              <Lock className="w-5 h-5 mr-2 text-green-400" />
              Security Score
            </h2>
            <div className="h-[250px] w-full flex items-center justify-center mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={20}
                  data={SECURITY_SCORE_DATA}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background={{ fill: '#ffffff10' }}
                    dataKey="uv"
                    cornerRadius={10}
                  />
                  <Legend
                    iconSize={0}
                    layout="vertical"
                    verticalAlign="middle"
                    wrapperStyle={{ top: '50%', left: '50%', transform: 'translate(-50%, -20%)', textAlign: 'center' }}
                    content={() => (
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white block">85</span>
                        <span className="text-sm text-green-400">Excellent</span>
                      </div>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-[#A7B1C6] px-4">
              Your account security is strong. 2FA is recommended for higher protection.
            </p>
          </div>
        </div>

        {/* Quick Actions & Orders Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <button
              onClick={() => onNavigate('products')}
              className="w-full bg-[#0B1628] rounded-xl p-4 border border-white/5 text-left hover:border-white/20 transition-all hover:translate-x-1 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-white font-medium">Browse Products</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#A7B1C6] group-hover:text-white" />
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="w-full bg-[#0B1628] rounded-xl p-4 border border-white/5 text-left hover:border-white/20 transition-all hover:translate-x-1 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium">Book Services</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#A7B1C6] group-hover:text-white" />
            </button>

            <button
              className="w-full bg-[#0B1628] rounded-xl p-4 border border-white/5 text-left hover:border-white/20 transition-all hover:translate-x-1 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-white font-medium">Security Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#A7B1C6] group-hover:text-white" />
            </button>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[#0B1628] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
              <Button variant="ghost" className="text-sm text-[#A7B1C6] hover:text-white p-0 h-auto">View All</Button>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-[200px]">
                <Package className="h-10 w-10 text-[#A7B1C6]/30 mb-3" />
                <p className="text-[#A7B1C6]">No recent transactions found</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-[#A7B1C6]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-[#A7B1C6]">
                            {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${order.totalPrice.toFixed(2)}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${order.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : order.status === 'processing'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
