
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Debtor, Transaction, DebtorType } from '../types';
import { Icons, COLORS } from '../constants';

interface DashboardProps {
  debtors: Debtor[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ debtors, transactions }) => {
  const totalReceivable = debtors
    .filter(d => d.type === DebtorType.CUSTOMER)
    .reduce((acc, d) => acc + d.totalBalance, 0);

  const totalPayable = debtors
    .filter(d => d.type === DebtorType.SUPPLIER)
    .reduce((acc, d) => acc + d.totalBalance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND'
    }).format(amount);
  };

  const pieData = [
    { name: 'Phải thu', value: totalReceivable, color: COLORS.success },
    { name: 'Phải trả', value: totalPayable, color: COLORS.danger },
  ];

  const trendData = [
    { name: 'T2', amount: 4000000 },
    { name: 'T3', amount: 3000000 },
    { name: 'T4', amount: 2000000 },
    { name: 'T5', amount: 2780000 },
    { name: 'T6', amount: 1890000 },
    { name: 'T7', amount: 2390000 },
    { name: 'CN', amount: 3490000 },
  ];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards - 2 cols on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm">
               <Icons.ArrowUp />
            </div>
          </div>
          <h3 className="text-slate-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">Phải thu</h3>
          <p className="text-sm md:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalReceivable)}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center text-sm">
               <Icons.ArrowDown />
            </div>
          </div>
          <h3 className="text-slate-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">Phải trả</h3>
          <p className="text-sm md:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalPayable)}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2 lg:col-span-1">
          <h3 className="text-slate-500 text-[10px] md:text-sm font-medium uppercase tracking-wider">Số dư ròng</h3>
          <p className={`text-lg md:text-xl font-bold mt-1 ${totalReceivable - totalPayable >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatCurrency(totalReceivable - totalPayable)}
          </p>
        </div>
      </div>

      {/* Charts Section - Stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-4">Phát sinh 7 ngày</h3>
          <div className="h-40 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                  formatter={(value: number) => [new Intl.NumberFormat('vi-VN').format(value), '']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-4 w-full">Cơ cấu nợ</h3>
          <div className="h-40 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[10px] text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-bold text-slate-800">Giao dịch mới</h3>
          <button className="text-xs text-blue-600 font-bold">Xem tất cả</button>
        </div>
        <div className="divide-y divide-slate-50">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  tx.type === 'INCREASE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {tx.type === 'INCREASE' ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-800 leading-none">
                    {debtors.find(d => d.id === tx.debtorId)?.name || 'N/A'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs md:text-sm font-bold ${tx.type === 'INCREASE' ? 'text-slate-900' : 'text-emerald-600'}`}>
                  {tx.type === 'DECREASE' ? '-' : ''}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
