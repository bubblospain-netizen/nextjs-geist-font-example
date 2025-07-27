import { GameConfig } from '../config/GameConfig';
import { TileMap } from '../world/TileMap';

export abstract class Monster {
  public x: number;
  public y: number;
  public width: number = 16;
  public height: number = 16;
  public vx: number = 0;
  public vy: number = 0;
  public health: number;
  public maxHealth: number;
  public damage: number;
  public speed: number;
  public isAlive: boolean = true;
  public facing: 'left' | 'right' = 'left';
  public attackCooldown: number = 0;

  protected target: any;
  protected tileMap: TileMap;

  constructor(x: number, y: number, health: number, damage: number, speed: number) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.maxHealth = health;
    this.damage = damage;
    this.speed = speed;
  }

  public abstract update(deltaTime: number, target: any, tileMap: TileMap): void;
  public abstract render(ctx: CanvasRenderingContext2D, camera: any): void;

  protected applyGravity() {
    this.vy += GameConfig.GRAVITY;
    if (this.vy > GameConfig.MAX_FALL_SPEED) {
      this.vy = GameConfig.MAX_FALL_SPEED;
    }
  }

  protected handleCollision(tileMap: TileMap) {
    const leftTile = Math.floor(this.x / GameConfig.TILE_SIZE);
    const rightTile = Math.floor((this.x + this.width) / GameConfig.TILE_SIZE);
    const topTile = Math.floor(this.y / GameConfig.TILE_SIZE);
    const bottomTile = Math.floor((this.y + this.height) / GameConfig.TILE_SIZE);

    // Ground collision
    const groundY = tileMap.getGroundY(this.x + this.width / 2, this.y + this.height);
    if (this.y + this.height >= groundY) {
      this.y = groundY - this.height;
      this.vy = 0;
    }

    // Wall collision
    for (let y = topTile; y <= bottomTile; y++) {
      for (let x = leftTile; x <= rightTile; x++) {
        if (tileMap.isSolid(x, y)) {
          if (this.vx > 0) {
            this.x = x * GameConfig.TILE_SIZE - this.width;
          } else if (this.vx < 0) {
            this.x = (x + 1) * GameConfig.TILE_SIZE;
          }
          this.vx = 0;
        }
      }
    }
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.isAlive = false;
    }
  }

  public getDistanceToTarget(target: any): number {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export class Goblin extends Monster {
  private patrolDirection: number = 1;
  private patrolDistance: number = 0;
  private maxPatrolDistance: number = 100;

  constructor(x: number, y: number) {
    super(x, y, 30, 10, 1);
  }

  public update(deltaTime: number, target: any, tileMap: TileMap) {
    if (!this.isAlive) return;

    const distanceToTarget = this.getDistanceToTarget(target);
    
    if (distanceToTarget < 100) {
      // Chase player
      if (target.x < this.x) {
        this.vx = -this.speed;
        this.facing = 'left';
      } else {
        this.vx = this.speed;
        this.facing = 'right';
      }
    } else {
      // Patrol
      this.vx = this.patrolDirection * this.speed * 0.5;
      this.patrolDistance += Math.abs(this.vx);
      
      if (this.patrolDistance >= this.maxPatrolDistance) {
        this.patrolDirection *= -1;
        this.patrolDistance = 0;
      }
    }

    this.x += this.vx;
    this.applyGravity();
    this.y += this.vy;

    this.handleCollision(tileMap);

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
  }

  public render(ctx: CanvasRenderingContext2D, camera: any) {
    if (!this.isAlive) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Goblin body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(screenX, screenY, this.width, this.height);
    
    // Eyes
    ctx.fillStyle = 'red';
    if (this.facing === 'left') {
      ctx.fillRect(screenX + 2, screenY + 3, 2, 2);
    } else {
      ctx.fillRect(screenX + 12, screenY + 3, 2, 2);
    }

    // Health bar
    ctx.fillStyle = 'red';
    ctx.fillRect(screenX, screenY - 8, this.width * (this.health / this.maxHealth), 3);
  }
}

export class Slime extends Monster {
  private jumpCooldown: number = 0;
  private shootCooldown: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 20, 15, 0.5);
  }

  public update(deltaTime: number, target: any, tileMap: TileMap) {
    if (!this.isAlive) return;

    const distanceToTarget = this.getDistanceToTarget(target);
    
    if (distanceToTarget < 150) {
      // Jump towards player
      if (this.jumpCooldown <= 0) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * this.speed * 3;
        this.vy = -8;
        this.jumpCooldown = 2000;
      }
    }

    this.x += this.vx;
    this.applyGravity();
    this.y += this.vy;

    this.handleCollision(tileMap);

    // Friction
    this.vx *= 0.8;

    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
  }

  public render(ctx: CanvasRenderingContext2D, camera: any) {
    if (!this.isAlive) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Slime body
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(screenX + 4, screenY + 4, 2, 2);
    ctx.fillRect(screenX + 10, screenY + 4, 2, 2);

    // Health bar
    ctx.fillStyle = 'red';
    ctx.fillRect(screenX, screenY - 8, this.width * (this.health / this.maxHealth), 3);
  }
}
