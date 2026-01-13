
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAction: () => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onQuickAction, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <Icons.Dashboard /> },
    { id: 'debtors', label: 'Đối tác', icon: <Icons.Users /> },
    { id: 'transactions', label: 'Giao dịch', icon: <Icons.Transactions /> },
    { id: 'settings', label: 'Cài đặt', icon: <Icons.Settings /> },
  ];

  const firstHalf = menuItems.slice(0, 2);
  const secondHalf = menuItems.slice(2);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Icons.Wallet />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SmartDebt</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <div className="pt-4">
             <button 
               onClick={onQuickAction}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-blue-400 hover:bg-slate-700 transition-all font-bold border border-slate-700/50"
             >
               <span className="text-lg"><Icons.Plus /></span>
               <span>Tạo giao dịch mới</span>
             </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-medium"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-3 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
        <header className="mb-4 md:mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex gap-2">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-xs md:text-base cursor-pointer" onClick={onLogout} title="Đăng xuất">
                AD
             </div>
          </div>
        </header>
        {children}
      </main>

      {/* Mobile Nav with Central FAB */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between px-2 py-1 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-1 justify-around">
          {firstHalf.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 transition-colors ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="relative -top-6 px-4">
          <button 
            onClick={onQuickAction}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-2xl border-4 border-white active:scale-90 transition-transform"
          >
            <Icons.Plus />
          </button>
        </div>

        <div className="flex flex-1 justify-around">
          {secondHalf.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 transition-colors ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
