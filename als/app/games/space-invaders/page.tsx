"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 3;
const ENEMY_COLS = 8;
const ENEMY_PADDING = 20;
const ENEMY_SPEED = 1; // Speed at which enemies move

const SpaceInvaders = () => {
  const [playerPos, setPlayerPos] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState<{ x: number, y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ x: number, y: number, alive: boolean }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [enemyDirection, setEnemyDirection] = useState(1); // 1 for right, -1 for left
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize enemies
  useEffect(() => {
    const initialEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        initialEnemies.push({
          x: col * (ENEMY_WIDTH + ENEMY_PADDING),
          y: row * (ENEMY_HEIGHT + ENEMY_PADDING) + 50,
          alive: true
        });
      }
    }
    setEnemies(initialEnemies);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerPos(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowRight') {
        setPlayerPos(prev => Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + 10));
      } else if (e.key === ' ') {
        setBullets(prev => [...prev, {
          x: playerPos + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: GAME_HEIGHT - PLAYER_HEIGHT - BULLET_HEIGHT
        }]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev =>
        prev.map(bullet => ({ ...bullet, y: bullet.y - 10 }))
          .filter(bullet => bullet.y > 0)
      );

      // Check bullet-enemy collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        setEnemies(prevEnemies => {
          return prevEnemies.map(enemy => {
            if (!enemy.alive) return enemy;

            const hit = remainingBullets.some((bullet, bulletIndex) => {
              if (bullet.x < enemy.x + ENEMY_WIDTH &&
                bullet.x + BULLET_WIDTH > enemy.x &&
                bullet.y < enemy.y + ENEMY_HEIGHT &&
                bullet.y + BULLET_HEIGHT > enemy.y) {
                remainingBullets.splice(bulletIndex, 1);
                setScore(prev => prev + 10);
                return true;
              }
              return false;
            });

            return hit ? { ...enemy, alive: false } : enemy;
          });
        });
        return remainingBullets;
      });

      // Check if all enemies are dead
      if (enemies.every(enemy => !enemy.alive)) {
        setGameOver(true);
      }

      // Move enemies
      setEnemies(prevEnemies => {
        const moveDown = prevEnemies.some(enemy => enemy.x >= GAME_WIDTH - ENEMY_WIDTH || enemy.x <= 0);
        return prevEnemies.map(enemy => ({
          ...enemy,
          x: enemy.x + enemyDirection * ENEMY_SPEED,
          y: moveDown ? enemy.y + ENEMY_HEIGHT : enemy.y
        }));
      });

      // Change direction of enemies when they hit the edges
      if (enemies.some(enemy => enemy.x >= GAME_WIDTH - ENEMY_WIDTH || enemy.x <= 0)) {
        setEnemyDirection(prev => -prev);
      }

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, enemies, enemyDirection]);

  const resetGame = () => {
    setPlayerPos(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setBullets([]);
    setScore(0);
    setGameOver(false);
    setEnemyDirection(1);

    // Reinitialize enemies
    const initialEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        initialEnemies.push({
          x: col * (ENEMY_WIDTH + ENEMY_PADDING),
          y: row * (ENEMY_HEIGHT + ENEMY_PADDING) + 50,
          alive: true
        });
      }
    }
    setEnemies(initialEnemies);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Space Invaders</title>
      </Head>

      <h1 className="text-3xl font-bold mb-4">Space Invaders</h1>
      <div className="mb-4 text-xl">Score: {score}</div>

      <div
        ref={gameAreaRef}
        className="relative bg-black border-2 border-gray-700 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Player */}
        <div
          className="absolute bg-green-500"
          style={{
            left: playerPos,
            top: GAME_HEIGHT - PLAYER_HEIGHT,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT
          }}
        />

        {/* Bullets */}
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="absolute bg-yellow-400"
            style={{
              left: bullet.x,
              top: bullet.y,
              width: BULLET_WIDTH,
              height: BULLET_HEIGHT
            }}
          />
        ))}

        {/* Enemies */}
        {enemies.map((enemy, index) => (
          enemy.alive && (
            <div
              key={index}
              className="absolute bg-red-500"
              style={{
                left: enemy.x,
                top: enemy.y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT
              }}
            />
          )
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold mb-4">
              {enemies.every(enemy => !enemy.alive) ? 'You Win!' : 'Game Over'}
            </div>
            <div className="text-xl mb-6">Final Score: {score}</div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-400">
        Controls: Arrow keys to move, Space to shoot
      </div>
    </div>
  );
};

export default SpaceInvaders;
