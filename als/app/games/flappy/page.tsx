"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const PIPE_INTERVAL = 1500;

const FlappyBird = () => {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2 - BIRD_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{x: number, topHeight: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const pipeLoopRef = useRef<NodeJS.Timeout>();

  const jump = () => {
    if (!gameStarted) {
      startGame();
    }
    setBirdVelocity(JUMP_FORCE);
  };

  const startGame = () => {
    setBirdPosition(GAME_HEIGHT / 2 - BIRD_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (pipeLoopRef.current) clearInterval(pipeLoopRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    // Bird movement
    gameLoopRef.current = setInterval(() => {
      setBirdPosition(prev => {
        const newPosition = prev + birdVelocity;
        setBirdVelocity(prevVelocity => prevVelocity + GRAVITY);

        // Check if bird hit the ground or ceiling
        if (newPosition <= 0 || newPosition >= GAME_HEIGHT - BIRD_HEIGHT) {
          endGame();
          return prev;
        }

        return newPosition;
      });

      // Pipe movement and collision detection
      setPipes(prevPipes => {
        const newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED
        })).filter(pipe => pipe.x > -PIPE_WIDTH);

        // Check if bird passed a pipe
        prevPipes.forEach(pipe => {
          if (pipe.x + PIPE_WIDTH > GAME_WIDTH / 2 && pipe.x - PIPE_SPEED <= GAME_WIDTH / 2) {
            setScore(prev => prev + 1);
          }
        });

        // Check collision with pipes
        const birdRight = GAME_WIDTH / 2 + BIRD_WIDTH;
        const birdBottom = birdPosition + BIRD_HEIGHT;

        for (const pipe of newPipes) {
          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;
          const pipeTopBottom = pipe.topHeight;
          const pipeBottomTop = pipe.topHeight + PIPE_GAP;

          if (
            (GAME_WIDTH / 2 < pipeRight && birdRight > pipeLeft) &&
            (birdPosition < pipeTopBottom || birdBottom > pipeBottomTop)
          ) {
            endGame();
            break;
          }
        }

        return newPipes;
      });
    }, 20);

    // Pipe generation
    pipeLoopRef.current = setInterval(() => {
      setPipes(prev => [...prev, {
        x: GAME_WIDTH,
        topHeight: Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50
      }]);
    }, PIPE_INTERVAL);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (pipeLoopRef.current) clearInterval(pipeLoopRef.current);
    };
  }, [gameStarted, birdVelocity]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <Head>
        <title>Flappy Bird</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-4">Flappy Bird</h1>
      
      <div className="mb-4 text-xl">Score: {score}</div>
      
      <div
        className="relative bg-blue-300 border-2 border-blue-500 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Bird */}
        <div
          className="absolute bg-yellow-400 rounded-full"
          style={{
            left: GAME_WIDTH / 2 - BIRD_WIDTH / 2,
            top: birdPosition,
            width: BIRD_WIDTH,
            height: BIRD_HEIGHT
          }}
        />
        
        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500 border-r-2 border-l-2 border-green-700"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.topHeight
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500 border-r-2 border-l-2 border-green-700"
              style={{
                left: pipe.x,
                top: pipe.topHeight + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP
              }}
            />
          </React.Fragment>
        ))}
        
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg text-center">
              {gameOver ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                  <p className="mb-4">Your score: {score}</p>
                </>
              ) : (
                <h2 className="text-2xl font-bold mb-4">Flappy Bird</h2>
              )}
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {gameOver ? 'Play Again' : 'Start Game'}
              </button>
              <p className="mt-4 text-sm">Press Space or click to jump</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-600">
        Controls: Space bar or click to make the bird jump
      </div>
    </div>
  );
};

export default FlappyBird;