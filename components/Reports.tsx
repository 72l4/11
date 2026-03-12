
import React from 'react';
import { storage } from '../services/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Reports: React.FC = () => {
  const orders = storage.getOrders();
  
  // Sales by date
  const salesByDate = orders.reduce((acc: any, o) => {
    const date = o.date;
    acc[date] = (acc[date] || 0) + (o.totalAmount - o.discount + o.shipping);
    return acc;
  }, {});

  const chartData = Object.keys(salesByDate).map(date => ({
    date,
    sales: salesByDate[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Designs popularity
  const designStats = orders.reduce((acc: any, o) => {
    const name = o.designName || 'غير معروف';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const designData = Object.keys(designStats).map(name => ({
    name,
    count: designStats[name]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8">تحليل المبيعات (الزمني)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F472B6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F472B6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F472B6" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8">أكثر التصاميم طلباً</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={designData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#fdf2f8' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#F472B6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 mb-8">ملخص مالي سريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-pink-50 border border-pink-100">
            <p className="text-xs text-pink-400 font-bold mb-1">إجمالي المبيعات</p>
            <p className="text-2xl font-black text-pink-700">{orders.reduce((acc, o) => acc + (o.totalAmount - o.discount + o.shipping), 0).toLocaleString()} ر.ع</p>
          </div>
          <div className="p-6 rounded-3xl bg-green-50 border border-green-100">
            <p className="text-xs text-green-400 font-bold mb-1">المبلغ المحصل</p>
            <p className="text-2xl font-black text-green-700">{orders.reduce((acc, o) => acc + o.paidAmount, 0).toLocaleString()} ر.ع</p>
          </div>
          <div className="p-6 rounded-3xl bg-red-50 border border-red-100">
            <p className="text-xs text-red-400 font-bold mb-1">المستحقات المتأخرة</p>
            <p className="text-2xl font-black text-red-700">{orders.reduce((acc, o) => acc + o.remainingAmount, 0).toLocaleString()} ر.ع</p>
          </div>
          <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100">
            <p className="text-xs text-purple-400 font-bold mb-1">متوسط قيمة الطلب</p>
            <p className="text-2xl font-black text-purple-700">
              {orders.length > 0 ? Math.round(orders.reduce((acc, o) => acc + (o.totalAmount - o.discount + o.shipping), 0) / orders.length).toLocaleString() : 0} ر.ع
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
