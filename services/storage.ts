
import { Order, Customer } from '../types';

const ORDERS_KEY = 'cb_orders';
const CUSTOMERS_KEY = 'cb_customers';

export const storage = {
  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveOrder: (order: Order) => {
    const orders = storage.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    if (existingIndex > -1) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  deleteOrder: (id: string) => {
    const orders = storage.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.filter(o => o.id !== id)));
  },
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    if (existingIndex > -1) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },
  updateCustomerFromOrder: (order: Order) => {
    const customers = storage.getCustomers();
    let customer = customers.find(c => c.phone === order.customerPhone);
    if (!customer) {
      customer = {
        id: crypto.randomUUID(),
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
        lastMeasurements: order.measurements
      };
    } else {
      customer.name = order.customerName;
      customer.address = order.customerAddress;
      customer.lastMeasurements = order.measurements;
    }
    storage.saveCustomer(customer);
  }
};
