export class InputHandler {
  private keys: { [key: string]: boolean } = {};
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mousePressed: boolean = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      this.mousePressed = true;
    });

    window.addEventListener('mouseup', (e) => {
      this.mousePressed = false;
    });
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key] || false;
  }

  public isMousePressed(): boolean {
    return this.mousePressed;
  }

  public getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }
}
