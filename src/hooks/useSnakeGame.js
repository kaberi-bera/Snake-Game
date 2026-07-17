import { useState, useEffect, useRef } from "react";
import eatSoundFile from "../assets/eat.mp3";
import gameOverSoundFile from "../assets/gameover.mp3";

const GRID_SIZE = 15;

export default function useSnakeGame() {
  const [snake, setSnake] = useState([[7,7], [7,6], [7,5]]);
  const [food, setFood] = useState([5,5]);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);

  const direction = useRef([0,1]);

  //  FIX: persist audio using useRef
  const eatSound = useRef(new Audio(eatSoundFile));
  const gameOverSound = useRef(new Audio(gameOverSoundFile));

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && direction.current[0] !== 1)
        direction.current = [-1,0];

      if (e.key === "ArrowDown" && direction.current[0] !== -1)
        direction.current = [1,0];

      if (e.key === "ArrowLeft" && direction.current[1] !== 1)
        direction.current = [0,-1];

      if (e.key === "ArrowRight" && direction.current[1] !== -1)
        direction.current = [0,1];
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!running) return;

      setSnake((prev) => {
        const newHead = [
          prev[0][0] + direction.current[0],
          prev[0][1] + direction.current[1],
        ];

        // wall collision
        if (
          newHead[0] < 0 ||
          newHead[1] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] >= GRID_SIZE
        ) {
          setRunning(false);
          gameOverSound.current.play();
          return prev;
        }

        // self collision FIXED
        for (let i = 1; i < prev.length; i++) {
          if (
            prev[i][0] === newHead[0] &&
            prev[i][1] === newHead[1]
          ) {
            setRunning(false);
            gameOverSound.current.play();
            return prev;
          }
        }

        const newSnake = [newHead, ...prev];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((prev) => prev + 1);

          eatSound.current.currentTime = 0;
          eatSound.current.play();

          setFood([
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE),
          ]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [food, running]);

  //high score update
  useEffect(() => {
    if (!running && score > highScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    }
  }, [running]);

  const restartGame = () => {
    setSnake([[7,7], [7,6], [7,5]]);
    setFood([5,5]);
    setRunning(true);
    setScore(0);
    direction.current = [0,1];
  };

  return { snake, food, running, score, restartGame, highScore };
}