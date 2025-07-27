export class Camera {
  public x: number = 0;
  public y: number = 0;
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public update(targetX: number, targetY: number) {
    this.x = targetX - this.width / 2;
    this.y = targetY - this.height / 2;
  }

  public isInView(x: number, y: number, width: number, height: number): boolean {
    return (
      x + width > this.x &&
      x < this.x + this.width &&
      y + height > this.y &&
      y < this.y + this.height
    );
  }
}
