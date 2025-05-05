"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  };

  const moveSnake = () => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      // Moving the snake based on the current direction
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check if snake hits the walls or itself
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if the snake eats the food
      if (head.x === food.x && head.y === food.y) {
        generateFood();
        setScore(prev => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w': if (direction !== 'DOWN') setDirection('UP'); break;
        case 's': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'a': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'd': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoopRef.current);
  }, [direction, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 font-sans">
      <Head>
        <title>Snake Game</title>
      </Head>

      <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-lg">🐍 Snake Game</h1>
      <div className="mb-4 bg-white px-6 py-2 rounded-full shadow text-xl font-medium text-indigo-700">
        Score: <span className="font-bold">{score}</span>
      </div>

      <div
        className="relative bg-white border-4 border-gray-300 rounded-lg shadow-lg"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-sm transition-all duration-75"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}

        <div
          className="absolute bg-red-500 rounded-sm shadow-sm"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-lg text-white mb-4">Your score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {!gameOver && (
        <button
          onClick={resetGame}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Restart
        </button>
      )}

      <div className="mt-4 text-gray-600 text-sm">Use <b>W</b>, <b>A</b>, <b>S</b>, <b>D</b> to move</div>
    </div>
  );
};

export default SnakeGame;
