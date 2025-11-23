import React, { useMemo } from 'react';
import { MazeGrid, Position } from '../types';
import { Flag, User } from 'lucide-react';

interface BoardProps {
  maze: MazeGrid;
  playerPos: Position;
  goalPos: Position;
  viewRadius: number;
  showMist: boolean;
  cellSize?: number; // Optional custom cell size
}

const Board: React.FC<BoardProps> = ({ 
  maze, 
  playerPos, 
  goalPos, 
  viewRadius, 
  showMist 
}) => {
  if (!maze || maze.length === 0) return null;

  const height = maze.length;
  const width = maze[0].length;

  // Calculate visible cells based on radius
  // Using Euclidean distance for a circular visibility
  const isVisible = (x: number, y: number) => {
    if (!showMist) return true;
    const dx = x - playerPos.x;
    const dy = y - playerPos.y;
    return Math.sqrt(dx * dx + dy * dy) <= viewRadius;
  };

  // Memoize the grid rendering to avoid expensive calcs on every small update,
  // although React is fast enough for this size usually.
  // We rely on index key here because the grid structure doesn't change during play, only visibility/player.
  
  return (
    <div 
      className="relative bg-maze-fog shadow-2xl rounded-lg overflow-hidden border border-slate-700 select-none touch-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
        aspectRatio: `${width}/${height}`,
        maxHeight: '75vh',
        maxWidth: '100%',
        width: 'auto', // Let aspect ratio handle it
        margin: '0 auto'
      }}
    >
      {maze.map((row, y) => (
        row.map((cell, x) => {
          const visible = isVisible(x, y);
          const isPlayer = playerPos.x === x && playerPos.y === y;
          const isGoal = goalPos.x === x && goalPos.y === y;

          // Border styles based on walls
          const borderStyle = {
            borderTop: cell.walls.top ? '1px solid #334155' : '1px solid transparent',
            borderRight: cell.walls.right ? '1px solid #334155' : '1px solid transparent',
            borderBottom: cell.walls.bottom ? '1px solid #334155' : '1px solid transparent',
            borderLeft: cell.walls.left ? '1px solid #334155' : '1px solid transparent',
          };

          if (!visible) {
            return (
              <div 
                key={`${x}-${y}`} 
                className="bg-black w-full h-full border border-black transition-colors duration-500"
              />
            );
          }

          return (
            <div
              key={`${x}-${y}`}
              className="relative w-full h-full bg-slate-800 transition-colors duration-300"
              style={borderStyle}
            >
              {/* Floor detail (optional, keeps it clean for now) */}
              
              {/* Goal */}
              {isGoal && (
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500 animate-pulse-slow">
                  <Flag size="60%" fill="currentColor" />
                </div>
              )}

              {/* Player */}
              {isPlayer && (
                <div className="absolute inset-0 flex items-center justify-center text-blue-500 z-10 transition-all duration-150">
                  <div className="w-[60%] h-[60%] bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                </div>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Board;