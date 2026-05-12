export type Pos = { x: number; y: number }
export type Mode = 'manual' | 'auto'

export type State = {
  player: Pos
  foods: Pos[]
  score: number
  mode: Mode
}

export type Action =
  | { type: 'MOVE'; dx: number; dy: number }
  | { type: 'ADD_FOOD'; pos: Pos }
  | { type: 'AUTO_STEP' }
  | { type: 'TOGGLE_MODE' }
  | { type: 'RESET_SCORE' }
