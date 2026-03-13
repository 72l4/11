
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { getOrderByOrderNo } from '../services/supabase';
import { CheckCircle2, Clock, Truck, Package, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface TrackingViewProps {
  order?: Order;
  onBack?: () => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ order: initialOrder, onBack }) => {
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const queryOrderNo = searchParams.get('orderNo');
  const orderNo = paramOrderId || queryOrderNo;
  
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    if (!initialOrder && orderNo) {
      // جلب الطلب من Supabase باستخدام order_no
      getOrderByOrderNo(orderNo)
        .then(foundOrder => {
          setOrder(foundOrder as Order);
          setLoading(false);
        })
        .catch(error => {
          console.error('خطأ في جلب الطلب:', error);
          setLoading(false);
        });
    }
  }, [orderNo, initialOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-pink-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">طلب غير موجود</h2>
        <p className="text-gray-500">عذراً، لم نتمكن من العثور على بيانات هذا الطلب.</p>
      </div>
    );
  }

  const statusSteps = [
    { status: OrderStatus.IN_PROGRESS, icon: Clock, label: 'بدأنا التفصيل' },
    { status: OrderStatus.READY, icon: CheckCircle2, label: 'طلبك جاهز' },
    { status: OrderStatus.SHIPPED, icon: Truck, label: 'في الطريق إليك' },
    { status: OrderStatus.DELIVERED, icon: Package, label: 'تم التسليم' },
  ];

  const currentIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8 mt-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-pink-800" style={{ fontFamily: 'serif' }}>CUTE BASE</h1>
          <p className="text-pink-400 tracking-[0.3em] text-sm">تتبع طلبك — TRACK ORDER</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] text-amber-700 font-bold">
          <ShieldCheck size={14} />
          هذه الصفحة للمعاينة فقط - لا يمكن تعديل البيانات من هنا
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-xl shadow-pink-100/20 space-y-6 text-center">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">مرحباً بكِ أ.</p>
            <h2 className="text-2xl font-bold text-gray-800">{order.customerName}</h2>
          </div>
          <div className="flex flex-col gap-2">
             <div className="inline-block px-4 py-2 bg-pink-50 rounded-2xl border border-pink-100">
              <p className="text-xs text-pink-600 font-bold">رقم الطلب: {order.orderNo}</p>
            </div>
            <p className="text-[10px] text-gray-400">تاريخ الطلب: {order.date}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-pink-50 shadow-sm space-y-8">
          <h3 className="text-sm font-bold text-gray-400 border-b border-gray-50 pb-4">حالة الطلب الحالية</h3>
          <div className="relative space-y-8 px-2">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentIndex;
              const isLast = index === statusSteps.length - 1;

              return (
                <div key={index} className="flex items-start gap-6 relative">
                  {!isLast && (
                    <div className={`absolute right-[21px] top-10 w-0.5 h-10 ${isCompleted && index < currentIndex ? 'bg-pink-500' : 'bg-gray-100'}`} />
                  )}
                  <div className={`z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'bg-gray-100 text-gray-300'}`}>
                    <Icon size={22} />
                  </div>
                  <div className="pt-1">
                    <p className={`font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-300'}`}>{step.label}</p>
                    <p className="text-[10px] text-gray-400">{step.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-400 italic">شكراً لاختيارك Cute Base Abaya 🤍</p>
        </div>
        
        {onBack && (
          <button onClick={onBack} className="w-full py-4 text-pink-600 font-bold border border-pink-100 rounded-2xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
            <ArrowRight size={18} />
            العودة للوحة الإدارة
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackingView;
