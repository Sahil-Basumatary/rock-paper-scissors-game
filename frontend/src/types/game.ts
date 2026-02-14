export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

export type MatchState =
  | 'WAITING_FOR_OPPONENT'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_MOVES'
  | 'RESOLVING'
  | 'COMPLETED'
  | 'CANCELLED';

export type MatchFormat = 'BO1' | 'BO3' | 'BO5' | 'BO7';

export type MatchType = 'RANKED' | 'CASUAL' | 'AI_BATTLE';

export type RoundResult = 'PLAYER_ONE_WIN' | 'PLAYER_TWO_WIN' | 'DRAW';

export type GamePhase = 'IDLE' | 'SELECTING' | 'CLASHING' | 'RESULT' | 'MATCH_OVER';

export type EventType = 'PLAYER_JOINED' | 'MOVE_RECEIVED' | 'ROUND_COMPLETE' | 'MATCH_COMPLETE';

export const MOVES: Move[] = ['ROCK', 'PAPER', 'SCISSORS'];

export const BEATS: Record<Move, Move> = {
  ROCK: 'SCISSORS',
  SCISSORS: 'PAPER',
  PAPER: 'ROCK',
};

export const WINS_NEEDED: Record<MatchFormat, number> = {
  BO1: 1,
  BO3: 2,
  BO5: 3,
  BO7: 4,
};

export interface RoundResponse {
  id: string;
  roundNumber: number;
  playerOneMove: Move | null;
  playerTwoMove: Move | null;
  result: RoundResult | null;
  createdAt: string;
}

export interface MatchResponse {
  id: string;
  playerOneId: string | null;
  playerOneUsername: string | null;
  playerTwoId: string | null;
  playerTwoUsername: string | null;
  state: MatchState;
  format: MatchFormat;
  type: MatchType;
  winnerId: string | null;
  rounds: RoundResponse[];
  playerOneWins: number;
  playerTwoWins: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface MatchEvent {
  type: EventType;
  payload: MatchResponse | string;
}

export interface CreateMatchRequest {
  format: MatchFormat;
  type: MatchType;
}

export interface SubmitMoveRequest {
  move: Move;
}

export interface RoundSnapshot {
  roundNumber: number;
  playerMove: Move;
  opponentMove: Move;
  result: RoundResult;
}
