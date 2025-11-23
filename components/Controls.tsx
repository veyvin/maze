import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  RefreshCcw,
  Eye,
  EyeOff,
  Gauge,
  Trophy,
  Footprints
} from 'lucide-react';
import { Direction, Difficulty } from '../types';

interface ControlsProps {
  onMove: (dir: Direction) => void;
  onReset: () => void;
  onOpenAchievements: () => void;
  viewRadius: number;
  setViewRadius: (r: number) => void;
  showMist: boolean;
  setShowMist: (show: boolean) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  level: number;
  moveCount: number;
}

const Controls: React.FC<ControlsProps> = ({ 
  onMove, 
  onReset,
  onOpenAchievements,
  viewRadius, 
  setViewRadius,
  showMist,
  setShowMist,
  difficulty,
  setDifficulty,
  level,
  moveCount
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDiff = e.target.value as Difficulty;
    setDifficulty(newDiff);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 gap-4">
      {/* Stats Bar */}
      <div className="flex justify-between items-stretch bg-slate-800/80 backdrop-blur rounded-xl p-2 border border-slate-700 shadow-lg">
        {/* Level Info */}
        <div className="flex flex-col justify-center px-4 border-r border-slate-700/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">当前关卡</span>
          <span className="text-2xl font-black text-white font-mono leading-none mt-1">{level}</span>
        </div>

        {/* Prominent Move Counter */}
        <div className="flex-1 flex flex-col items-center justify-center mx-2 bg-slate-900/50 rounded-lg border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center gap-2 relative z-10">
            <Footprints size={14} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-500/80 uppercase tracking-wider font-bold">当前步数</span>
          </div>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-500 font-mono leading-none mt-1 shadow-emerald-500/20 drop-shadow-sm relative z-10">
            {moveCount}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pl-2">
          <button 
            onClick={onOpenAchievements}
            className="p-3 hover:bg-slate-700 rounded-lg transition-colors text-yellow-500 hover:text-yellow-400 group relative"
            aria-label="成就"
          >
            <Trophy size={22} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-lg transition-colors ${showSettings ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            aria-label="设置"
          >
            <Settings size={22} className={showSettings ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
          </button>
        </div>
      </div>

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-4 border border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-2 z-20">
          
          {/* Difficulty Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Gauge size={16} className="text-purple-400"/>
              <span>游戏难度</span>
            </div>
            <select 
              value={difficulty}
              onChange={handleDifficultyChange}
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="easy">简单 (地图较小)</option>
              <option value="normal">普通 (标准体验)</option>
              <option value="hard">困难 (巨大迷宫)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">视野半径</span>
              <span className="text-sm font-mono text-blue-400">{viewRadius} 格</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="8" 
              value={viewRadius} 
              onChange={(e) => setViewRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex justify-between items-center">
             <span className="text-sm font-medium text-slate-300">迷雾模式</span>
             <button 
               onClick={() => setShowMist(!showMist)}
               className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${showMist ? 'bg-slate-700 text-slate-200' : 'bg-blue-600 text-white'}`}
             >
               {showMist ? <EyeOff size={16} /> : <Eye size={16} />}
               {showMist ? '开启' : '关闭'}
             </button>
          </div>

          <button 
            onClick={() => { onReset(); setShowSettings(false); }}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <RefreshCcw size={16} />
            重置本关
          </button>
        </div>
      )}

      {/* D-Pad for Mobile */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] mx-auto mt-2 md:hidden">
        <div />
        <button 
          className="aspect-square bg-slate-700/80 active:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-colors border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
          onClick={() => onMove(Direction.UP)}
          aria-label="向上移动"
        >
          <ArrowUp size={24} />
        </button>
        <div />
        
        <button 
          className="aspect-square bg-slate-700/80 active:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-colors border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
          onClick={() => onMove(Direction.LEFT)}
          aria-label="向左移动"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          className="aspect-square bg-slate-700/80 active:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-colors border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
          onClick={() => onMove(Direction.DOWN)}
          aria-label="向下移动"
        >
          <ArrowDown size={24} />
        </button>
        <button 
          className="aspect-square bg-slate-700/80 active:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-colors border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
          onClick={() => onMove(Direction.RIGHT)}
          aria-label="向右移动"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="hidden md:flex justify-center text-sm text-slate-500 italic mt-4">
        使用键盘方向键或 WASD 移动
      </div>
    </div>
  );
};

export default Controls;