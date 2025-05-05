"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const cardBack = '❓';

const MemoryGame = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairs = [...emojis, ...emojis];
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(prev => prev + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second]);
        if (matched.length + 2 === cards.length) {
          setGameWon(true);
        }
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Memory Match</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-4">Memory Match</h1>
      <div className="mb-6 flex justify-between w-full max-w-md">
        <span className="text-lg">Moves: {moves}</span>
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 flex items-center justify-center text-3xl rounded-lg cursor-pointer transition-all
              ${flipped.includes(index) || matched.includes(index) ? 'bg-white' : 'bg-blue-500'}
              ${matched.includes(index) ? 'opacity-60' : ''}
              transform hover:scale-105`}
          >
            {flipped.includes(index) || matched.includes(index) ? card : cardBack}
          </div>
        ))}
      </div>
      
      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">You Win!</h2>
            <p className="mb-4">You completed the game in {moves} moves!</p>
            <button
              onClick={initializeGame}
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

export default MemoryGame;