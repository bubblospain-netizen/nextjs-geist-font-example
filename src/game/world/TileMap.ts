import { GameConfig } from '../config/GameConfig';

export interface Tile {
  type: 'air' | 'grass' | 'dirt' | 'stone' | 'wood' | 'water';
  solid: boolean;
  breakable: boolean;
}

export class TileMap {
  private width: number;
  private height: number;
  private tiles: Tile[][];
  private tileSize: number = GameConfig.TILE_SIZE;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.initializeTiles();
  }

  private initializeTiles() {
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = {
          type: 'air',
          solid: false,
          breakable: false
        };
      }
    }
  }

  public generateLevel() {
    // Generate ground level
    const groundLevel = Math.floor(this.height * 0.7);
    
    for (let x = 0; x < this.width; x++) {
      // Sky
      for (let y = 0; y < groundLevel - 1; y++) {
        this.tiles[y][x] = { type: 'air', solid: false, breakable: false };
      }
      
      // Grass layer
      this.tiles[groundLevel - 1][x] = { type: 'grass', solid: true, breakable: true };
      
      // Dirt layer
      for (let y = groundLevel; y < groundLevel + 3; y++) {
        this.tiles[y][x] = { type: 'dirt', solid: true, breakable: true };
      }
      
      // Stone layer
      for (let y = groundLevel + 3; y < this.height; y++) {
        this.tiles[y][x] = { type: 'stone', solid: true, breakable: true };
      }
    }

    // Add some trees
    for (let i = 0; i < 5; i++) {
      const treeX = Math.floor(Math.random() * this.width);
      const treeY = groundLevel - 1;
      this.generateTree(treeX, treeY);
    }

    // Add some platforms
    for (let i = 0; i < 3; i++) {
      const platformX = Math.floor(Math.random() * (this.width - 5)) + 2;
      const platformY = groundLevel - 3 - Math.floor(Math.random() * 3);
      this.generatePlatform(platformX, platformY, 3 + Math.floor(Math.random() * 3));
    }
  }

  private generateTree(x: number, y: number) {
    if (x < 1 || x >= this.width - 1) return;
    
    // Tree trunk
    for (let i = 0; i < 4; i++) {
      if (y - i >= 0) {
        this.tiles[y - i][x] = { type: 'wood', solid: true, breakable: true };
      }
    }
    
    // Tree leaves
    for (let dy = -5; dy <= -3; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const leafX = x + dx;
        const leafY = y + dy;
        if (leafX >= 0 && leafX < this.width && leafY >= 0 && leafY < this.height) {
          this.tiles[leafY][leafX] = { type: 'grass', solid: false, breakable: true };
        }
      }
    }
  }

  private generatePlatform(x: number, y: number, width: number) {
    for (let i = 0; i < width; i++) {
      const platformX = x + i;
      if (platformX >= 0 && platformX < this.width && y >= 0 && y < this.height) {
        this.tiles[y][platformX] = { type: 'wood', solid: true, breakable: true };
      }
    }
  }

  public getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  public setTile(x: number, y: number, tile: Tile) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[y][x] = tile;
    }
  }

  public isSolid(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile ? tile.solid : false;
  }

  public getGroundY(x: number, currentY: number): number {
    const tileX = Math.floor(x / this.tileSize);
    for (let y = Math.floor(currentY / this.tileSize); y < this.height; y++) {
      if (this.isSolid(tileX, y)) {
        return y * this.tileSize;
      }
    }
    return this.height * this.tileSize;
  }

  public render(ctx: CanvasRenderingContext2D, camera: any) {
    const startX = Math.max(0, Math.floor(camera.x / this.tileSize));
    const endX = Math.min(this.width, Math.ceil((camera.x + camera.width) / this.tileSize));
    const startY = Math.max(0, Math.floor(camera.y / this.tileSize));
    const endY = Math.min(this.height, Math.ceil((camera.y + camera.height) / this.tileSize));

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tile = this.tiles[y][x];
        const screenX = x * this.tileSize - camera.x;
        const screenY = y * this.tileSize - camera.y;

        if (tile.type !== 'air') {
          let color = '#000000';
          switch (tile.type) {
            case 'grass':
              color = GameConfig.COLORS.GRASS;
              break;
            case 'dirt':
              color = '#8B4513';
              break;
            case 'stone':
              color = GameConfig.COLORS.STONE;
              break;
            case 'wood':
              color = '#8B4513';
              break;
            case 'water':
              color = '#0000FF';
              break;
          }
          ctx.fillStyle = color;
          ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        }
      }
    }
  }
}
