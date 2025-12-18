import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Category } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { date: string; description: string; amount: number; category?: Category }) => Promise<void>;
  onImport: (csvText: string) => Promise<void>;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onAdd, onImport }) => {
  const [mode, setMode] = useState<'manual' | 'import'>('manual');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'manual') {
        await onAdd({
          date,
          description,
          amount: parseFloat(amount),
        });
      } else if (mode === 'import' && csvFile) {
        const text = await csvFile.text();
        await onImport(text);
      }
      onClose();
      // Reset form
      setDescription('');
      setAmount('');
      setCsvFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex space-x-4">
            <button 
              onClick={() => setMode('manual')}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'manual' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Manual Entry
            </button>
            <button 
              onClick={() => setMode('import')}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'import' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Import CSV
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'manual' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Swiggy, Uber, Rent"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={e => setCsvFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                {csvFile ? csvFile.name : "Click to upload CSV"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Format: Date, Description, Amount</p>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || (mode === 'import' && !csvFile)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                mode === 'manual' ? 'Add Transaction' : 'Import Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};