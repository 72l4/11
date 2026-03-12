
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ViewType, Order, Customer } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Reports from './components/Reports';
import CustomerList from './components/CustomerList';
import InvoiceView from './components/InvoiceView';
import TrackingView from './components/TrackingView';
import { storage } from './services/storage';
import { Menu } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [printingOrder, setPrintingOrder] = useState<Order | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('new-order');
  };

  const handleCreateForCustomer = (customer: Customer) => {
    const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString();
    const newOrder: Partial<Order> = {
      id: newId,
      orderNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      measurements: customer.lastMeasurements || {
        sleeveFromNeck: '',
        arms: '',
        bust: '',
        sleeveWidth: '',
        waist: '',
        abayaLength: ''
      },
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      discount: 0,
      shipping: 0,
      status: 'قيد التنفيذ' as any,
      createdAt: Date.now()
    };
    setSelectedOrder(newOrder as Order);
    setCurrentView('new-order');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-order':
        return (
          <OrderForm 
            key={selectedOrder?.id || 'new'} 
            initialOrder={selectedOrder} 
            onComplete={() => {
              setSelectedOrder(undefined);
              setCurrentView('orders');
            }} 
            onPrint={(order) => setPrintingOrder(order)}
          />
        );
      case 'orders':
        return <OrderList onEdit={handleEditOrder} onPrint={(order) => setPrintingOrder(order)} />;
      case 'customers':
        return <CustomerList onSelectCustomer={handleCreateForCustomer} />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar 
        currentView={currentView} 
        setView={(view) => {
          if (view === 'new-order' && currentView !== 'new-order') {
            setSelectedOrder(undefined);
          }
          setCurrentView(view);
        }} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="lg:hidden mb-8 flex items-center justify-between">
           <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white border border-pink-100 rounded-2xl text-pink-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-pink-700 uppercase tracking-widest" style={{ fontFamily: 'serif' }}>CUTE BASE</h1>
            <span className="text-[10px] text-pink-300 -mt-1 tracking-[0.4em] uppercase">ABAYA</span>
          </div>
          <div className="w-10"></div>
        </header>

        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderView()}
        </div>
      </main>

      {printingOrder && (
        <InvoiceView order={printingOrder} onClose={() => setPrintingOrder(undefined)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/track/:orderId" element={<TrackingView />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
