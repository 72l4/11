
import React from 'react';
import { Order } from '../types';
import { MEASUREMENT_LABELS } from '../constants';
import { MessageCircle } from 'lucide-react';

interface InvoiceViewProps {
  order: Order;
  onClose: () => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const trackingUrl = `${window.location.origin}/track/${order.id}`;
    const message = `مرحباً بكِ أ. ${order.customerName} 🌸

فاتورة طلبك من Cute Base Abaya جاهزة.

📍 تفاصيل الطلب:
- رقم الفاتورة: ${order.orderNo}
- حالة الطلب: ${order.status}
- المبلغ الإجمالي: ${order.totalAmount} ر.ع
- المبلغ المتبقي: ${order.remainingAmount} ر.ع

🔗 يمكنك تتبع حالة طلبك من هنا:
${trackingUrl}

شكراً لثقتك بنا ✨`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const finalTotal = order.totalAmount - order.discount + order.shipping;

  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto p-4 md:p-10 no-print">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800">معاينة الفاتورة</h1>
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            إغلاق
          </button>
          <button 
            onClick={handleWhatsApp}
            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all font-bold flex items-center gap-2"
          >
            <MessageCircle size={18} />
            إرسال واتساب
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all font-bold"
          >
            طباعة / PDF
          </button>
        </div>
      </div>

      {/* Actual Printable Invoice Area */}
      <div className="invoice-print bg-white p-12 border border-pink-100 rounded-[2.5rem] shadow-2xl mx-auto max-w-[210mm] min-h-[297mm]">
        {/* Header */}
        <div className="flex flex-col items-center border-b-2 border-pink-50 pb-8 mb-10">
          <h2 className="text-5xl font-bold text-pink-800 tracking-tighter" style={{ fontFamily: 'serif' }}>cute base</h2>
          <span className="text-lg text-pink-400 tracking-[1em] mr-4 uppercase font-light">ABAYA</span>
          <div className="mt-4 text-sm text-gray-400 font-mono tracking-widest">{order.orderNo}</div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 text-sm">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">التاريخ / DATE</span>
              <span className="text-gray-800 font-medium">{order.date}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">الاسم / NAME</span>
              <span className="text-gray-800 font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">الرقم / PHONE</span>
              <span className="text-gray-800 font-medium">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">العنوان / ADDRESS</span>
              <span className="text-gray-800 font-medium">{order.customerAddress}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">رقم العباية / ABAYA NO</span>
              <span className="text-gray-800 font-medium">{order.abayaNo}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">التصميم / DESIGN</span>
              <span className="text-gray-800 font-medium">{order.designName}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">اللون / COLOR</span>
              <span className="text-gray-800 font-medium">{order.color}</span>
            </div>
            <div className="flex justify-between border-b border-pink-50 pb-2">
              <span className="text-gray-400 font-bold">القماش / FABRIC</span>
              <span className="text-gray-800 font-medium">{order.fabric}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-pink-50/30 rounded-2xl text-xs text-gray-600">
          <span className="font-bold text-pink-800 ml-2">ملاحظات / NOTES:</span>
          {order.notes || '—'}
        </div>

        {/* Measurements - Vital Section */}
        <div className="mt-12">
          <div className="bg-pink-100/50 p-4 rounded-t-3xl text-center border-b border-pink-200">
            <h3 className="text-xl font-bold text-pink-800 tracking-widest uppercase">Measurements — المقاسات</h3>
          </div>
          <div className="grid grid-cols-2 border-2 border-pink-100 rounded-b-3xl overflow-hidden">
            {MEASUREMENT_LABELS.map((m, i) => (
              <div key={m.key} className={`flex items-center justify-between p-6 ${i % 2 === 0 ? 'border-l border-pink-100' : ''} ${i < 4 ? 'border-b border-pink-100' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-gray-700 font-bold text-lg">{m.ar}</span>
                  <span className="text-gray-400 text-xs italic">{m.en}</span>
                </div>
                <div className="text-2xl font-black text-pink-600 underline decoration-pink-200 underline-offset-8">
                  {order.measurements[m.key as keyof typeof order.measurements] || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-[2rem] text-center border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 font-bold">المبلغ الإجمالي / TOTAL</p>
            <p className="text-xl font-bold text-gray-800">{order.totalAmount} ر.ع</p>
          </div>
          <div className="bg-pink-50 p-6 rounded-[2rem] text-center border border-pink-100">
            <p className="text-xs text-pink-400 mb-1 font-bold">المبلغ المدفوع / PAID</p>
            <p className="text-xl font-bold text-pink-700">{order.paidAmount} ر.ع</p>
          </div>
          <div className="bg-red-50 p-6 rounded-[2rem] text-center border border-red-100">
            <p className="text-xs text-red-400 mb-1 font-bold">المتبقي / BALANCE</p>
            <p className="text-xl font-bold text-red-700">{order.remainingAmount} ر.ع</p>
          </div>
        </div>

        <div className="mt-auto pt-20 flex justify-between items-end">
          <div className="text-center space-y-2">
            <div className="w-32 h-px bg-gray-200 mx-auto"></div>
            <p className="text-[10px] text-gray-400 font-bold">توقيع المستلم / SIGNATURE</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white p-2 border border-pink-100 rounded-xl inline-block mb-2">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-[8px] text-gray-300">QR CODE</div>
            </div>
            <p className="text-[10px] text-pink-400 font-bold">تواصل معنا عبر واتساب</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-32 h-px bg-gray-200 mx-auto"></div>
            <p className="text-[10px] text-gray-400 font-bold">ختم المتجر / STAMP</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .invoice-print, .invoice-print * { visibility: visible; }
          .invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 20mm !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
