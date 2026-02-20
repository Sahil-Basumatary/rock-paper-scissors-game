import {
  type Move,
  type MatchFormat,
  type RoundResult,
  MOVES,
  BEATS,
  WINS_NEEDED,
} from '@/types/game';

export function resolveRound(playerMove: Move, opponentMove: Move): RoundResult {
  if (playerMove === opponentMove) return 'DRAW';
  return BEATS[playerMove] === opponentMove ? 'PLAYER_ONE_WIN' : 'PLAYER_TWO_WIN';
}

export function getAiMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

export function getWinsNeeded(format: MatchFormat): number {
  return WINS_NEEDED[format];
}

export function isMatchOver(
  scores: { player: number; opponent: number },
  format: MatchFormat,
): boolean {
  const needed = WINS_NEEDED[format];
  return scores.player >= needed || scores.opponent >= needed;
}

export function getMatchWinner(
  scores: { player: number; opponent: number },
  format: MatchFormat,
): 'player' | 'opponent' | null {
  const needed = WINS_NEEDED[format];
  if (scores.player >= needed) return 'player';
  if (scores.opponent >= needed) return 'opponent';
  return null;
}
