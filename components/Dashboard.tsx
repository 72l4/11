
import React from 'react';
import { storage } from '../services/storage';
import { OrderStatus } from '../types';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users as UsersIcon, 
  Clock,
  CheckCircle2,
  Package,
  Truck,
  ArrowUpRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const orders = storage.getOrders();
  const customers = storage.getCustomers();

  const stats = {
    totalSales: orders.reduce((acc, o) => acc + (o.totalAmount - o.discount + o.shipping), 0),
    totalOrders: orders.length,
    activeCustomers: customers.length,
    inProgress: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length,
    ready: orders.filter(o => o.status === OrderStatus.READY).length,
    shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
  };

  const cards = [
    { label: 'إجمالي المبيعات', value: `${stats.totalSales.toLocaleString()} ر.ع`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'عدد الطلبات', value: stats.totalOrders, icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'إجمالي الزبائن', value: stats.activeCustomers, icon: UsersIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const statusItems = [
    { label: 'قيد التنفيذ', value: stats.inProgress, icon: Clock, color: 'text-amber-500' },
    { label: 'جاهز للاستلام', value: stats.ready, icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'تم الشحن', value: stats.shipped, icon: Truck, color: 'text-indigo-500' },
    { label: 'تم التسليم', value: stats.delivered, icon: Package, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-800">مرحباً بكِ في نظام Cute Base</h2>
        <p className="text-gray-500 text-sm">إدارة الطلبات، الزبائن، والتقارير في مكان واحد بكل فخامة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-5 rounded-[2rem] ${card.bg}`}>
                <Icon className={card.color} size={32} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-between">
            حالات الطلبات
            <span className="text-[10px] text-pink-400 bg-pink-50 px-2 py-1 rounded-full uppercase">Current</span>
          </h3>
          <div className="space-y-4">
            {statusItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-pink-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white shadow-sm ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-xl font-black text-gray-800">{item.value}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm overflow-hidden">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-between">
            أحدث الفواتير
            <button className="text-xs text-pink-500 flex items-center gap-1 hover:underline">
              عرض الكل <ArrowUpRight size={14} />
            </button>
          </h3>
          <div className="space-y-3">
            {orders.slice(-6).reverse().map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-pink-100 hover:bg-pink-50/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center justify-center text-pink-600 font-black">
                    {order.customerName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 group-hover:text-pink-700 transition-colors">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{order.orderNo} • {order.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-pink-800">{(order.totalAmount - order.discount + order.shipping).toLocaleString()} ر.ع</p>
                  <p className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${order.remainingAmount > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {order.remainingAmount > 0 ? `متبقي ${order.remainingAmount}` : 'مدفوع بالكامل'}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10 text-gray-300 italic flex flex-col items-center gap-2">
                <ShoppingBag size={48} strokeWidth={1} />
                لا توجد فواتير حالياً
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
