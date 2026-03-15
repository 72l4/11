import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Measurements, Customer } from '../types';
import { storage } from '../services/storage';
import { createOrder } from '../services/firebase'; // الربط بـ Firebase
import { Save } from 'lucide-react';

interface OrderFormProps {
  initialOrder?: Order;
  onComplete: () => void;
  onPrint: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialOrder, onComplete, onPrint }) => {
  const [totalStr, setTotalStr] = useState(initialOrder?.totalAmount?.toString() || '0');
  const [paidStr, setPaidStr] = useState(initialOrder?.paidAmount?.toString() || '0');
  
  const [order, setOrder] = useState<Partial<Order>>(initialOrder || {
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(),
    orderNo: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    status: OrderStatus.IN_PROGRESS,
    measurements: {
      sleeveFromNeck: '', arms: '', bust: '', sleeveWidth: '', waist: '', abayaLength: ''
    }
  });

  useEffect(() => {
    const total = Number(totalStr) || 0;
    const paid = Number(paidStr) || 0;
    setOrder(prev => ({
      ...prev,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: total - paid
    }));
  }, [totalStr, paidStr]);

  const handleSave = async () => {
    if (!order.customerName || !order.customerPhone) {
      alert('يرجى إدخال البيانات الأساسية');
      return;
    }

    try {
      const finalOrder = { ...order } as Order;
      
      // حفظ محلي
      storage.saveOrder(finalOrder);
      
      // حفظ في Firebase
      await createOrder(finalOrder);
      
      alert('تم حفظ الطلب بنجاح في Firebase! ✨');
      onComplete();
    } catch (error) {
      alert('فشل الحفظ. تأكد من إعدادات Firebase Test Mode.');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">فاتورة جديدة</h2>
        <button onClick={handleSave} className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Save size={18} /> حفظ
        </button>
      </div>
      
      <div className="space-y-4">
        <input 
          placeholder="اسم الزبونة" 
          className="w-full p-3 border rounded-lg"
          value={order.customerName}
          onChange={e => setOrder({...order, customerName: e.target.value})}
        />
        <input 
          placeholder="رقم الهاتف" 
          className="w-full p-3 border rounded-lg"
          value={order.customerPhone}
          onChange={e => setOrder({...order, customerPhone: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="الإجمالي" type="number" value={totalStr} onChange={e => setTotalStr(e.target.value)} className="p-3 border rounded-lg" />
          <input placeholder="المدفوع" type="number" value={paidStr} onChange={e => setPaidStr(e.target.value)} className="p-3 border rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default OrderForm;