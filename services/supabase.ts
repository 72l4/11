import { createClient } from '@supabase/supabase-js';

// الحصول على متغيرات البيئة
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// مثال على إضافة بيانات
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
