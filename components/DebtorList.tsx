
import React, { useState } from 'react';
import { Debtor, DebtorType, Transaction, TransactionType } from '../types';
import { Icons } from '../constants';

interface DebtorListProps {
  debtors: Debtor[];
  transactions: Transaction[];
  onAdd: (debtor: Omit<Debtor, 'id' | 'totalBalance' | 'lastUpdated'>) => void;
  onDelete: (id: string) => void;
}

const removeVietnameseTones = (str: string) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const DebtorList: React.FC<DebtorListProps> = ({ debtors, transactions, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [newDebtor, setNewDebtor] = useState({
    name: '',
    phone: '',
    email: '',
    type: DebtorType.CUSTOMER
  });

  const filteredDebtors = debtors.filter(d => {
    const searchStr = removeVietnameseTones(filter);
    const nameStr = removeVietnameseTones(d.name);
    const phoneStr = d.phone || "";
    return nameStr.includes(searchStr) || phoneStr.includes(filter);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtor.name) {
      alert("Vui lòng nhập tên đối tác");
      return;
    }
    onAdd(newDebtor);
    setShowModal(false);
    setNewDebtor({ name: '', phone: '', email: '', type: DebtorType.CUSTOMER });
  };

  // UI for Detail View
  if (selectedDebtorId) {
    const debtor = debtors.find(d => d.id === selectedDebtorId);
    const debtorTransactions = transactions
      .filter(t => t.debtorId === selectedDebtorId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!debtor) {
      setSelectedDebtorId(null);
      return null;
    }

    return (
      <div className="space-y-4 animate-in slide-in-from-right duration-300 max-w-full overflow-hidden">
        <button 
          onClick={() => setSelectedDebtorId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-2 px-1"
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
        </button>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl md:text-2xl font-black border-4 shadow-sm ${
              debtor.type === DebtorType.CUSTOMER ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {debtor.name.split(' ').pop()?.charAt(0) || debtor.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 truncate">{debtor.name}</h2>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  debtor.type === DebtorType.CUSTOMER ? 'text-indigo-600 border-indigo-200 bg-indigo-50' : 'text-amber-700 border-amber-200 bg-amber-50'
                }`}>
                  {debtor.type === DebtorType.CUSTOMER ? 'Khách hàng' : 'Nhà cung cấp'}
                </span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <i className="fa-solid fa-phone"></i> {debtor.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-4 rounded-2xl shadow-xl shadow-slate-200 md:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Số dư hiện tại</p>
            <p className={`text-xl md:text-2xl font-black whitespace-nowrap ${debtor.totalBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(debtor.totalBalance)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Lịch sử đối soát</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
              {debtorTransactions.length} giao dịch
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
            {debtorTransactions.length > 0 ? debtorTransactions.map((tx) => (
              <div key={tx.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Date Column */}
                  <div className="flex flex-col items-center justify-center min-w-[45px] py-1 px-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{new Date(tx.date).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">{new Date(tx.date).getDate()}</span>
                  </div>
                  
                  {/* Info Column */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded leading-none ${
                        tx.type === TransactionType.DEBT_INCREASE 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {tx.type === TransactionType.DEBT_INCREASE ? 'Ghi nợ' : 'Thanh toán'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-snug truncate">
                      {tx.note || (tx.type === TransactionType.DEBT_INCREASE ? 'Phát sinh nợ mới' : 'Khách đã trả tiền')}
                    </p>
                  </div>
                </div>

                {/* Amount Column */}
                <div className="text-right flex-shrink-0">
                  <div className={`flex items-center justify-end gap-1 text-sm md:text-base font-black ${
                    tx.type === TransactionType.DEBT_INCREASE ? 'text-slate-900' : 'text-emerald-600'
                  }`}>
                    {tx.type === TransactionType.DEBT_DECREASE ? <i className="fa-solid fa-minus text-[10px]"></i> : <i className="fa-solid fa-plus text-[10px] opacity-30"></i>}
                    {formatCurrency(tx.amount)}
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5">
                    Hoàn tất
                  </p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 text-2xl">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <p className="text-slate-400 text-sm font-medium">Chưa có giao dịch nào được ghi nhận</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer info */}
        <div className="p-4 text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             <i className="fa-solid fa-lock mr-1"></i> Dữ liệu được bảo mật & lưu cục bộ
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-full overflow-hidden">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-2 md:p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            <Icons.Search />
          </span>
          <input 
            type="text" 
            placeholder="Tìm tên (không dấu), SĐT..." 
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all bg-slate-50/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 whitespace-nowrap"
        >
          <Icons.Plus /> <span className="">Thêm đối tác</span>
        </button>
      </div>

      {/* Condensed List View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filteredDebtors.length > 0 ? filteredDebtors.map((debtor) => (
            <div 
              key={debtor.id} 
              onClick={() => setSelectedDebtorId(debtor.id)}
              className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50/80 transition-all group relative overflow-hidden cursor-pointer gap-2"
            >
              {/* Vertical Color Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                debtor.type === DebtorType.CUSTOMER ? 'bg-indigo-500' : 'bg-amber-500'
              }`} />

              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-black border-2 transition-transform group-hover:scale-105 ${
                  debtor.type === DebtorType.CUSTOMER 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {debtor.name.split(' ').pop()?.charAt(0) || debtor.name.charAt(0)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="text-sm md:text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">{debtor.name}</h4>
                    <span className={`flex-shrink-0 text-[8px] md:text-[9px] font-black uppercase px-1.5 py-0.5 rounded border leading-none ${
                      debtor.type === DebtorType.CUSTOMER 
                      ? 'text-indigo-500 border-indigo-100 bg-indigo-50/30' 
                      : 'text-amber-600 border-amber-100 bg-amber-50/30'
                    }`}>
                      {debtor.type === DebtorType.CUSTOMER ? 'KH' : 'NCC'}
                    </span>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 mt-1 font-bold truncate uppercase tracking-tighter">
                    <i className="fa-solid fa-phone text-[9px] mr-1"></i> {debtor.phone || 'Chưa có SĐT'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right flex-shrink-0">
                <div className="min-w-0">
                  <p className="text-[9px] uppercase font-black text-slate-300 leading-none mb-1 tracking-widest">Số dư</p>
                  <p className={`text-sm md:text-lg font-black tracking-tight whitespace-nowrap ${debtor.totalBalance > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {formatCurrency(debtor.totalBalance)}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm(`Bạn có chắc muốn xóa đối tác ${debtor.name}?`)) onDelete(debtor.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-200 hover:bg-rose-50 hover:text-rose-500 transition-all md:opacity-0 md:group-hover:opacity-100 border border-transparent hover:border-rose-100"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 text-3xl">
                <i className="fa-solid fa-user-slash"></i>
              </div>
              <p className="text-slate-400 text-sm font-medium">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-7 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Thêm đối tác mới</h3>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên hiển thị *</label>
                <input 
                  required
                  autoFocus
                  className="w-full px-5 py-3 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-bold"
                  value={newDebtor.name}
                  onChange={e => setNewDebtor({...newDebtor, name: e.target.value})}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Liên hệ</label>
                <input 
                  type="tel"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-bold"
                  value={newDebtor.phone}
                  onChange={e => setNewDebtor({...newDebtor, phone: e.target.value})}
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Loại đối tác</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewDebtor({...newDebtor, type: DebtorType.CUSTOMER})}
                    className={`py-3.5 rounded-2xl border-2 font-black text-xs transition-all ${newDebtor.type === DebtorType.CUSTOMER ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-100'}`}
                  >
                    Khách hàng
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewDebtor({...newDebtor, type: DebtorType.SUPPLIER})}
                    className={`py-3.5 rounded-2xl border-2 font-black text-xs transition-all ${newDebtor.type === DebtorType.SUPPLIER ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-100' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-100'}`}
                  >
                    Nhà cung cấp
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtorList;
