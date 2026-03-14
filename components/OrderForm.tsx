import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Measurements, Customer } from '../types';
import { storage } from '../services/storage';
// تم إضافة uploadOrderImage هنا
import { createOrder, updateOrder, uploadOrderImage } from '../services/supabase';
import AbayaDiagram from './AbayaDiagram';
import { Save, Printer, ArrowRight, UserPlus, Search, Info, Upload } from 'lucide-react';

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
  
  // حالة الصورة
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      sleeveFromNeck: '',
      arms: '',
      bust: '',
      sleeveWidth: '',
      waist: '',
      abayaLength: ''
    },
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    discount: 0,
    shipping: 0,
    status: OrderStatus.IN_PROGRESS,
    createdAt: Date.now()
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
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
      alert('يرجى إدخال اسم العميل ورقمه');
      return;
    }

    try {
      let imageUrl = order.imageUrl;

      // إذا اختار المستخدم صورة جديدة، نرفعها أولاً
      if (imageFile) {
        const uploadedUrl = await uploadOrderImage(imageFile, order.id!);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const finalOrder = { ...order, imageUrl } as Order;
      
      storage.saveOrder(finalOrder);
      storage.updateCustomerFromOrder(finalOrder);
      
      if (initialOrder && initialOrder.id) {
        await updateOrder(initialOrder.id, finalOrder);
      } else {
        await createOrder(finalOrder);
      }
      
      onComplete();
    } catch (error) {
      console.error('خطأ في حفظ الطلب:', error);
      alert('حدث خطأ أثناء الحفظ. تأكد من إعدادات الاتصال.');
    }
  };

  // ... باقي الدوال (handleMeasurementChange, selectCustomer) تبقى كما هي

  const handleMeasurementChange = (key: keyof Measurements, value: string) => {
    setOrder(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements!,
        [key]: value
      }
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
      {/* ... (الجزء العلوي من الواجهة يظل كما هو) */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{initialOrder ? 'تعديل فاتورة' : 'إنشاء فاتورة جديدة'}</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2 bg-pink-600 text-white rounded-xl">
          <Save size={18} /> <span>حفظ الطلب</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* ... (باقي أقسام بيانات العميل) */}
          
          <section className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">رفع صورة الفاتورة</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
              className="w-full p-4 border-2 border-dashed border-pink-200 rounded-xl text-pink-600"
            />
            {imageFile && <p className="mt-2 text-sm text-green-600">تم اختيار: {imageFile.name}</p>}
          </section>
        </div>
        
        {/* ... (باقي الواجهة الجانبية) */}
      </div>
    </div>
  );
};

export default OrderForm;