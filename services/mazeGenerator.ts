import { Cell, MazeGrid, Position, Direction } from '../types';

// Helper to create an initial grid
// If startClosed is true, all walls are present (for DFS/Prim's)
// If startClosed is false, all walls are absent (for Recursive Division)
const createInitialGrid = (width: number, height: number, startClosed: boolean): MazeGrid => {
  const grid: MazeGrid = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { 
          top: startClosed, 
          right: startClosed, 
          bottom: startClosed, 
          left: startClosed 
        },
        visited: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

// Remove wall between two adjacent cells (for carving algorithms)
const removeWalls = (grid: MazeGrid, current: Cell, next: Cell) => {
  const dx = next.x - current.x;
  const dy = next.y - current.y;

  if (dx === 1) { // Next is to the right
    grid[current.y][current.x].walls.right = false;
    grid[next.y][next.x].walls.left = false;
  } else if (dx === -1) { // Next is to the left
    grid[current.y][current.x].walls.left = false;
    grid[next.y][next.x].walls.right = false;
  } else if (dy === 1) { // Next is below
    grid[current.y][current.x].walls.bottom = false;
    grid[next.y][next.x].walls.top = false;
  } else if (dy === -1) { // Next is above
    grid[current.y][current.x].walls.top = false;
    grid[next.y][next.x].walls.bottom = false;
  }
};

// Add wall between two adjacent cells (for adding algorithms)
const addWalls = (grid: MazeGrid, c1: Position, c2: Position) => {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;

  if (dx === 1) { 
    grid[c1.y][c1.x].walls.right = true;
    grid[c2.y][c2.x].walls.left = true;
  } else if (dx === -1) {
    grid[c1.y][c1.x].walls.left = true;
    grid[c2.y][c2.x].walls.right = true;
  } else if (dy === 1) {
    grid[c1.y][c1.x].walls.bottom = true;
    grid[c2.y][c2.x].walls.top = true;
  } else if (dy === -1) {
    grid[c1.y][c1.x].walls.top = true;
    grid[c2.y][c2.x].walls.bottom = true;
  }
};

// --- Algorithm 1: Randomized Depth-First Search (Recursive Backtracker) ---
// Good for long, winding corridors.
const generateDFS = (width: number, height: number): MazeGrid => {
  const grid = createInitialGrid(width, height, true);
  const stack: Position[] = [];
  const startPos: Position = { x: 0, y: 0 };
  
  grid[startPos.y][startPos.x].visited = true;
  stack.push(startPos);

  while (stack.length > 0) {
    const currentPos = stack[stack.length - 1];
    const neighbors = [];
    
    const directions = [
      { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
    ];

    for (const dir of directions) {
      const nx = currentPos.x + dir.x;
      const ny = currentPos.y + dir.y;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !grid[ny][nx].visited) {
        neighbors.push(grid[ny][nx]);
      }
    }

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWalls(grid, grid[currentPos.y][currentPos.x], next);
      next.visited = true;
      stack.push({ x: next.x, y: next.y });
    } else {
      stack.pop();
    }
  }
  return grid;
};

