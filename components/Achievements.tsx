import React from 'react';
import { Trophy, Lock, CheckCircle2, X } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, isOpen, onClose }) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <Trophy className="text-yellow-500" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">成就列表</h2>
              <p className="text-xs text-slate-400">进度: {unlockedCount} / {achievements.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                achievement.unlocked 
                  ? 'bg-slate-800/60 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]' 
                  : 'bg-slate-800/20 border-slate-800 opacity-60 grayscale'
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-500'
              }`}>
                {achievement.unlocked ? <Trophy size={20} /> : <Lock size={20} />}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold ${achievement.unlocked ? 'text-yellow-100' : 'text-slate-400'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-slate-500 leading-tight mt-1">
                  {achievement.description}
                </p>
              </div>

              {achievement.unlocked && (
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;