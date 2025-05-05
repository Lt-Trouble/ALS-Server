"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const GameHub = () => {
  const router = useRouter();

  const games = [
    {
      id: 1,
      title: 'Snake',
      description: 'Classic snake game',
      color: 'bg-green-100',
      icon: '🐍',
      path: '/games/snake'
    },
    {
      id: 2,
      title: 'Memory Match',
      description: 'Find matching pairs',
      color: 'bg-blue-100',
      icon: '🧠',
      path: '/games/memory'
    },
    {
      id: 3,
      title: 'Tic Tac Toe',
      description: 'Play against AI or friend',
      color: 'bg-yellow-100',
      icon: '❌⭕',
      path: '/games/tictactoe'
    },
    {
      id: 4,
      title: 'Space Invaders',
      description: 'Defend Earth from aliens',
      color: 'bg-purple-100',
      icon: '👾',
      path: '/games/space-invaders'
    },
    {
      id: 5,
      title: '2048',
      description: 'Slide and merge tiles',
      color: 'bg-red-100',
      icon: '🧮',
      path: '/games/2048'
    },
    {
      id: 6,
      title: 'Flappy Bird',
      description: 'Navigate through pipes',
      color: 'bg-teal-100',
      icon: '🐦',
      path: '/games/flappy'
    },
    {
      id: 7,
      title: 'Pong',
      description: 'Classic arcade game',
      color: 'bg-orange-100',
      icon: '🏓',
      path: '/games/pong'
    },
    {
      id: 8,
      title: 'Minesweeper',
      description: 'Find bombs without detonating',
      color: 'bg-gray-100',
      icon: '💣',
      path: '/games/minesweeper'
    },
  ];

  const handleGameClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Game Hub | Play Free Online Games</title>
        <meta name="description" content="Collection of fun mini games to play" />
      </Head>

      <header className="py-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Game Hub</h1>
        <p className="text-gray-600">Click any game to start playing!</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.path)}
              className={`${game.color} rounded-lg p-4 cursor-pointer transition-all 
              hover:scale-105 hover:shadow-md active:scale-95 flex flex-col items-center 
              justify-center h-40 border border-gray-200`}
            >
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{game.title}</h3>
              <p className="text-sm text-gray-600 text-center">{game.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GameHub;