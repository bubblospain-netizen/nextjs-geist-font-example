import { GameEngine } from '../game/engine/GameEngine';

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Village Defense Game</h1>
      <div className="border-4 border-gray-600 rounded-lg overflow-hidden">
        <canvas 
          id="gameCanvas" 
          width="800" 
          height="600"
          className="block"
        />
      </div>
      <div className="mt-4 text-white text-center">
        <p className="mb-2">Controls:</p>
        <p>WASD or Arrow Keys - Move</p>
        <p>Space - Jump</p>
        <p>X or Z - Attack</p>
      </div>
    </div>
  );
}
