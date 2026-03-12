
import React, { useState } from 'react';
import { storage } from '../services/storage';
import { Order, OrderStatus } from '../types';
// Added ShoppingBag to the imports from lucide-react
import { Search, Edit3, Trash2, Printer, CheckCircle, ExternalLink, ShoppingBag } from 'lucide-react';

interface OrderListProps {
  onEdit: (order: Order) => void;
  onPrint: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onEdit, onPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState(storage.getOrders());

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.includes(searchTerm) || o.customerPhone.includes(searchTerm) || o.orderNo.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).reverse();

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      storage.deleteOrder(id);
      setOrders(storage.getOrders());
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-600 border-amber-100';
      case OrderStatus.READY: return 'bg-blue-50 text-blue-600 border-blue-100';
      case OrderStatus.SHIPPED: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl border border-pink-50 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="ابحث بالاسم، الرقم، أو الفاتورة..."
            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:outline-none text-gray-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-50 text-gray-500'}`}
          >
            الكل
          </button>
          {Object.values(OrderStatus).map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${statusFilter === status ? 'bg-pink-600 text-white' : 'bg-gray-50 text-gray-500'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2rem] border border-pink-50 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:shadow-pink-50/50 transition-all group">
            <div className="p-6 pb-0 flex justify-between items-start">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-xs text-gray-400 font-mono">{order.orderNo}</span>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center text-pink-600 font-bold border border-pink-100">
                  {order.customerName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{order.customerName}</h4>
                  <p className="text-xs text-gray-400">{order.customerPhone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">التصميم</p>
                  <p className="text-sm font-medium text-gray-700">{order.designName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">الموعد</p>
                  <p className="text-sm font-medium text-gray-700">{order.date}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">المتبقي</span>
                  <span className={`text-sm font-bold ${order.remainingAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {order.remainingAmount === 0 ? <span className="flex items-center gap-1"><CheckCircle size={12}/> مسدد</span> : `${order.remainingAmount} ر.ع`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">الإجمالي</span>
                  <p className="text-lg font-black text-pink-700">{(order.totalAmount - order.discount + order.shipping).toLocaleString()} ر.ع</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-3 gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(order)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all"
              >
                <Edit3 size={16} />
                <span className="text-xs font-bold">تعديل</span>
              </button>
              <button 
                onClick={() => onPrint(order)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
              >
                <Printer size={16} />
                <span className="text-xs font-bold">طباعة</span>
              </button>
              <button 
                onClick={() => handleDelete(order.id)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <Trash2 size={16} />
                <span className="text-xs font-bold">حذف</span>
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="mb-4 text-gray-200 flex justify-center"><ShoppingBag size={80} strokeWidth={1} /></div>
            <p className="text-xl font-bold text-gray-400 italic">لا توجد طلبات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
