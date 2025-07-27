import { GameConfig } from '../config/GameConfig';
import { Player } from '../entities/Player';

export class UIManager {
  public render(ctx: CanvasRenderingContext2D, player: Player) {
    // Health bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 200, 30);
    
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 200 * (player.health / player.maxHealth), 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 15, 25);
  }
}
