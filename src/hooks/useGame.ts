import { useCallback, useEffect, useReducer } from 'react'
import { GRID_SIZE } from '@/game/constants'
import { initialState, reducer } from '@/game/reducer'
import type { Pos } from '@/game/types'

function randomPos(): Pos {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

export function useGame(foodInterval: number, spawning: boolean, autoStepInterval: number) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (state.mode !== 'manual') return
      const moves: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      }
      const move = moves[e.key]
      if (!move) return
      e.preventDefault()
      dispatch({ type: 'MOVE', dx: move[0], dy: move[1] })
    },
    [state.mode]
  )

  // 키보드 입력 (수동 모드)
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // 먹이 주기적 생성 (foodInterval·spawning 변경 시 재시작)
  useEffect(() => {
    if (!spawning) return
    const id = setInterval(() => {
      dispatch({ type: 'ADD_FOOD', pos: randomPos() })
    }, foodInterval)
    return () => clearInterval(id)
  }, [foodInterval, spawning])

  // 자동 이동 (자동 모드, autoStepInterval 변경 시 재시작)
  useEffect(() => {
    if (state.mode !== 'auto') return
    const id = setInterval(() => {
      dispatch({ type: 'AUTO_STEP' })
    }, autoStepInterval)
    return () => clearInterval(id)
  }, [state.mode, autoStepInterval])

  return { state, dispatch }
}