// --- Algorithm 2: Randomized Prim's Algorithm ---
// Good for short paths and many branches.
const generatePrims = (width: number, height: number): MazeGrid => {
  const grid = createInitialGrid(width, height, true);
  
  // Frontier cells: unvisited cells adjacent to visited cells
  const frontier: Position[] = [];
  
  // Start at random point
  const startX = 0;
  const startY = 0;
  grid[startY][startX].visited = true;
  
  // Add neighbors of start to frontier
  const addNeighborsToFrontier = (x: number, y: number) => {
    const dirs = [{x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}];
    for (const d of dirs) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (!grid[ny][nx].visited) {
          // Check if already in frontier to avoid duplicates (optional optimization, but set check is safer)
          // For simplicity, we just add. We check visited status when popping.
          frontier.push({x: nx, y: ny});
        }
      }
    }
  };

  addNeighborsToFrontier(startX, startY);

  while (frontier.length > 0) {
    // Pick random cell from frontier
    const randIndex = Math.floor(Math.random() * frontier.length);
    const current = frontier[randIndex];
    frontier.splice(randIndex, 1); // Remove from list

    if (grid[current.y][current.x].visited) continue;

    // Find neighbors of 'current' that are already part of the maze (visited)
    const neighborsInMaze: Position[] = [];
    const dirs = [{x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}];
    for (const d of dirs) {
      const nx = current.x + d.x;
      const ny = current.y + d.y;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (grid[ny][nx].visited) {
          neighborsInMaze.push({x: nx, y: ny});
        }
      }
    }

    if (neighborsInMaze.length > 0) {
      // Connect to one random neighbor in the maze
      const neighbor = neighborsInMaze[Math.floor(Math.random() * neighborsInMaze.length)];
      removeWalls(grid, grid[current.y][current.x], grid[neighbor.y][neighbor.x]);
      
      // Mark as visited and add its neighbors to frontier
      grid[current.y][current.x].visited = true;
      addNeighborsToFrontier(current.x, current.y);
    }
  }

  return grid;
};

// --- Algorithm 3: Recursive Division ---
// Good for straight corridors and room-like structures.
const generateRecursiveDivision = (width: number, height: number): MazeGrid => {
  // Start with an empty grid (no internal walls)
  const grid = createInitialGrid(width, height, false);

  // Add outer boundary walls
  for (let x = 0; x < width; x++) {
    grid[0][x].walls.top = true;
    grid[height - 1][x].walls.bottom = true;
  }
  for (let y = 0; y < height; y++) {
    grid[y][0].walls.left = true;
    grid[y][width - 1].walls.right = true;
  }

  const divide = (x: number, y: number, w: number, h: number) => {
    if (w < 2 || h < 2) return;

    // Decide orientation: favor splitting the longer dimension
    // If square, random choice
    const horizontal = w < h ? true : (w > h ? false : Math.random() < 0.5);

    if (horizontal) {
      // Horizontal Split (Wall goes Left-Right)
      // Choose a "y" for the wall. Range: y to y + h - 2
      // This ensures we don't place wall on edge
      const wallY = Math.floor(Math.random() * (h - 1)) + y;
      
      // Choose a "x" for the hole. Range: x to x + w - 1
      const holeX = Math.floor(Math.random() * w) + x;

      for (let i = x; i < x + w; i++) {
        if (i !== holeX) {
          // Add wall between (i, wallY) and (i, wallY + 1)
          addWalls(grid, {x: i, y: wallY}, {x: i, y: wallY + 1});
        }
      }

      // Recurse
      divide(x, y, w, wallY - y + 1);
      divide(x, wallY + 1, w, y + h - wallY - 1);

    } else {
      // Vertical Split (Wall goes Top-Bottom)
      // Choose an "x" for the wall. Range: x to x + w - 2
      const wallX = Math.floor(Math.random() * (w - 1)) + x;
      
      // Choose a "y" for the hole. Range: y to y + h - 1
      const holeY = Math.floor(Math.random() * h) + y;

      for (let i = y; i < y + h; i++) {
        if (i !== holeY) {
          // Add wall between (wallX, i) and (wallX + 1, i)
          addWalls(grid, {x: wallX, y: i}, {x: wallX + 1, y: i});
        }
      }

      // Recurse
      divide(x, y, wallX - x + 1, h);
      divide(wallX + 1, y, x + w - wallX - 1, h);
    }
  };

  divide(0, 0, width, height);
  return grid;
};

// Main Generator Function
export const generateMaze = (width: number, height: number): MazeGrid => {
  const r = Math.random();
  
  // 33% chance for each algorithm
  if (r < 0.33) {
    // console.log("Generating Maze: Recursive Backtracker (DFS)");
    return generateDFS(width, height);
  } else if (r < 0.66) {
    // console.log("Generating Maze: Prim's Algorithm");
    return generatePrims(width, height);
  } else {
    // console.log("Generating Maze: Recursive Division");
    return generateRecursiveDivision(width, height);
  }
};
