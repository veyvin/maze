# 迷雾迷宫 (Fog Maze)

一款基于 React 的迷宫探索游戏，玩家需要在迷雾笼罩的迷宫中找到通往终点的道路。

## 游戏简介

迷雾迷宫是一款考验记忆力和方向感的益智游戏。玩家置身于被迷雾笼罩的迷宫中，只能看到周围有限范围内的区域。你需要记住走过的路，找到通往绿色旗帜的出口。

**在线演示**: [https://veyvin.com/migong](https://veyvin.com/migong)

![迷雾迷宫](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 特色功能

- **迷雾探索**: 视野受限，需要记住走过的路径
- **多种难度**: 简单、普通、困难三种难度，迷宫大小各异
- **关卡递进**: 随着关卡提升，迷宫逐渐变大
- **成就系统**: 5个成就等你解锁
- **游戏统计**: 记录移动次数、完成关卡数等
- **音效反馈**: 移动、碰撞、胜利、解锁成就都有音效提示
- **键盘控制**: 支持方向键和 WASD 操作

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 迷宫生成算法

游戏采用三种经典迷宫生成算法，每局随机选择：

1. **深度优先搜索 (DFS)**: 生成蜿蜒曲折的长走廊
2. **Prim 算法**: 生成短路径和多分支
3. **递归分割算法**: 生成直线走廊和房间状结构

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 游戏玩法

### 操作方式

- **键盘**: 方向键 或 `W` `A` `S` `D` 移动
- **鼠标**: 点击屏幕下方的方向按钮

### 游戏目标

从左上角起点移动到右下角的绿色旗帜处。

### 游戏设置

- **难度选择**: 简单(12x12起)、普通(20x20起)、困难(30x30起)
- **视野半径**: 调整迷雾中可见范围 (1-10)
- **迷雾开关**: 可关闭迷雾查看完整迷宫

## 成就列表

| 成就 | 名称 | 解锁条件 |
|------|------|----------|
| 🏆 | 初次探索 | 完成第 1 个关卡 |
| 🏃 | 行路人 | 累计移动达到 500 步 |
| 🎯 | 迷宫老手 | 累计完成 10 个关卡 |
| 💪 | 勇者之心 | 在困难模式下完成一个关卡 |
| 🔥 | 毅力惊人 | 累计移动达到 2000 步 |

## 项目结构

```
/workspace
├── components/
│   ├── Achievements.tsx   # 成就面板组件
│   ├── Board.tsx           # 迷宫棋盘组件
│   └── Controls.tsx        # 控制面板组件
├── services/
│   ├── audio.ts            # 音效服务
│   └── mazeGenerator.ts    # 迷宫生成算法
├── App.tsx                 # 主应用组件
├── constants.ts            # 游戏常量配置
├── types.ts                # TypeScript 类型定义
├── index.tsx               # 应用入口
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 数据持久化

游戏数据保存在浏览器的 localStorage 中：

- `maze_stats`: 游戏统计数据
- `maze_achievements`: 成就解锁状态

## 许可证

MIT License