
import React, { useState } from 'react';
import { Transaction, Debtor, TransactionType, DebtorType } from '../types';
import { Icons } from '../constants';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtors: Debtor[];
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onQuickAddDebtor: (debtor: Omit<Debtor, 'id' | 'totalBalance' | 'lastUpdated'>) => string;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ isOpen, onClose, debtors, onAdd, onQuickAddDebtor }) => {
  const [showQuickDebtor, setShowQuickDebtor] = useState(false);
  const [newDebtorData, setNewDebtorData] = useState({ name: '', phone: '', type: DebtorType.CUSTOMER });
  
  const [newTx, setNewTx] = useState({
    debtorId: '',
    amount: 0,
    type: TransactionType.DEBT_INCREASE,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  // Helper to format raw number to string with dots for display
  const formatDisplay = (val: number): string => {
    if (val === 0) return '';
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  // Helper to strip non-numeric characters and get the number
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
    setNewTx({ ...newTx, amount: numericValue });
  };

  const handleQuickDebtor = () => {
    if (!newDebtorData.name) {
      alert("Vui lòng nhập tên đối tác");
      return;
    }
    const newId = onQuickAddDebtor(newDebtorData);
    setNewTx({ ...newTx, debtorId: newId });
    setShowQuickDebtor(false);
    setNewDebtorData({ name: '', phone: '', type: DebtorType.CUSTOMER });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.debtorId || newTx.amount <= 0) {
      alert("Vui lòng chọn đối tác và nhập số tiền lớn hơn 0");
      return;
    }
    onAdd(newTx);
    onClose();
    setNewTx({
      debtorId: '',
      amount: 0,
      type: TransactionType.DEBT_INCREASE,
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg md:text-xl font-bold">Ghi nhận giao dịch</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đối tác *</label>
            {!showQuickDebtor ? (
              <div className="flex gap-2">
                <select 
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm bg-slate-50"
                  value={newTx.debtorId}
                  onChange={e => setNewTx({...newTx, debtorId: e.target.value})}
                >
                  <option value="">-- Chọn --</option>
                  {debtors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.type === DebtorType.CUSTOMER ? 'Khách' : 'Nhà CC'})</option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={() => setShowQuickDebtor(true)}
                  className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 active:scale-90 transition-transform"
                  title="Thêm đối tác mới"
                >
                  <Icons.Plus />
                </button>
              </div>
            ) : (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-blue-700">Tạo đối tác nhanh</p>
                  <button type="button" onClick={() => setShowQuickDebtor(false)} className="text-xs text-blue-400 hover:text-blue-600">Huỷ</button>
                </div>
                <input 
                  placeholder="Tên đối tác (bắt buộc)..."
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newDebtorData.name}
                  onChange={e => setNewDebtorData({...newDebtorData, name: e.target.value})}
                />
                <input 
                  placeholder="Số điện thoại (không bắt buộc)..."
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newDebtorData.phone}
                  onChange={e => setNewDebtorData({...newDebtorData, phone: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     type="button"
                     onClick={() => setNewDebtorData({...newDebtorData, type: DebtorType.CUSTOMER})}
                     className={`py-1.5 rounded-lg border text-[10px] font-bold ${newDebtorData.type === DebtorType.CUSTOMER ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}
                   >
                     Khách hàng
                   </button>
                   <button 
                     type="button"
                     onClick={() => setNewDebtorData({...newDebtorData, type: DebtorType.SUPPLIER})}
                     className={`py-1.5 rounded-lg border text-[10px] font-bold ${newDebtorData.type === DebtorType.SUPPLIER ? 'bg-amber-600 text-white' : 'bg-white text-slate-500'}`}
                   >
                     Nhà cung cấp
                   </button>
                </div>
                <button 
                  type="button"
                  onClick={handleQuickDebtor}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold shadow-md active:scale-[0.98]"
                >
                  Xác nhận tạo
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => setNewTx({...newTx, type: TransactionType.DEBT_INCREASE})}
              className={`py-3 rounded-xl border text-xs font-bold transition-all ${newTx.type === TransactionType.DEBT_INCREASE ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 text-slate-500'}`}
            >
              Tăng nợ (+)
            </button>
            <button 
              type="button"
              onClick={() => setNewTx({...newTx, type: TransactionType.DEBT_DECREASE})}
              className={`py-3 rounded-xl border text-xs font-bold transition-all ${newTx.type === TransactionType.DEBT_DECREASE ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
            >
              Thanh toán (-)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số tiền *</label>
            <div className="relative">
              <input 
                type="text"
                inputMode="numeric"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-lg bg-slate-50"
                value={formatDisplay(newTx.amount)}
                onChange={handleAmountChange}
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">VNĐ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày</label>
              <input 
                type="date"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50"
                value={newTx.date}
                onChange={e => setNewTx({...newTx, date: e.target.value})}
              />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ghi chú</label>
               <input 
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50"
                value={newTx.note}
                onChange={e => setNewTx({...newTx, note: e.target.value})}
                placeholder="..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest">
              Xác nhận lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
