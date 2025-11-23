
export const INITIAL_LEVEL = 1;
export const INITIAL_VIEW_RADIUS = 3;
export const MIN_VIEW_RADIUS = 1;
export const MAX_VIEW_RADIUS = 10;

// Difficulty Settings
export const DIFFICULTY_CONFIG = {
  easy: {
    startWidth: 12,
    startHeight: 12,
    maxWidth: 20,
    maxHeight: 20,
    growthRate: 3 // Levels per size increase
  },
  normal: {
    startWidth: 20,
    startHeight: 20,
    maxWidth: 32,
    maxHeight: 32,
    growthRate: 2
  },
  hard: {
    startWidth: 30,
    startHeight: 30,
    maxWidth: 45,
    maxHeight: 45,
    growthRate: 1
  }
};

export const ACHIEVEMENTS_DATA = [
  { id: 'first_step', title: '初次探索', description: '完成第 1 个关卡' },
  { id: 'marathon', title: '行路人', description: '累计移动达到 500 步' },
  { id: 'veteran', title: '迷宫老手', description: '累计完成 10 个关卡' },
  { id: 'brave_heart', title: '勇者之心', description: '在困难模式下完成一个关卡' },
  { id: 'endurance', title: '毅力惊人', description: '累计移动达到 2000 步' },
];