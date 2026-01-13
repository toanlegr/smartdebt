
export enum TransactionType {
  DEBT_INCREASE = 'INCREASE', // Cho nợ thêm / Phát sinh nợ mới
  DEBT_DECREASE = 'DECREASE'  // Trả bớt / Thu hồi nợ
}

export enum DebtorType {
  CUSTOMER = 'CUSTOMER', // Khách hàng (Phải thu)
  SUPPLIER = 'SUPPLIER'  // Nhà cung cấp (Phải trả)
}

export interface Transaction {
  id: string;
  debtorId: string;
  amount: number;
  date: string;
  type: TransactionType;
  note: string;
}

export interface Debtor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: DebtorType;
  totalBalance: number; // Positive means we are owed (customer) or we owe (supplier)
  lastUpdated: string;
}

export interface AppState {
  debtors: Debtor[];
  transactions: Transaction[];
}
