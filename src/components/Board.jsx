export default function Board({ snake, food }) {
  const GRID_SIZE = 15;

  return (
    <div className="board">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;

        const isSnake = snake.some(
          ([r, c]) => r === row && c === col
        );

        const isFood = food[0] === row && food[1] === col;

        return (
          <div
            key={i}
            className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
          />
        );
      })}
    </div>
  );
}