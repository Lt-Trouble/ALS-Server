"use client";
import React, { useState } from 'react';
import Head from 'next/head';

type Player = 'X' | 'O' | null;

const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameDraw, setGameDraw] = useState(false);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (!newBoard.includes(null)) {
      setGameDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameDraw(false);
  };

  const renderSquare = (index: number) => {
    return (
      <button
        className={`w-16 h-16 flex items-center justify-center text-3xl font-bold border border-gray-400
          ${board[index] === 'X' ? 'text-blue-500' : 'text-red-500'}
          hover:bg-gray-100`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Tic Tac Toe</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>
      
      <div className="mb-4 text-xl">
        {winner ? (
          <span className="font-bold">{winner} wins!</span>
        ) : gameDraw ? (
          <span>It's a draw!</span>
        ) : (
          <span>Current player: <span className="font-bold">{currentPlayer}</span></span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-1 bg-gray-400 mb-6">
        {Array(9).fill(null).map((_, index) => (
          <div key={index}>{renderSquare(index)}</div>
        ))}
      </div>
      
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;