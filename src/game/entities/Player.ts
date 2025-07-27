import { GameConfig } from '../config/GameConfig';
import { InputHandler } from '../engine/InputHandler';
import { TileMap } from '../world/TileMap';

export class Player {
  public x: number;
  public y: number;
  public width: number = 16;
  public height: number = 24;
  public vx: number = 0;
  public vy: number = 0;
  public health: number = GameConfig.PLAYER_MAX_HEALTH;
  public maxHealth: number = GameConfig.PLAYER_MAX_HEALTH;
  public isOnGround: boolean = false;
  public facing: 'left' | 'right' = 'right';
  public attackCooldown: number = 0;
  public attackDuration: number = 0;

  private assetManager: any;
  private jumpForce: number = GameConfig.PLAYER_JUMP_FORCE;
  private speed: number = GameConfig.PLAYER_SPEED;

  constructor(x: number, y: number, assetManager: any) {
    this.x = x;
    this.y = y;
    this.assetManager = assetManager;
  }

  public update(deltaTime: number, input: InputHandler, tileMap: TileMap) {
    // Horizontal movement
    this.vx = 0;
    if (input.isKeyPressed('KeyA') || input.isKeyPressed('ArrowLeft')) {
      this.vx = -this.speed;
      this.facing = 'left';
    }
    if (input.isKeyPressed('KeyD') || input.isKeyPressed('ArrowRight')) {
      this.vx = this.speed;
      this.facing = 'right';
    }

    // Jumping
    if ((input.isKeyPressed('Space') || input.isKeyPressed('ArrowUp')) && this.isOnGround) {
      this.vy = -this.jumpForce;
    }

    // Apply gravity
    this.vy += GameConfig.GRAVITY;
    if (this.vy > GameConfig.MAX_FALL_SPEED) {
      this.vy = GameConfig.MAX_FALL_SPEED;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Collision detection with tiles
    this.handleCollision(tileMap);

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    if (this.attackDuration > 0) {
      this.attackDuration -= deltaTime;
    }

    // Attack
    if ((input.isKeyPressed('KeyX') || input.isKeyPressed('KeyZ')) && this.attackCooldown <= 0) {
      this.attack();
    }
  }

  private handleCollision(tileMap: TileMap) {
    this.isOnGround = false;

    // Check collision with ground
    const groundY = tileMap.getGroundY(this.x, this.y + this.height);
    if (this.y + this.height >= groundY) {
      this.y = groundY - this.height;
      this.vy = 0;
      this.isOnGround = true;
    }

    // Check collision with walls
    const leftTile = Math.floor(this.x / GameConfig.TILE_SIZE);
    const rightTile = Math.floor((this.x + this.width) / GameConfig.TILE_SIZE);
    const topTile = Math.floor(this.y / GameConfig.TILE_SIZE);
    const bottomTile = Math.floor((this.y + this.height) / GameConfig.TILE_SIZE);

    // Horizontal collision
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

  private attack() {
    this.attackCooldown = 500; // 500ms cooldown
    this.attackDuration = 200; // 200ms attack duration
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  public heal(amount: number) {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  public render(ctx: CanvasRenderingContext2D, camera: any) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Simple rectangle for now
    ctx.fillStyle = GameConfig.COLORS.PLAYER;
    ctx.fillRect(screenX, screenY, this.width, this.height);

    // Health bar
    ctx.fillStyle = 'red';
    ctx.fillRect(screenX, screenY - 10, this.width * (this.health / this.maxHealth), 5);
  }
}
