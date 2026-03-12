
import React, { useState } from 'react';
import { storage } from '../services/storage';
import { Customer, Order } from '../types';
import { Search, User, Phone, MapPin, Hash, Ruler, ShoppingBag } from 'lucide-react';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const customers = storage.getCustomers();
  const orders = storage.getOrders();

  const getCustomerStats = (phone: string) => {
    const customerOrders = orders.filter(o => o.customerPhone === phone);
    const totalSpent = customerOrders.reduce((acc, o) => acc + (o.totalAmount - o.discount + o.shipping), 0);
    return {
      count: customerOrders.length,
      totalSpent
    };
  };

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="بحث عن زبونة..."
            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:outline-none text-gray-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm text-gray-400">إجمالي الزبائن المسجلين</p>
          <p className="text-xl font-bold text-pink-600">{customers.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const stats = getCustomerStats(customer.phone);
          return (
            <div key={customer.id} className="bg-white rounded-[2.5rem] border border-pink-50 shadow-sm p-8 hover:shadow-lg hover:shadow-pink-50/50 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center text-pink-600 text-2xl font-black border border-pink-100 shadow-inner">
                  {customer.name[0]}
                </div>
                <div className="text-left">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <ShoppingBag size={10} />
                    {stats.count} طلبات
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{customer.name}</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone size={14} />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} />
                  <span className="truncate">{customer.address || 'لا يوجد عنوان مسجل'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-pink-50 mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">إجمالي المدفوعات</p>
                  <p className="text-sm font-black text-emerald-600">{stats.totalSpent.toLocaleString()} ر.ع</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">آخر مقاس</p>
                  <p className="text-sm font-bold text-gray-700">{customer.lastMeasurements ? 'متوفر ✓' : 'غير مسجل'}</p>
                </div>
              </div>

              <button 
                onClick={() => onSelectCustomer(customer)}
                className="w-full py-4 bg-pink-50 text-pink-600 rounded-2xl font-bold text-sm hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Ruler size={16} />
                تكرار طلب بمقاسات الزبونة
              </button>
            </div>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="mb-4 text-gray-200 flex justify-center"><User size={80} strokeWidth={1} /></div>
            <p className="text-xl font-bold text-gray-400 italic">لا يوجد زبائن بهذا الاسم</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
