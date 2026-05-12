import { GRID_SIZE } from '@/game/constants'
import type { Action, Pos, State } from '@/game/types'

function posKey(p: Pos): string {
  return `${p.x},${p.y}`
}

function clamp(v: number): number {
  return Math.max(0, Math.min(GRID_SIZE - 1, v))
}

function dist(a: Pos, b: Pos): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function findNearest(player: Pos, foods: Pos[]): Pos | null {
  if (foods.length === 0) return null
  let nearest = foods[0]
  let nearestDist = dist(player, foods[0])
  for (let i = 1; i < foods.length; i++) {
    const d = dist(player, foods[i])
    // 거리가 같으면 먼저 생성된 먹이(낮은 인덱스)를 유지
    if (d < nearestDist) {
      nearest = foods[i]
      nearestDist = d
    }
  }
  return nearest
}

function stepToward(player: Pos, target: Pos): { dx: number; dy: number } {
  const dx = target.x - player.x
  const dy = target.y - player.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { dx: Math.sign(dx), dy: 0 }
  }
  return { dx: 0, dy: Math.sign(dy) }
}

function applyMove(state: State, dx: number, dy: number): State {
  const next: Pos = {
    x: clamp(state.player.x + dx),
    y: clamp(state.player.y + dy),
  }
  const eaten = state.foods.some((f) => f.x === next.x && f.y === next.y)
  return {
    ...state,
    player: next,
    foods: eaten
      ? state.foods.filter((f) => !(f.x === next.x && f.y === next.y))
      : state.foods,
    score: eaten ? state.score + 1 : state.score,
  }
}

export const initialState: State = {
  player: { x: 0, y: 0 },
  foods: [],
  score: 0,
  mode: 'manual',
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MOVE':
      return applyMove(state, action.dx, action.dy)
    case 'ADD_FOOD': {
      const key = posKey(action.pos)
      const occupied =
        posKey(state.player) === key ||
        state.foods.some((f) => posKey(f) === key)
      if (occupied) return state
      return { ...state, foods: [...state.foods, action.pos] }
    }
    case 'AUTO_STEP': {
      const target = findNearest(state.player, state.foods)
      if (!target) return state
      const { dx, dy } = stepToward(state.player, target)
      return applyMove(state, dx, dy)
    }
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'manual' ? 'auto' : 'manual' }
    case 'RESET_SCORE':
      return { ...state, score: 0 }
  }
}
