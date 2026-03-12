📋 **خطوات الإعداد النهائي في Supabase**

## 🔗 الخطوة 1: دخول Supabase

1. اذهب إلى: https://supabase.com
2. سجل دخول بحسابك
3. افتح مشروعك: **CuteBaseDB NANO**

---

## 🗂️ الخطوة 2: إنشاء جدول الطلبات

1. من الجزء الأيسر → **SQL Editor**
2. انقر **New Query**
3. انسخ والصق الكود التالي:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  abaya_no TEXT NOT NULL,
  design_name TEXT,
  color TEXT,
  fabric TEXT,
  notes TEXT,
  sleeve_from_neck TEXT,
  arms TEXT,
  bust TEXT,
  sleeve_width TEXT,
  waist TEXT,
  abaya_length TEXT,
  total_amount NUMERIC,
  paid_amount NUMERIC DEFAULT 0,
  remaining_amount NUMERIC,
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'قيد التنفيذ',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- indices للتحسين
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(date);

-- إنشاء جدول العملاء (اختياري)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. انقر **Execute** ✅

---

## 🔓 الخطوة 3: إعدادات الأمان (Row Level Security)

اتبع هذه الخطوات لجعل صفحة التتبع تعمل بدون تسجيل دخول:

### أ) تفعيل RLS

1. المقائمة اليسرى → **Authentication** → **Policies**
2. اختر جدول **orders**
3. انقر **Enable RLS** (إذا لم تكن مُفعلة)

### ب) إضافة Policy للقراءة العامة

1. انقر **New Policy**
2. اختر **For SELECT**
3. اسم السياسة: `Allow public read orders`
4. ضع هذا في الـ Policy expression:

```sql
true
```

5. انقر **Save** ✅

### ج) إضافة Policy للإدراج والتحديث (للمسؤول فقط - اختياري الآن)

يمكنك تخطي هذا الآن والتركيز على القراءة العامة.

---

## ✅ الخطوة 4: اختبار الاتصال

1. ارجع إلى الموقع
2. المتصفح → **F12** (فتح Developer Tools)
3. اذهب إلى **Console**
4. قم بإنشاء طلب جديد من الموقع واضغط **حفظ الطلب**
5. يجب أن ترى في الـ console:
   - ✅ الطلب حُفظ بنجاح (في localStorage و Supabase)

---

## 🧪 الخطوة 5: اختبار صفحة التتبع

### طريقة الاختبار:

1. **انشئ طلب** من الموقع:
   - ادخل بيانات واهمية (مثلاً: أحمد - 123456789)
   - اضغط حفظ
   - سيظهر الطلب في القائمة

2. **انسخ الرابط** من صفحة الطلب (يجب أن يكون مثل):
   ```
   https://yoursite.com/track/abc123-def456-ghi789
   ```

3. **اختبر الرابط**:
   - افتحه في متصفح جديد (متخفي أو في device آخر)
   - يجب أن ترى بيانات الطلب بدون طلب لتسجيل دخول ✅

4. **تحديث من Supabase**:
   - ارجع للموقع الإداري
   - عدّل حالة الطلب من "قيد التنفيذ" إلى "جاهز"
   - ارجع إلى صفحة التتبع وأعد تحميل الصفحة
   - يجب أن ترى الحالة الجديدة ✏️

---

## 📊 عرض البيانات في Supabase

للتحقق من البيانات المُحفوظة:

1. المقائمة اليسرى → **Table Editor**
2. اختر **orders**
3. يجب أن ترى صفوف الطلبات التي أنشأتها

---

## ⚠️ تنبيهات مهمة:

1. **متغيرات البيئة**: تأكد من أنك أضفت:
   ```
   VITE_SUPABASE_URL=https://xnvuaqynncrdbsfmvrhq.supabase.co
   VITE_SUPABASE_ANON_KEY=xnvuaqynncrdbsfmvrhq
   ```

2. **إعادة تشغيل الموقع**: بعد تغيير `.env.local` يجب إعادة تشغيل الخادم

3. **الخصوصية**: تأكد من عدم تسريب مفتاح السر (VITE_SUPABASE_ANON_KEY مُتاح علناً وهذا طبيعي، لكن الـ Service Role Key يجب إخفاؤه)

---

## 🚀 الخطوات التالية:

- [ ] اختبر إنشاء طلب من الموقع
- [ ] اختبر التحديث من لوحة التحكم
- [ ] اختبر صفحة التتبع برابط عام
- [ ] جرّب تغيير الحالة ورؤيتها تتحديث في صفحة التتبع

✨ كل شيء جاهز!
