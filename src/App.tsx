
import React, { useEffect, useState, useMemo } from 'react';
import { Wallet, Plus, Sparkles, RefreshCw, Search, Trash2, TrendingUp } from 'lucide-react';
import { Transaction, FinancialInsights, TrendDataPoint, CategoryDataPoint } from './types';
// Add missing importCSV to the service imports
import { fetchTransactions, addTransaction, deleteTransaction, fetchSpendingTrend, fetchCategoryDistribution, importCSV } from './services/transactionService';
import { generateInsights } from './services/geminiService';
import { CategoryGrid, SpendingTrend } from './components/Charts';
import { TransactionModal } from './components/TransactionModal';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [insights, setInsights] = useState<FinancialInsights | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAll = async () => {
    setLoading(true);
    const [t, trend, dist] = await Promise.all([
      fetchTransactions(),
      fetchSpendingTrend(),
      fetchCategoryDistribution()
    ]);
    setTransactions(t);
    setTrendData(trend);
    setCategoryData(dist);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (transactions.length > 0) generateInsights(transactions).then(setInsights);
    }, 1500);
    return () => clearTimeout(timer);
  }, [transactions]);

  const filtered = useMemo(() => 
    transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [transactions, searchTerm]
  );

  const total = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl"><Wallet className="text-white" size={24} /></div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinSight <span className="text-indigo-600">AI</span></h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-black transition-all shadow-lg shadow-slate-200">
            <Plus size={18} /><span>Add Transaction</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Spending</h3>
            <p className="text-3xl font-black text-slate-900">₹{total.toLocaleString('en-IN')}</p>
          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-xl relative overflow-hidden text-white">
            <Sparkles className="absolute -right-4 -top-4 opacity-10 w-32 h-32" />
            <div className="relative z-10">
              <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                <Sparkles size={14} className="mr-2" />AI Intelligent Summary
              </h3>
              <p className="text-lg font-medium leading-relaxed italic">
                {insights?.summary || "Analyzing your patterns... add more transactions for better insights."}
              </p>
            </div>
          </div>
        </div>

        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center"><TrendingUp size={20} className="mr-2 text-indigo-500" />Spending Timeline</h2>
          </div>
          <SpendingTrend data={trendData} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center"><RefreshCw size={20} className="mr-2 text-indigo-500" />Category Distributions</h2>
          <CategoryGrid data={categoryData} />
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold">Transaction Ledger</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search description..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{t.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteTransaction(t.id).then(loadAll)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={data => addTransaction(data).then(loadAll)} onImport={text => importCSV(text).then(loadAll)} />
    </div>
  );
}

export default App;
