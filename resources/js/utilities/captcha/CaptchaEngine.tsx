export interface CaptchaGameResult {
    success: boolean;
    accuracy?: number;
    score?: number;
    timeElapsed?: number;
    [key: string]: unknown; // For extensibility
}

export interface CaptchaGame {
    id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    component: React.ComponentType<CaptchaGameProps>;
    validate: (result: CaptchaGameResult) => Promise<boolean>;
    timeLimit?: number; // in seconds
}

export interface CaptchaGameProps {
    onComplete: (result: CaptchaGameResult) => void;
    onTimeout?: () => void;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export class CaptchaMinigameSystem {
    private games: CaptchaGame[] = [];

    registerGame(game: CaptchaGame): void {
        this.games.push(game);
    }

    getRandomGame(difficulty?: 'easy' | 'medium' | 'hard'): CaptchaGame | undefined {
        const eligibleGames = difficulty ? this.games.filter((game) => game.difficulty === difficulty) : this.games;

        if (eligibleGames.length === 0) return undefined;

        const randomIndex = Math.floor(Math.random() * eligibleGames.length);
        return eligibleGames[randomIndex];
    }

    getAllGames(): CaptchaGame[] {
        return [...this.games];
    }
}

export const captchaSystem = new CaptchaMinigameSystem();
