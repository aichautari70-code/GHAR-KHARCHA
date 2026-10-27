import React, { useRef, useState } from 'react';
import { Person, Expense } from '../types';
import { getPersonName } from '../utils/formatters';
import { Download, Upload, RotateCcw, X, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface DataToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  expenses: Expense[];
  currency: string;
  onImportData: (importedPeople: Person[], importedExpenses: Expense[]) => void;
  onResetDefaults: () => void;
}

export const DataToolsModal: React.FC<DataToolsModalProps> = ({
  isOpen,
  onClose,
  people,
  expenses,
  currency,
  onImportData,
  onResetDefaults,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Item Description', 'Amount', 'Currency', 'Paid By', 'Category', 'Payment Method', 'Notes'];
    const rows = expenses.map((e) => [
      e.id,
      e.date,
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      currency,
      `"${getPersonName(people, e.personId).replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.paymentMethod}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gharkharcha-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ message: 'CSV file exported successfully!', type: 'success' });
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      app: 'GharKharcha',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      currency,
      people,
      expenses,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gharkharcha-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ message: 'Full JSON backup downloaded!', type: 'success' });
  };

  // Import JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed.people) && Array.isArray(parsed.expenses)) {
          onImportData(parsed.people, parsed.expenses);
          setFeedback({
            message: `Successfully restored ${parsed.people.length} members and ${parsed.expenses.length} expenses!`,
            type: 'success',
          });
        } else {
          setFeedback({
            message: 'Invalid backup format. File must contain people and expenses arrays.',
            type: 'error',
          });
        }
      } catch (err) {
        setFeedback({
          message: 'Error reading JSON backup file. Please ensure it is a valid GharKharcha export.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data Tools & Backup</h3>
              <p className="text-xs text-slate-500">
                Export records to Excel/Sheets or create full offline backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Export CSV */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">Export as Spreadsheet (CSV)</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Download all {expenses.length} expenses with member names for Excel or Google Sheets.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer shrink-0 ml-3"
            >
              Download CSV
            </button>
          </div>

          {/* Export JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Full Household Backup (JSON)</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Includes all registered people, color palettes, avatars, and complete history.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition-colors cursor-pointer shrink-0 ml-3"
            >
              Export Backup
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <h4 className="text-sm font-bold text-slate-900">Restore from JSON Backup</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a previous GharKharcha backup file to restore records.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-xs font-bold text-sky-700 transition-colors cursor-pointer shrink-0 ml-3"
            >
              Upload File
            </button>
          </div>

          {/* Reset Defaults */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
            {!showResetConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Restore Default Data</h4>
                  <p className="text-[11px] text-slate-500">
                    Reset people to Aaraj, Saroj, Asha and load sample expenses.
                  </p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-bold text-rose-700">
                  Are you sure you want to restore the 3 default people (Aaraj, Saroj, Asha) and sample expenses?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onResetDefaults();
                      setShowResetConfirm(false);
                      setFeedback({ message: 'Default members and data restored!', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                  >
                    Yes, Reset Data
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
