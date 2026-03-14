import { createClient } from '@supabase/supabase-js';

// الحصول على متغيرات البيئة
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('متغيرات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY غير معرّفة.');
}

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== دوال الطلبات الأساسية =====

// إضافة طلب جديد (يدعم الصور)
export const createOrder = async (order: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      id: order.id,
      order_no: order.orderNo,
      date: order.date,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      abaya_no: order.abayaNo,
      total_amount: order.totalAmount,
      paid_amount: order.paidAmount,
      remaining_amount: order.remainingAmount,
      status: order.status,
      image_url: order.imageUrl || null, 
      estimated_delivery_date: order.estimatedDeliveryDate || null,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return null;
  }
  return data;
};

// ===== دوال التعامل مع الصور =====

// رفع صورة الفاتورة أو الطلب
export const uploadOrderImage = async (file: File, orderId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}_${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('orders') // تأكد من إنشاء Bucket باسم 'orders'
    .upload(fileName, file);

  if (uploadError) {
    console.error('خطأ في رفع الصورة:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from('orders').getPublicUrl(fileName);
  return data.publicUrl;
};

// ===== دوال الجلب والتحقق =====

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return [];
  }
  return data;
};

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('orders').select('id').limit(1);
    if (error) throw error;
    console.log('تم الاتصال بنجاح!');
    return true;
  } catch (err) {
    console.error('خطأ في الاتصال:', err);
    return false;
  }
};