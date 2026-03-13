import { createClient } from '@supabase/supabase-js';

// الحصول على متغيرات البيئة
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود متغيرات البيئة المطلوبة
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'متغيرات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY غير معرّفة. يرجى تحديثها في .env.local'
  );
}

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// مثال على دالة للاتصال والتحقق
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('your_table_name') // استبدل باسم جدولك
      .select('*')
      .limit(1);

    if (error) {
      console.error('خطأ في الاتصال:', error);
      return false;
    }

    console.log('تم الاتصال بنجاح!', data);
    return true;
  } catch (err) {
    console.error('خطأ غير متوقع:', err);
    return false;
  }
};

// ===== دوال عامة =====

// مثالل على إضافة بيانات
export const insertData = async (table: string, data: any) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert([data]);

  if (error) {
    console.error('خطأ في الإدراج:', error);
    return null;
  }

  return result;
};

// مثال على جلب البيانات
export const fetchData = async (table: string) => {
  const { data, error } = await supabase
    .from(table)
    .select('*');

  if (error) {
    console.error('خطأ في الجلب:', error);
    return [];
  }

  return data;
};

// مثال على تحديث البيانات
export const updateData = async (table: string, id: any, updates: any) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('خطأ في التحديث:', error);
    return null;
  }

  return data;
};

// مثال على حذف البيانات
export const deleteData = async (table: string, id: any) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('خطأ في الحذف:', error);
    return false;
  }

  return true;
};

// ===== دوال متخصصة للطلبات =====

// إضافة طلب جديد في Supabase
export const createOrder = async (order: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      id: order.id,
      order_no: order.orderNo,
      date: order.date,
      customer_id: order.customerId || null,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      abaya_no: order.abayaNo,
      design_name: order.designName,
      color: order.color,
      fabric: order.fabric,
      notes: order.notes,
      sleeve_from_neck: order.measurements?.sleeveFromNeck || '',
      arms: order.measurements?.arms || '',
      bust: order.measurements?.bust || '',
      sleeve_width: order.measurements?.sleeveWidth || '',
      waist: order.measurements?.waist || '',
      abaya_length: order.measurements?.abayaLength || '',
      total_amount: order.totalAmount,
      paid_amount: order.paidAmount,
      remaining_amount: order.remainingAmount,
      discount: order.discount,
      shipping: order.shipping,
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return null;
  }

  return data;
};

// تحديث حالة الطلب والمبالغ
export const updateOrder = async (orderId: string, updates: any) => {
  const updatePayload: any = {};
  
  if (updates.status) updatePayload.status = updates.status;
  if (typeof updates.paidAmount !== 'undefined') {
    updatePayload.paid_amount = updates.paidAmount;
    updatePayload.remaining_amount = (updates.totalAmount || 0) - updates.paidAmount;
  }
  if (typeof updates.totalAmount !== 'undefined') updatePayload.total_amount = updates.totalAmount;
  if (typeof updates.remainingAmount !== 'undefined') updatePayload.remaining_amount = updates.remainingAmount;
  
  updatePayload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) {
    console.error('خطأ في تحديث الطلب:', error);
    return null;
  }

  return data;
};

// جلب طلب واحد من Supabase باستخدام ID
export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('خطأ في جلب الطلب:', error);
    return null;
  }

  // تحويل أسماء الأعمدة من snake_case إلى camelCase
  if (data) {
    return {
      id: data.id,
      orderNo: data.order_no,
      date: data.date,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      abayaNo: data.abaya_no,
      designName: data.design_name,
      color: data.color,
      fabric: data.fabric,
      notes: data.notes,
      measurements: {
        sleeveFromNeck: data.sleeve_from_neck,
        arms: data.arms,
        bust: data.bust,
        sleeveWidth: data.sleeve_width,
        waist: data.waist,
        abayaLength: data.abaya_length
      },
      totalAmount: data.total_amount,
      paidAmount: data.paid_amount,
      remainingAmount: data.remaining_amount,
      discount: data.discount,
      shipping: data.shipping,
      status: data.status,
      createdAt: new Date(data.created_at).getTime()
    };
  }

  return null;
};

// جلب طلب واحد من Supabase باستخدام order_no
export const getOrderByOrderNo = async (orderNo: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_no', orderNo)
    .single();

  if (error) {
    console.error('خطأ في جلب الطلب:', error);
    return null;
  }

  // تحويل أسماء الأعمدة من snake_case إلى camelCase
  if (data) {
    return {
      id: data.id,
      orderNo: data.order_no,
      date: data.date,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      abayaNo: data.abaya_no,
      designName: data.design_name,
      color: data.color,
      fabric: data.fabric,
      notes: data.notes,
      measurements: {
        sleeveFromNeck: data.sleeve_from_neck,
        arms: data.arms,
        bust: data.bust,
        sleeveWidth: data.sleeve_width,
        waist: data.waist,
        abayaLength: data.abaya_length
      },
      totalAmount: data.total_amount,
      paidAmount: data.paid_amount,
      remainingAmount: data.remaining_amount,
      discount: data.discount,
      shipping: data.shipping,
      status: data.status,
      createdAt: new Date(data.created_at).getTime()
    };
  }

  return null;
};

// جلب جميع الطلبات
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return [];
  }

  return (data || []).map(d => ({
    id: d.id,
    orderNo: d.order_no,
    date: d.date,
    customerId: d.customer_id,
    customerName: d.customer_name,
    customerPhone: d.customer_phone,
    customerAddress: d.customer_address,
    abayaNo: d.abaya_no,
    designName: d.design_name,
    color: d.color,
    fabric: d.fabric,
    notes: d.notes,
    measurements: {
      sleeveFromNeck: d.sleeve_from_neck,
      arms: d.arms,
      bust: d.bust,
      sleeveWidth: d.sleeve_width,
      waist: d.waist,
      abayaLength: d.abaya_length
    },
    totalAmount: d.total_amount,
    paidAmount: d.paid_amount,
    remainingAmount: d.remaining_amount,
    discount: d.discount,
    shipping: d.shipping,
    status: d.status,
    createdAt: new Date(d.created_at).getTime()
  }));
};
