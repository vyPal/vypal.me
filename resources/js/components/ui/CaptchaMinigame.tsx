import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { captchaSystem, CaptchaGame, CaptchaGameResult } from '@/utilities/captcha/CaptchaEngine';

interface CaptchaMinigameProps {
  onVerify: (success: boolean) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  gameId?: string; // Optional: specific game to use
}

interface CaptchaToken {
  token: string;
  gameId: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const CaptchaMinigame: React.FC<CaptchaMinigameProps> = ({
  onVerify,
  difficulty = 'medium',
  gameId
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<CaptchaGame | null>(null);

  useEffect(() => {
    const initializeCaptcha = async (): Promise<void> => {
      try {
        setLoading(true);

        // Get a token from the server
        const response = await axios.post<CaptchaToken>('/api/captcha/generate', {
          game: gameId,
          difficulty
        });

        setToken(response.data.token);

        // Get the game component
        const selectedGame = gameId
          ? captchaSystem.getAllGames().find(g => g.id === gameId)
          : captchaSystem.getRandomGame(difficulty);

        if (!selectedGame) {
          throw new Error('No CAPTCHA games available');
        }

        setGame(selectedGame);
      } catch (err) {
        setError('Failed to initialize CAPTCHA');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeCaptcha();
  }, [difficulty, gameId]);

  const handleGameComplete = async (result: CaptchaGameResult): Promise<void> => {
    if (!token) return;

    try {
      interface VerifyResponse {
        success: boolean;
        message: string;
      }

      const response = await axios.post<VerifyResponse>('/api/captcha/verify', {
        token,
        result
      });

      onVerify(response.data.success);
    } catch  {
      setError('Verification failed');
      onVerify(false);
    }
  };

  const handleTimeout = (): void => {
    setError('Time expired. Please try again.');
    onVerify(false);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading CAPTCHA minigame...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-4 text-center">
        <p>No CAPTCHA games available</p>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="captcha-minigame border border-border rounded-lg overflow-hidden">
      <div className="bg-muted p-3 flex items-center justify-between">
        <span className="text-sm font-medium">Prove you're human</span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">CAPTCHA Minigame</span>
      </div>

      <div className="p-4">
        <GameComponent
          onComplete={handleGameComplete}
          onTimeout={handleTimeout}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
};
