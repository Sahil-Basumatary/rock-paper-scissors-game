import { create } from 'zustand';
import {
  type Move,
  type MatchFormat,
  type MatchType,
  type GamePhase,
  type RoundResult,
  type RoundSnapshot,
  MOVES,
  BEATS,
  WINS_NEEDED,
} from '@/types/game';

interface GameState {
  phase: GamePhase;
  matchFormat: MatchFormat;
  matchType: MatchType;
  playerMove: Move | null;
  opponentMove: Move | null;
  roundResult: RoundResult | null;
  scores: { player: number; opponent: number };
  rounds: RoundSnapshot[];
  currentRound: number;
}

interface GameActions {
  startMatch: (format: MatchFormat) => void;
  selectMove: (move: Move) => void;
  resolveRound: () => void;
  nextRound: () => void;
  resetMatch: () => void;
}

const initialState: GameState = {
  phase: 'IDLE',
  matchFormat: 'BO3',
  matchType: 'AI_BATTLE',
  playerMove: null,
  opponentMove: null,
  roundResult: null,
  scores: { player: 0, opponent: 0 },
  rounds: [],
  currentRound: 1,
};

function getRandomMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function resolveResult(playerMove: Move, opponentMove: Move): RoundResult {
  if (playerMove === opponentMove) return 'DRAW';
  return BEATS[playerMove] === opponentMove ? 'PLAYER_ONE_WIN' : 'PLAYER_TWO_WIN';
}

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  ...initialState,

  startMatch: (format) => {
    set({
      ...initialState,
      matchFormat: format,
      phase: 'SELECTING',
    });
  },

  selectMove: (move) => {
    if (get().phase !== 'SELECTING') return;
    const opponentMove = getRandomMove();
    set({
      playerMove: move,
      opponentMove,
      phase: 'CLASHING',
    });
  },

  resolveRound: () => {
    const { phase, playerMove, opponentMove, scores, rounds, currentRound, matchFormat } = get();
    if (phase !== 'CLASHING' || !playerMove || !opponentMove) return;
    const result = resolveResult(playerMove, opponentMove);
    const updatedScores = { ...scores };
    if (result === 'PLAYER_ONE_WIN') updatedScores.player++;
    if (result === 'PLAYER_TWO_WIN') updatedScores.opponent++;
    const snapshot: RoundSnapshot = {
      roundNumber: currentRound,
      playerMove,
      opponentMove,
      result,
    };
    const matchOver =
      updatedScores.player >= WINS_NEEDED[matchFormat] ||
      updatedScores.opponent >= WINS_NEEDED[matchFormat];
    set({
      roundResult: result,
      scores: updatedScores,
      rounds: [...rounds, snapshot],
      phase: matchOver ? 'MATCH_OVER' : 'RESULT',
    });
  },

  nextRound: () => {
    if (get().phase !== 'RESULT') return;
    set((state) => ({
      playerMove: null,
      opponentMove: null,
      roundResult: null,
      currentRound: state.currentRound + 1,
      phase: 'SELECTING',
    }));
  },

  resetMatch: () => {
    set({ ...initialState });
  },
}));
