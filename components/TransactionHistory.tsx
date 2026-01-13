
import React from 'react';
import { Transaction, Debtor, TransactionType } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  debtors: Debtor[];
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onQuickAddDebtor: (debtor: Omit<Debtor, 'id' | 'totalBalance' | 'lastUpdated'>) => string;
  onOpenModal: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, debtors, onOpenModal }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-sm md:text-lg font-bold text-slate-800">Lịch sử giao dịch</h3>
          <button 
            onClick={onOpenModal}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold"
          >
            Mới +
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Đối tác</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Loại</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? [...transactions].reverse().map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800 text-xs md:text-sm">
                      {debtors.find(d => d.id === tx.debtorId)?.name || 'N/A'}
                    </p>
                    <p className="text-[10px] text-slate-400 md:hidden mt-0.5">
                       {tx.type === TransactionType.DEBT_INCREASE ? 'Ghi nợ' : 'Trả nợ'}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.type === TransactionType.DEBT_INCREASE ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                       {tx.type === TransactionType.DEBT_INCREASE ? 'Tăng nợ' : 'Thanh toán'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold text-sm md:text-base ${
                    tx.type === TransactionType.DEBT_INCREASE ? 'text-slate-900' : 'text-emerald-600'
                  }`}>
                    {tx.type === TransactionType.DEBT_DECREASE ? '-' : ''}{new Intl.NumberFormat('vi-VN').format(tx.amount)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400">
                     <p className="text-sm">Chưa có lịch sử giao dịch.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
