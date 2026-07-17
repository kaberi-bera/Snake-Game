import useSnakeGame from "./hooks/useSnakeGame";
import Board from "./components/Board";
import "./App.css";

function App() {
  const { snake, food, running, score, restartGame, highScore } = useSnakeGame();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{running ? "Snake Game" : "Game Over"}</h2>
      <h3>Score: {score}</h3>
      <h4>High Score: {highScore}</h4>

      <Board snake={snake} food={food} />

      {!running && (
        <button onClick={restartGame} style={{ marginTop: "15px" }}>
          Restart Game
        </button>
      )}
    </div>
  );
}

export default App;