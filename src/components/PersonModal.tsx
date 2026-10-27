import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { COLOR_PALETTE, AVATAR_OPTIONS } from '../data/defaultData';
import { X, UserPlus, Check, Sparkles } from 'lucide-react';

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: { name: string; avatar: string; color: string }) => void;
  initialPerson?: Person | null;
}

export const PersonModal: React.FC<PersonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPerson,
}) => {
  const isEditing = Boolean(initialPerson);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [color, setColor] = useState(COLOR_PALETTE[0].hex);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPerson) {
      setName(initialPerson.name);
      setAvatar(initialPerson.avatar || '👤');
      setColor(initialPerson.color || COLOR_PALETTE[0].hex);
      setError('');
    } else {
      setName('');
      // Default to a fun random or sequential avatar
      const randomAvatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
      const randomColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].hex;
      setAvatar(randomAvatar);
      setColor(randomColor);
      setError('');
    }
  }, [initialPerson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name for the person.');
      return;
    }
    if (trimmed.length > 30) {
      setError('Name is too long (max 30 characters).');
      return;
    }

    onSave({
      name: trimmed,
      avatar,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Person Details' : 'Add Household Member'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update name or style. All existing expense records remain intact.'
                  : 'Add a new member to record and track household expenses.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Live Bubble Preview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Live Bubble Preview
            </span>
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-sm transition-all duration-200"
              style={{
                borderColor: color,
                backgroundColor: `${color}15`,
              }}
            >
              <span className="text-xl">{avatar}</span>
              <span className="text-sm font-bold" style={{ color: color }}>
                {name.trim() || 'Person Name'}
              </span>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Person's Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Aaraj, Saroj, Asha, Papa, Priya"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium transition-all"
            />
            {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
          </div>

          {/* Color Picker Swatches */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Bubble Color
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_PALETTE.map((item) => {
                const isSelected = color === item.hex;
                return (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => setColor(item.hex)}
                    className="group relative flex items-center justify-center h-9 rounded-xl border transition-all cursor-pointer hover:scale-105"
                    style={{
                      backgroundColor: item.hex,
                      borderColor: isSelected ? '#0f172a' : 'transparent',
                    }}
                    title={item.name}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar / Profile Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Choose Profile Icon / Avatar
            </label>
            <div className="grid grid-cols-8 gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 max-h-36 overflow-y-auto">
              {AVATAR_OPTIONS.map((icon) => {
                const isSelected = avatar === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setAvatar(icon)}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-md ring-2 ring-emerald-500 scale-110'
                        : 'hover:bg-slate-200/60'
                    }`}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-sm font-bold text-white shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {isEditing ? 'Save Changes' : 'Create Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
