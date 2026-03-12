
import React from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Users, 
  BarChart3,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'new-order', label: 'طلب جديد', icon: PlusCircle },
    { id: 'orders', label: 'الفواتير والطلبات', icon: FileText },
    { id: 'customers', label: 'العملاء', icon: Users },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed lg:static top-0 right-0 h-full w-64 bg-white border-l border-pink-100 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-pink-50 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-pink-700 tracking-wider" style={{ fontFamily: 'serif' }}>CUTE BASE</h1>
            <span className="text-xs text-pink-400 uppercase tracking-widest text-left">ABAYA</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewType);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-pink-50 text-pink-700 font-bold border border-pink-100 shadow-sm' 
                    : 'text-gray-500 hover:bg-pink-50/50 hover:text-pink-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-pink-700' : 'text-gray-400'} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
            <p className="text-xs text-pink-700 font-medium">نظام الفواتير الفاخر</p>
            <p className="text-[10px] text-pink-400 mt-1 italic">Cute Base Abaya v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
