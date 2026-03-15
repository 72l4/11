import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOrderByOrderNo } from '../services/firebase';
import { MessageCircle, Loader2, Heart } from 'lucide-react';

const TrackingView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get('orderNo');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNo) {
      getOrderByOrderNo(orderNo as string).then(data => {
        setOrder(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderNo]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-pink-600" size={48} /></div>;

  if (!order) return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">عذراً، لم نجد الطلب! 🌸</h2>
      <p>تأكدي من صحة الرابط المرسل إليك.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full text-center">
        <Heart className="text-pink-500 mx-auto mb-4" size={40} />
        <h1 className="text-xl font-bold text-gray-800">أهلاً {order.customerName}</h1>
        <p className="text-gray-400 text-sm mb-6">رقم الطلب: {order.orderNo}</p>
        <div className="bg-pink-50 p-4 rounded-xl mb-6 border border-pink-100">
          <p className="text-pink-800 font-bold">الحالة: {order.status}</p>
        </div>
        <a 
          href={`https://wa.me/968XXXXXXXX?text=مرحباً، أستفسر عن طلبي رقم ${order.orderNo}`}
          className="flex items-center justify-center gap-2 bg-green-500 text-white p-4 rounded-xl font-bold w-full"
        >
          <MessageCircle /> تواصل عبر الواتساب
        </a>
      </div>
    </div>
  );
};

export default TrackingView;