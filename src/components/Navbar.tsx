import React from 'react';
import { Home, Users, Plus, Download, Coins } from 'lucide-react';

interface NavbarProps {
  currency: string;
  onChangeCurrency: (newCurrency: string) => void;
  onOpenManagePeople: () => void;
  onOpenAddExpense: () => void;
  onOpenDataTools: () => void;
}

const CURRENCIES = [
  { symbol: 'Rs.', label: 'Rs. (NPR/PKR)' },
  { symbol: '₹', label: '₹ (INR)' },
  { symbol: '$', label: '$ (USD)' },
  { symbol: '€', label: '€ (EUR)' },
  { symbol: '£', label: '£ (GBP)' },
  { symbol: 'AED', label: 'AED (Dirham)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onChangeCurrency,
  onOpenManagePeople,
  onOpenAddExpense,
  onOpenDataTools,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Home className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg font-display">
                GharKharcha
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                घरखर्च
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Household Expense & Member Contribution Tracker
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Currency selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-bold pl-2.5 pr-6 py-2 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              title="Select Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.label}
                </option>
              ))}
            </select>
            <Coins className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Backup / Export button */}
          <button
            onClick={onOpenDataTools}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5"
            title="Backup & Export Data"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Backup / Export</span>
          </button>

          {/* Manage People button */}
          <button
            onClick={onOpenManagePeople}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">People</span>
          </button>

          {/* Add Expense Primary Button */}
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
