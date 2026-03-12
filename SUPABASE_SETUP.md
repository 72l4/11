🌸 **قاعدة البيانات السحابية - Supabase Integration**

## ✅ ماتم إنجازه:

### 1️⃣ **التثبيت**
- ✔️ تثبيت مكتبة `@supabase/supabase-js`
- ✔️ إضافة متغيرات البيئة في `.env.local`

### 2️⃣ **الملفات المعدلة**

#### **services/supabase.ts** 
- ✔️ إنشاء عميل Supabase
- ✔️ دوال عامة: `insertData`, `fetchData`, `updateData`, `deleteData`
- ✔️ دوال متخصصة للطلبات:
  - `createOrder()` - إنشاء طلب جديد
  - `updateOrder()` - تحديث حالة الطلب والمبالغ
  - `getOrderById()` - جلب طلب واحد (للتتبع)
  - `getAllOrders()` - جلب جميع الطلبات

#### **components/OrderForm.tsx** ✏️
- ✔️ استيراد `createOrder` و `updateOrder` من supabase
- ✔️ تعديل `handleSave()` لحفظ في Supabase
- ✔️ الحفظ أيضاً في localStorage للتوافقية

#### **components/TrackingView.tsx** ✏️
- ✔️ استيراد `getOrderById` من supabase
- ✔️ تعديل useEffect لجلب الطلب من Supabase بدلاً من localStorage
- ✔️ ✅ **الصفحة عامة (Public) وليست تحت حماية** - أي زبون يمكنه الدخول برابط التتبع

---

## 🗄️ **الجداول المطلوبة في Supabase**

### جدول `orders` (الطلبات)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  customer_id UUID REFERENCES customers(id),
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

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(date);
```

### جدول `customers` (اختياري - للمستقبل)

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 **متغيرات البيئة** (.env.local)

```
GEMINI_API_KEY=AIzaSyCicL6VB4YeyhCmTgkN6cTmCSCtdviLjBQ
VITE_SUPABASE_URL=https://xnvuaqynncrdbsfmvrhq.supabase.co
VITE_SUPABASE_ANON_KEY=xnvuaqynncrdbsfmvrhq
```

---

## 🔐 **الصلاحيات (RLS - Row Level Security)**

يجب إعداد Row Level Security في Supabase لضمان:

1. **الإدراج والتحديث**: فقط الإدمن (معك)
2. **القراءة**: أي شخص يمكنه قراءة بيانات طلبه بواسطة ID (public read)

### إنشاء policies في Supabase

```sql
-- السماح للجميع بقراءة الطلب عبر ID (للتتبع العام)
CREATE POLICY "Allow public order tracking"
ON orders FOR SELECT
USING (true);

-- السماح فقط للإدمن بالإدراج والتحديث والحذف (يتطلب authentication)
CREATE POLICY "Allow authenticated users to manage orders"
ON orders FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

---

## 📱 **كيف يعمل الآن:**

### ✅ المسؤول (أنت):
1. تفتح الموقع → `/admin`
2. تنشئ طلب جديد من صفحة "إنشاء فاتورة"
3. عند الحفظ:
   - 💾 يُحفظ في localStorage (للعرض الفوري)
   - ☁️ يُحفظ في Supabase (قاعدة البيانات السحابية)

### 👤 الزبون:
1. يستقبل رابط: `https://yoursite.com/track/e46b8d55-d3fd-4935-be38-fe54b302ec78`
2. يفتح الرابط → صفحة التتبع
3. يرى حالة طلبه الحية من Supabase
4. ✨ لا يمكنه تغيير أي بيانات (قراءة فقط)

---

## 🚀 **التعديلات المخطط لها مستقبلاً:**

- [ ] إضافة جدول العملاء في Supabase
- [ ] مزامنة الفاتورات الموجودة من localStorage إلى Supabase
- [ ] إنشاء لوحة معلومات للتحليلات
- [ ] إضافة إشعارات email للزبائن عند تحديث الطلب
- [ ] إنشاء API للجوال

---

## 📞 **الدعم والمشاكل:**

إذا واجهت مشكلة:
1. تأكد من أن متغيرات البيئة صحيحة
2. تحقق من الكونسول (F12 → Console) للأخطاء
3. تأكد من أن جداول Supabase مُنشأة

✨ كل شيء جاهز الآن!
