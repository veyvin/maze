import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Achievements from './components/Achievements';
import { generateMaze } from './services/mazeGenerator';
import { audio } from './services/audio';
import { 
  Direction, 
  GameState, 
  MazeGrid, 
  Difficulty,
  Achievement,
  GameStats
} from './types';
import { 
  INITIAL_LEVEL, 
  INITIAL_VIEW_RADIUS,
  DIFFICULTY_CONFIG,
  ACHIEVEMENTS_DATA
} from './constants';
import { Sparkles, Trophy } from 'lucide-react';

const App: React.FC = () => {
  // --- Game State ---
  const [maze, setMaze] = useState<MazeGrid>([]);
  const [gameState, setGameState] = useState<GameState>({
    level: INITIAL_LEVEL,
    width: DIFFICULTY_CONFIG.normal.startWidth,
    height: DIFFICULTY_CONFIG.normal.startHeight,
    playerPos: { x: 0, y: 0 },
    goalPos: { x: 0, y: 0 },
    isFinished: false,
    viewRadius: INITIAL_VIEW_RADIUS,
    moveCount: 0,
    showMist: true,
    difficulty: 'normal',
  });
  const [loading, setLoading] = useState(true);

  // --- Persistence & Stats ---
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('maze_stats');
    return saved ? JSON.parse(saved) : {
      totalMoves: 0,
      levelsCompleted: 0,
      hardLevelsCompleted: 0
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('maze_achievements');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved state with current constant definitions to support new achievements updates
      return ACHIEVEMENTS_DATA.map(def => {
        const savedState = parsed.find((p: any) => p.id === def.id);
        return { ...def, unlocked: savedState ? savedState.unlocked : false };
      });
    }
    return ACHIEVEMENTS_DATA.map(d => ({ ...d, unlocked: false }));
  });

  const [showAchievements, setShowAchievements] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('maze_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('maze_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Achievement Checker
  const checkAchievements = useCallback((currentStats: GameStats) => {
    let hasNewUnlock = false;
    
    const newAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;

      let unlocked = false;
      switch (ach.id) {
        case 'first_step':
          unlocked = currentStats.levelsCompleted >= 1;
          break;
        case 'marathon':
          unlocked = currentStats.totalMoves >= 500;
          break;
        case 'veteran':
          unlocked = currentStats.levelsCompleted >= 10;
          break;
        case 'brave_heart':
          unlocked = currentStats.hardLevelsCompleted >= 1;
          break;
        case 'endurance':
          unlocked = currentStats.totalMoves >= 2000;
          break;
      }

      if (unlocked) {
        hasNewUnlock = true;
        setToastMessage(`解锁成就: ${ach.title}`);
        audio.playUnlock();
        setTimeout(() => setToastMessage(null), 3000);
      }
      return { ...ach, unlocked: unlocked || ach.unlocked };
    });

    if (hasNewUnlock) {
      setAchievements(newAchievements);
    }
  }, [achievements]);

  // --- Game Logic ---

  const initLevel = useCallback((level: number, difficulty: Difficulty, keepSettings = true) => {
    setLoading(true);
    
    const config = DIFFICULTY_CONFIG[difficulty];
    const growthSteps = Math.floor((level - 1) / config.growthRate);
    const newWidth = Math.min(config.startWidth + growthSteps, config.maxWidth);
    const newHeight = Math.min(config.startHeight + growthSteps, config.maxHeight);

    setTimeout(() => {
      const newMaze = generateMaze(newWidth, newHeight);
      setMaze(newMaze);
      setGameState(prev => ({
        ...prev,
        level: level,
        width: newWidth,
        height: newHeight,
        playerPos: { x: 0, y: 0 },
        goalPos: { x: newWidth - 1, y: newHeight - 1 },
        isFinished: false,
        moveCount: 0,
        difficulty: difficulty,
        viewRadius: keepSettings ? prev.viewRadius : INITIAL_VIEW_RADIUS,
        showMist: keepSettings ? prev.showMist : true,
      }));
      setLoading(false);
    }, 50);
  }, []);

  useEffect(() => {
    initLevel(INITIAL_LEVEL, 'normal', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    initLevel(1, newDifficulty, true);
  };

  const handleMove = useCallback((direction: Direction) => {
    if (gameState.isFinished || loading) return;

    const { playerPos } = gameState;
    const currentCell = maze[playerPos.y][playerPos.x];
    let nextPos = { ...playerPos };
    let canMove = false;

    switch (direction) {
      case Direction.UP:
        if (!currentCell.walls.top) { nextPos.y -= 1; canMove = true; }
        break;
      case Direction.RIGHT:
        if (!currentCell.walls.right) { nextPos.x += 1; canMove = true; }
        break;
      case Direction.DOWN:
        if (!currentCell.walls.bottom) { nextPos.y += 1; canMove = true; }
        break;
      case Direction.LEFT:
        if (!currentCell.walls.left) { nextPos.x -= 1; canMove = true; }
        break;
    }

    if (canMove) {
      audio.playMove();
      setGameState(prev => {
        const isGoal = nextPos.x === prev.goalPos.x && nextPos.y === prev.goalPos.y;
        
        if (isGoal) {
           audio.playWin();
           // Update Stats on Win
           const newStats = {
             ...stats,
             totalMoves: stats.totalMoves + 1,
             levelsCompleted: stats.levelsCompleted + 1,
             hardLevelsCompleted: prev.difficulty === 'hard' ? stats.hardLevelsCompleted + 1 : stats.hardLevelsCompleted
           };
           setStats(newStats);
           checkAchievements(newStats);
        } else {
           // Update Stats on Move
           const newStats = {
             ...stats,
             totalMoves: stats.totalMoves + 1
           };
           setStats(newStats);
           checkAchievements(newStats);
        }

        return {
          ...prev,
          playerPos: nextPos,
          moveCount: prev.moveCount + 1,
          isFinished: isGoal
        };
      });
    } else {
      audio.playBump();
    }
  }, [gameState, maze, loading, stats, checkAchievements]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': handleMove(Direction.UP); break;
        case 'ArrowDown': case 's': case 'S': handleMove(Direction.DOWN); break;
        case 'ArrowLeft': case 'a': case 'A': handleMove(Direction.LEFT); break;
        case 'ArrowRight': case 'd': case 'D': handleMove(Direction.RIGHT); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const handleNextLevel = () => {
    initLevel(gameState.level + 1, gameState.difficulty);
  };

  const handleReset = () => {
    initLevel(gameState.level, gameState.difficulty); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-start py-6 px-4 md:px-8 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
           <div className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-3">
             <Trophy size={20} />
             {toastMessage}
           </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight drop-shadow-sm">
          迷雾迷宫
        </h1>
        <p className="text-slate-500 text-sm mt-1">探索未知，寻找出路</p>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-4xl flex flex-col gap-6">
        <div className="relative">
          <Board 
            maze={maze} 
            playerPos={gameState.playerPos} 
            goalPos={gameState.goalPos} 
            viewRadius={gameState.viewRadius}
            showMist={gameState.showMist}
          />

          {/* Level Complete Overlay */}
          {gameState.isFinished && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
              <div className="bg-slate-800 p-8 rounded-2xl border border-emerald-500/50 shadow-2xl text-center transform scale-100 animate-in zoom-in-95 duration-200 w-[90%] max-w-sm">
                <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">关卡完成！</h2>
                <p className="text-slate-400 mb-6">本次耗时步数：<span className="text-emerald-400 font-mono text-xl">{gameState.moveCount}</span></p>
                <button 
                  onClick={handleNextLevel}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto justify-center w-full"
                >
                  下一关
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <Controls 
          onMove={handleMove}
          onReset={handleReset}
          onOpenAchievements={() => setShowAchievements(true)}
          viewRadius={gameState.viewRadius}
          setViewRadius={(r) => setGameState(prev => ({...prev, viewRadius: r}))}
          showMist={gameState.showMist}
          setShowMist={(show) => setGameState(prev => ({...prev, showMist: show}))}
          level={gameState.level}
          moveCount={gameState.moveCount}
          difficulty={gameState.difficulty}
          setDifficulty={handleDifficultyChange}
        />
      </main>

      <Achievements 
        achievements={achievements}
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <footer className="mt-8 text-slate-600 text-xs text-center max-w-md">
        <p>目标：找到绿色旗帜。</p>
        <p>提示：迷雾无处不在，请记住你走过的路。</p>
      </footer>
    </div>
  );
};

export default App;