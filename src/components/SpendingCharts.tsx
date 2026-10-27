import React from 'react';
import { HouseholdSummary } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES_CONFIG } from '../data/defaultData';
import { PieChart, Users, Tag } from 'lucide-react';

interface SpendingChartsProps {
  summary: HouseholdSummary;
  currency: string;
  onFilterPerson: (personId: string | null) => void;
  selectedPersonId: string | null;
  onFilterCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

export const SpendingCharts: React.FC<SpendingChartsProps> = ({
  summary,
  currency,
  onFilterPerson,
  selectedPersonId,
  onFilterCategory,
  selectedCategory,
}) => {
  const { personBreakdown, categoryBreakdown, totalSpent } = summary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Member Spending Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Spending by Member</h3>
                <p className="text-xs text-slate-500">
                  Who paid what towards household expenses
                </p>
              </div>
            </div>
            {selectedPersonId && (
              <button
                onClick={() => onFilterPerson(null)}
                className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {personBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No member expenses recorded yet
              </p>
            ) : (
              personBreakdown.map((item) => {
                const isSelected = selectedPersonId === item.person.id;
                return (
                  <div
                    key={item.person.id}
                    onClick={() => onFilterPerson(isSelected ? null : item.person.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{item.person.avatar || '👤'}</span>
                        <span className="text-xs font-bold text-slate-900">
                          {item.person.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({item.count} items)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(item.amount, currency)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.person.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {totalSpent > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Every expense is attributed directly to the member who paid.</span>
            <span className="font-semibold text-slate-700">Total: {formatCurrency(totalSpent, currency)}</span>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Expense by Category</h3>
                <p className="text-xs text-slate-500">
                  Where household money is being spent
                </p>
              </div>
            </div>
            {selectedCategory && (
              <button
                onClick={() => onFilterCategory(null)}
                className="text-xs text-amber-600 hover:underline font-semibold cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No category data available yet
              </p>
            ) : (
              categoryBreakdown.map((item) => {
                const config = CATEGORIES_CONFIG[item.category] || {
                  icon: '📦',
                  color: '#64748b',
                  bgColor: '#f1f5f9',
                };
                const isSelected = selectedCategory === item.category;

                return (
                  <div
                    key={item.category}
                    onClick={() => onFilterCategory(isSelected ? null : item.category)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{config.icon}</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({item.count})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(item.amount, currency)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium ml-1">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: config.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Click any category to filter the list below</span>
          <span className="font-semibold text-slate-700">{categoryBreakdown.length} active categories</span>
        </div>
      </div>
    </div>
  );
};
