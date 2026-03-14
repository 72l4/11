import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('متغيرات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY غير معرّفة.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// إضافة طلب جديد
export const createOrder = async (order: any) => {
  const { data, error } = await supabase.from('orders').insert([{
    id: order.id,
    order_no: order.orderNo,
    date: order.date,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_address: order.customerAddress,
    abaya_no: order.abayaNo,
    design_name: order.designName,
    color: order.color,
    fabric: order.fabric,
    notes: order.notes,
    total_amount: order.totalAmount,
    paid_amount: order.paidAmount,
    remaining_amount: order.remainingAmount,
    status: order.status,
    image_url: order.imageUrl || null,
    estimated_delivery_date: order.estimatedDeliveryDate || null,
    created_at: new Date().toISOString()
  }]).select();
  if (error) throw error;
  return data;
};

// تحديث طلب
export const updateOrder = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('orders').update({
    order_no: updates.orderNo,
    customer_name: updates.customerName,
    customer_phone: updates.customerPhone,
    customer_address: updates.customerAddress,
    abaya_no: updates.abayaNo,
    design_name: updates.designName,
    color: updates.color,
    fabric: updates.fabric,
    notes: updates.notes,
    total_amount: updates.totalAmount,
    paid_amount: updates.paidAmount,
    remaining_amount: updates.remainingAmount,
    status: updates.status,
    image_url: updates.imageUrl,
    estimated_delivery_date: updates.estimatedDeliveryDate
  }).eq('id', id).select();
  if (error) throw error;
  return data;
};

// جلب طلب برقم الطلب
export const getOrderByOrderNo = async (orderNo: string) => {
  const { data, error } = await supabase.from('orders').select('*').eq('order_no', orderNo).single();
  if (error) return null;
  return data;
};

// جلب كل الطلبات
export const getAllOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// رفع الصور
export const uploadOrderImage = async (file: File, orderId: string) => {
  const fileName = `${orderId}_${Date.now()}`;
  const { error } = await supabase.storage.from('orders').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('orders').getPublicUrl(fileName);
  return data.publicUrl;
};