export const GameConfig = {
  // Canvas settings
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TILE_SIZE: 16,
  
  // Game settings
  FPS: 60,
  GRAVITY: 0.5,
  MAX_FALL_SPEED: 8,
  
  // Player settings
  PLAYER_SPEED: 3,
  PLAYER_JUMP_FORCE: 12,
  PLAYER_MAX_HEALTH: 100,
  
  // Colors (NES palette)
  COLORS: {
    SKY: '#87CEEB',
    GROUND: '#8B4513',
    GRASS: '#228B22',
    STONE: '#696969',
    PLAYER: '#FF6B6B',
    ENEMY: '#8B0000',
    UI_BG: '#2F4F4F',
    UI_TEXT: '#FFFFFF'
  },
  
  // Level sizes
  LEVEL_WIDTH: 50,
  LEVEL_HEIGHT: 30
} as const;
