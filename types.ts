
export enum OrderStatus {
  IN_PROGRESS = 'قيد التنفيذ',
  READY = 'جاهز',
  SHIPPED = 'تم الشحن',
  DELIVERED = 'تم التسليم'
}

export interface Measurements {
  sleeveFromNeck: string;
  arms: string;
  bust: string;
  sleeveWidth: string;
  waist: string;
  abayaLength: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  lastMeasurements?: Measurements;
}

export interface Order {
  id: string;
  orderNo: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  abayaNo: string;
  designName: string;
  color: string;
  fabric: string;
  notes: string;
  measurements: Measurements;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  discount: number;
  shipping: number;
  status: OrderStatus;
  createdAt: number;
  imageUrl?: string; // صورة التصميم أو المنتج
  estimatedDeliveryDate?: string; // التاريخ المتوقع للاستلام
}

export type ViewType = 'dashboard' | 'new-order' | 'orders' | 'customers' | 'reports' | 'tracking';
