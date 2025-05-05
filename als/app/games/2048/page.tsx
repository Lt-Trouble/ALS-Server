"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

type Tile = number | null;
type Board = Tile[][];

const GRID_SIZE = 4;

const Game2048 = () => {
  const [board, setBoard] = useState<Board>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  // Initialize the board
  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newBoard: Board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const addRandomTile = (board: Board) => {
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col] === null) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveTiles = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let scoreIncrease = 0;

    // Process the board based on direction
    for (let i = 0; i < GRID_SIZE; i++) {
      let line = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const row = direction === 'up' ? j : direction === 'down' ? GRID_SIZE - 1 - j : i;
        const col = direction === 'left' ? j : direction === 'right' ? GRID_SIZE - 1 - j : i;
        if (newBoard[row][col] !== null) {
          line.push(newBoard[row][col]);
        }
      }

      // Merge tiles
      const mergedLine = [];
      for (let j = 0; j < line.length; j++) {
        if (j < line.length - 1 && line[j] === line[j + 1]) {
          const mergedValue = line[j] * 2;
          mergedLine.push(mergedValue);
          scoreIncrease += mergedValue;
          if (mergedValue === 2048) setWon(true);
          j++;
        } else {
          mergedLine.push(line[j]);
        }
      }

      // Fill with nulls
      while (mergedLine.length < GRID_SIZE) {
        mergedLine.push(null);
      }

      // Update the board
      for (let j = 0; j < GRID_SIZE; j++) {
        const row = direction === 'up' ? j : direction === 'down' ? GRID_SIZE - 1 - j : i;
        const col = direction === 'left' ? j : direction === 'right' ? GRID_SIZE - 1 - j : i;
        if (newBoard[row][col] !== mergedLine[j]) {
          moved = true;
        }
        newBoard[row][col] = mergedLine[j];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prev => prev + scoreIncrease);
      checkGameOver(newBoard);
    }
  };

  const checkGameOver = (board: Board) => {
    // Check if there are any empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col] === null) {
          return;
        }
      }
    }

    // Check if any adjacent tiles are equal
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (col < GRID_SIZE - 1 && board[row][col] === board[row][col + 1]) {
          return;
        }
        if (row < GRID_SIZE - 1 && board[row][col] === board[row + 1][col]) {
          return;
        }
      }
    }

    setGameOver(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': moveTiles('up'); break;
        case 'ArrowDown': moveTiles('down'); break;
        case 'ArrowLeft': moveTiles('left'); break;
        case 'ArrowRight': moveTiles('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  const getTileColor = (value: number | null) => {
    if (!value) return 'bg-gray-300';
    const colors = [
      'bg-gray-100', 'bg-yellow-100', 'bg-yellow-200', 'bg-orange-200',
      'bg-orange-300', 'bg-red-300', 'bg-red-400', 'bg-purple-400',
      'bg-purple-500', 'bg-blue-500', 'bg-blue-600', 'bg-green-600'
    ];
    const index = Math.log2(value) - 1;
    return colors[Math.min(index, colors.length - 1)];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>2048 Game</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-4">2048</h1>
      
      <div className="flex justify-between w-64 mb-4">
        <div className="bg-gray-700 text-white px-4 py-2 rounded">
          <div className="text-xs">SCORE</div>
          <div className="font-bold">{score}</div>
        </div>
        <button
          onClick={startGame}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          New Game
        </button>
      </div>
      
      <div className="bg-gray-400 p-2 rounded-lg mb-4">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl
                  ${getTileColor(cell)} ${cell ? 'text-gray-800' : 'text-transparent'}`}
              >
                {cell}
              </div>
            ))
          ))}
        </div>
      </div>
      
      <div className="text-gray-600 mb-4">
        Use arrow keys to move tiles. Join the numbers to get to 2048!
      </div>
      
      {(gameOver || won) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              {won ? 'You Win!' : 'Game Over!'}
            </h2>
            <p className="mb-4">Your score: {score}</p>
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;