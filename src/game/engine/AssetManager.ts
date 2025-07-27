import { GameConfig } from '../config/GameConfig';

export class AssetManager {
  private assets: Map<string, any> = new Map();
  private loaded: boolean = false;

  constructor() {
    this.loadAssets();
  }

  private async loadAssets() {
    // Load pixel art assets
    await this.loadImage('player', '/sprites/player.png');
    await this.loadImage('monsters', '/sprites/monsters.png');
    await this.loadImage('tiles', '/sprites/tiles.png');
    await this.loadImage('items', '/sprites/items.png');
    await this.loadImage('ui', '/sprites/ui.png');
  }

  private async loadImage(key: string, src: string): Promise<void> {
    const img = new Image();
    img.src = src;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    this.assets.set(key, img);
  }

  public get(key: string): any {
    return this.assets.get(key);
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}
