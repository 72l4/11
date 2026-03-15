import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Measurements, Customer } from '../types';
import { storage } from '../services/storage';
import { createOrder } from '../services/firebase'; // استيراد دالة الفايربيز
import AbayaDiagram from './AbayaDiagram';
import { Save, Printer, ArrowRight, UserPlus, Search, Info } from 'lucide-react';

interface OrderFormProps {
  initialOrder?: Order;
  onComplete: () => void;
  onPrint: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialOrder, onComplete, onPrint }) => {
  const [totalStr, setTotalStr] = useState(initialOrder?.totalAmount?.toString() || '0');
  const [paidStr, setPaidStr] = useState(initialOrder?.paidAmount?.toString() || '0');
  const [discountStr, setDiscountStr] = useState(initialOrder?.discount?.toString() || '0');
  const [shippingStr, setShippingStr] = useState(initialOrder?.shipping?.toString() || '0');

  const [order, setOrder] = useState<Partial<Order>>(initialOrder || {
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(),
    orderNo: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    abayaNo: '',
    designName: '',
    color: '',
    fabric: '',
    notes: '',
    measurements: {
      sleeveFromNeck: '', arms: '', bust: '', sleeveWidth: '', waist: '', abayaLength: ''
    },
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    discount: 0,
    shipping: 0,
    status: OrderStatus.IN_PROGRESS,
    imageUrl: '',
    expectedDeliveryDate: '',
    createdAt: Date.now()
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // حالة للحفظ
  const customers = storage.getCustomers();

  useEffect(() => {
    const total = Number(totalStr) || 0;
    const discount = Number(discountStr) || 0;
    const shipping = Number(shippingStr) || 0;
    const paid = Number(paidStr) || 0;
    const finalTotal = total - discount + shipping;
    
    setOrder(prev => ({
      ...prev,
      totalAmount: total,
      discount: discount,
      shipping: shipping,
      paidAmount: paid,
      remainingAmount: Number((finalTotal - paid).toFixed(3))
    }));
  }, [totalStr, paidStr, discountStr, shippingStr]);

  const handleSave = async () => {
    if (!order.customerName || !order.customerPhone) {
      alert('يرجى إدخال اسم الزبونة ورقمها 🌸');
      return;
    }

    setIsSaving(true);
    try {
      const finalOrder = order as Order;
      
      // 1. الحفظ المحلي (Storage)
      storage.saveOrder(finalOrder);
      storage.updateCustomerFromOrder(finalOrder);
      
      // 2. الحفظ في Firebase
      await createOrder(finalOrder);
      
      alert('تم حفظ الفاتورة بنجاح في النظام وفي Firebase! ✨');
      onComplete();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء الحفظ في Firebase، يرجى التأكد من الإنترنت أو الإعدادات.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMeasurementChange = (key: keyof Measurements, value: string) => {
    setOrder(prev => ({
      ...prev,
      measurements: { ...prev.measurements!, [key]: value }
    }));
  };

  const selectCustomer = (c: Customer) => {
    setOrder(prev => ({
      ...prev,
      customerName: c.name,
      customerPhone: c.phone,
      customerAddress: c.address,
      measurements: c.lastMeasurements || prev.measurements
    }));
    setShowCustomerSearch(false);
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="p-2 hover:bg-pink-100 rounded-full text-pink-600 transition-colors">
            <ArrowRight size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {initialOrder ? 'تعديل فاتورة' : 'إنشاء فاتورة جديدة'}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPrint(order as Order)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-pink-200 text-pink-600 rounded-xl hover:bg-pink-50 font-medium"
          >
            <Printer size={18} />
            <span>معاينة للطباعة</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-8 py-2 ${isSaving ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'} text-white rounded-xl shadow-md transition-all font-medium`}
          >
            <Save size={18} />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الطلب'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* بيانات العميل */}
          <section className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-pink-500"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserPlus size={20} className="text-pink-500" /> بيانات الزبونة
              </h3>
              <div className="relative">
                <button onClick={() => setShowCustomerSearch(!showCustomerSearch)} className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                  <Search size={14} /> بحث عن عميلة سابقة
                </button>
                {showCustomerSearch && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-pink-100 rounded-2xl shadow-xl z-10 overflow-hidden">
                    <input autoFocus className="w-full p-3 border-b text-sm focus:outline-none" placeholder="ابحث بالاسم أو الرقم..." onChange={(e) => setCustomerSearch(e.target.value)} />
                    <div className="max-h-48 overflow-y-auto">
                      {customers.filter(c => c.name.includes(customerSearch) || c.phone.includes(customerSearch)).map(c => (
                        <button key={c.id} className="w-full text-right p-3 hover:bg-pink-50 text-sm border-b border-pink-50" onClick={() => selectCustomer(c)}>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-xs text-gray-400">{c.phone}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">الاسم</label>
                <input type="text" value={order.customerName} onChange={(e) => setOrder({...order, customerName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" placeholder="اسم الزبونة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">الرقم</label>
                <input type="tel" value={order.customerPhone} onChange={(e) => setOrder({...order, customerPhone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" placeholder="968xxxxxxx" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">العنوان</label>
                <input type="text" value={order.customerAddress} onChange={(e) => setOrder({...order, customerAddress: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
            </div>
          </section>

          {/* تفاصيل العباية */}
          <section className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">تفاصيل العباية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">رقم العباية</label>
                <input type="text" value={order.abayaNo} onChange={(e) => setOrder({...order, abayaNo: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">اسم التصميم</label>
                <input type="text" value={order.designName} onChange={(e) => setOrder({...order, designName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">اللون</label>
                <input type="text" value={order.color} onChange={(e) => setOrder({...order, color: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">القماش</label>
                <input type="text" value={order.fabric} onChange={(e) => setOrder({...order, fabric: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">ملاحظات إضافية</label>
                <textarea rows={3} value={order.notes} onChange={(e) => setOrder({...order, notes: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">التاريخ المتوقع للاستلام</label>
                <input type="date" value={order.expectedDeliveryDate} onChange={(e) => setOrder({...order, expectedDeliveryDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-200 focus:outline-none" />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <AbayaDiagram measurements={order.measurements as Measurements} onChange={handleMeasurementChange} />

          {/* الحساب والدفع */}
          <section className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">الحساب والدفع</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">الإجمالي</span>
                <input type="text" inputMode="decimal" value={totalStr} onChange={(e) => setTotalStr(e.target.value)} className="w-24 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-center focus:outline-none font-bold" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">الخصم</span>
                <input type="text" inputMode="decimal" value={discountStr} onChange={(e) => setDiscountStr(e.target.value)} className="w-24 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-center focus:outline-none font-bold" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">الشحن</span>
                <input type="text" inputMode="decimal" value={shippingStr} onChange={(e) => setShippingStr(e.target.value)} className="w-24 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-center focus:outline-none font-bold" />
              </div>
              <div className="border-t border-dashed border-pink-100 my-4 pt-4 flex justify-between items-center font-bold text-pink-700">
                <span>المبلغ الكلي</span>
                <span>{(parseFloat(totalStr || '0') - parseFloat(discountStr || '0') + parseFloat(shippingStr || '0')).toLocaleString()} ر.ع</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-bold">المبلغ المدفوع (العربون)</span>
                <input type="text" inputMode="decimal" value={paidStr} onChange={(e) => setPaidStr(e.target.value)} className="w-24 px-2 py-1 bg-green-50 border border-green-100 rounded text-center font-bold text-green-700 focus:outline-none" />
              </div>
              <div className="flex justify-between items-center text-red-600 font-bold bg-red-50 p-3 rounded-xl mt-4">
                <span className="flex items-center gap-1">المتبقي <Info size={12} className="text-red-300" /></span>
                <span>{order.remainingAmount?.toLocaleString()} ر.ع</span>
              </div>
            </div>
          </section>

          {/* حالة الطلب */}
          <section className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">حالة الطلب</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(OrderStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setOrder({...order, status})}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${order.status === status ? 'bg-pink-600 text-white shadow-md' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;