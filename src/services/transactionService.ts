import { Transaction, Category, TrendDataPoint, CategoryDataPoint } from '../types';
import { categorizeTransaction } from './geminiService';

const STORAGE_KEY = 'finsight_transactions';

const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await new Promise(r => setTimeout(r, 200));
  return getStoredTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const fetchSpendingTrend = async (): Promise<TrendDataPoint[]> => {
  const transactions = getStoredTransactions();
  if (transactions.length === 0) return [];

  const summary = transactions.reduce((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(summary)
    .sort()
    .map(dateStr => ({
      date: new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      amount: summary[dateStr],
      fullDate: dateStr
    }));
};

export const fetchCategoryDistribution = async (): Promise<CategoryDataPoint[]> => {
  const transactions = getStoredTransactions();
  if (transactions.length === 0) return [];

  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0, transactions: [] };
    acc[t.category].value += t.amount;
    acc[t.category].transactions.push(t);
    return acc;
  }, {} as Record<string, CategoryDataPoint>);

  return Object.values(grouped).sort((a, b) => b.value - a.value);
};

export const addTransaction = async (data: Omit<Transaction, 'id' | 'category'>): Promise<void> => {
  const txs = getStoredTransactions();
  const category = await categorizeTransaction(data.description, data.amount);
  const newTx: Transaction = { ...data, id: crypto.randomUUID(), category };
  saveTransactions([newTx, ...txs]);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const txs = getStoredTransactions();
  saveTransactions(txs.filter(t => t.id !== id));
};

export const importCSV = async (text: string): Promise<void> => {
  const lines = text.split('\n').slice(1);
  const current = getStoredTransactions();
  const news: Transaction[] = [];

  for (const line of lines) {
    const [date, desc, amt] = line.split(',').map(s => s.trim());
    const amount = parseFloat(amt);
    if (date && desc && !isNaN(amount)) {
      const category = await categorizeTransaction(desc, amount);
      news.push({ id: crypto.randomUUID(), date, description: desc, amount, category });
    }
  }
  saveTransactions([...news, ...current]);
};
