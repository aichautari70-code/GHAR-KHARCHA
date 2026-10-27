import React from 'react';
import { HouseholdSummary } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Wallet, Award, Receipt, TrendingUp, Users } from 'lucide-react';

interface DashboardStatsProps {
  summary: HouseholdSummary;
  currency: string;
  activePeopleCount: number;
  onManagePeopleClick: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  summary,
  currency,
  activePeopleCount,
  onManagePeopleClick,
}) => {
  const { totalSpent, expenseCount, averageExpense, topContributor } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Spending */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Household Spent
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalSpent, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Across {expenseCount} recorded purchases
          </p>
        </div>
      </div>

      {/* Top Contributor */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Top Contributor
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div>
          {topContributor.person ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs"
                style={{
                  backgroundColor: `${topContributor.person.color}20`,
                  border: `1.5px solid ${topContributor.person.color}`,
                }}
              >
                {topContributor.person.avatar || '👤'}
              </div>
              <div className="overflow-hidden">
                <div className="text-base font-bold text-slate-900 truncate">
                  {topContributor.person.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {formatCurrency(topContributor.amount, currency)} (
                  {totalSpent > 0 ? Math.round((topContributor.amount / totalSpent) * 100) : 0}%)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 italic">No expenses yet</div>
          )}
        </div>
      </div>

      {/* Household Members */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Household Members
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activePeopleCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Contributing members</p>
          </div>
          <button
            onClick={onManagePeopleClick}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
          >
            Manage &rarr;
          </button>
        </div>
      </div>

      {/* Average Expense */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Average Per Purchase
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(averageExpense, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated across all logged items
          </p>
        </div>
      </div>
    </div>
  );
};
