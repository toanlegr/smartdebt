
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DebtorList from './components/DebtorList';
import TransactionHistory from './components/TransactionHistory';
import Settings from './components/Settings';
import TransactionFormModal from './components/TransactionFormModal';
import LoginPage from './components/LoginPage';
import { AppState, Debtor, Transaction, TransactionType } from './types';

const INITIAL_STATE: AppState = {
  debtors: [
    { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', type: 'CUSTOMER' as any, totalBalance: 5000000, lastUpdated: new Date().toISOString() },
    { id: '2', name: 'Công ty TNHH MTV X', phone: '0283888888', type: 'SUPPLIER' as any, totalBalance: 12000000, lastUpdated: new Date().toISOString() },
  ],
  transactions: [
    { id: 't1', debtorId: '1', amount: 5000000, date: new Date().toISOString(), type: TransactionType.DEBT_INCREASE, note: 'Bán hàng đợt 1' }
  ]
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('smartdebt_logged_in') === 'true';
  });
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smartdebt_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('smartdebt_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('smartdebt_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  const addDebtor = (newDebtor: Omit<Debtor, 'id' | 'totalBalance' | 'lastUpdated'>): string => {
    const id = crypto.randomUUID();
    const debtor: Debtor = {
      ...newDebtor,
      id,
      totalBalance: 0,
      lastUpdated: new Date().toISOString()
    };
    setState(prev => ({ ...prev, debtors: [...prev.debtors, debtor] }));
    return id;
  };

  const deleteDebtor = (id: string) => {
    setState(prev => ({
      ...prev,
      debtors: prev.debtors.filter(d => d.id !== id),
      transactions: prev.transactions.filter(t => t.debtorId !== id)
    }));
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: crypto.randomUUID()
    };

    setState(prev => {
      const updatedDebtors = prev.debtors.map(d => {
        if (d.id === txData.debtorId) {
          const change = txData.type === TransactionType.DEBT_INCREASE ? txData.amount : -txData.amount;
          return {
            ...d,
            totalBalance: d.totalBalance + change,
            lastUpdated: new Date().toISOString()
          };
        }
        return d;
      });

      return {
        ...prev,
        debtors: updatedDebtors,
        transactions: [...prev.transactions, newTx]
      };
    });
  };

  const handleImportData = (newData: AppState) => {
    if (confirm("Lưu ý: Dữ liệu hiện tại sẽ bị thay thế bởi file nhập vào. Bạn có chắc chắn?")) {
      setState(newData);
      alert("Đã nhập dữ liệu thành công!");
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onQuickAction={() => setIsTxModalOpen(true)}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && (
        <Dashboard debtors={state.debtors} transactions={state.transactions} />
      )}
      {activeTab === 'debtors' && (
        <DebtorList 
          debtors={state.debtors} 
          transactions={state.transactions}
          onAdd={addDebtor} 
          onDelete={deleteDebtor} 
        />
      )}
      {activeTab === 'transactions' && (
        <TransactionHistory 
          transactions={state.transactions} 
          debtors={state.debtors} 
          onAdd={addTransaction} 
          onQuickAddDebtor={addDebtor}
          onOpenModal={() => setIsTxModalOpen(true)}
        />
      )}
      {activeTab === 'settings' && (
        <Settings 
          state={state} 
          onImport={handleImportData} 
        />
      )}

      <TransactionFormModal 
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        debtors={state.debtors}
        onAdd={addTransaction}
        onQuickAddDebtor={addDebtor}
      />
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
