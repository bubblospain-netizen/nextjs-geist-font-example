import { Goblin, Slime } from './Monster';
import { AssetManager } from '../engine/AssetManager';

export class MonsterManager {
  private monsters: any[] = [];
  private assetManager: AssetManager;

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
    this.spawnInitialMonsters();
  }

  private spawnInitialMonsters() {
    // Spawn some goblins
    for (let i = 0; i < 5; i++) {
      const x = 200 + Math.random() * 400;
      const y = 200 + Math.random() * 100;
      this.monsters.push(new Goblin(x, y));
    }

    // Spawn some slimes
    for (let i = 0; i < 3; i++) {
      const x = 300 + Math.random() * 300;
      const y = 150 + Math.random() * 100;
      this.monsters.push(new Slime(x, y));
    }
  }

  public update(deltaTime: number, player: any, tileMap: any) {
    this.monsters.forEach(monster => {
      if (monster.isAlive) {
        monster.update(deltaTime, player, tileMap);
      }
    });

    // Remove dead monsters
    this.monsters = this.monsters.filter(monster => monster.isAlive);
  }

  public render(ctx: CanvasRenderingContext2D, camera: any) {
    this.monsters.forEach(monster => {
      if (monster.isAlive) {
        monster.render(ctx, camera);
      }
    });
  }

  public getMonstersInRange(x: number, y: number, range: number): any[] {
    return this.monsters.filter(monster => 
      monster.isAlive && 
      Math.sqrt((monster.x - x) ** 2 + (monster.y - y) ** 2) <= range
    );
  }

  public spawnMonster(type: 'goblin' | 'slime', x: number, y: number) {
    switch (type) {
      case 'goblin':
        this.monsters.push(new Goblin(x, y));
        break;
      case 'slime':
        this.monsters.push(new Slime(x, y));
        break;
    }
  }
}
