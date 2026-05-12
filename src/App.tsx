import { useState } from 'react'
import { CELL_SIZE, GAP, GRID_SIZE, PADDING } from '@/game/constants'
import { useGame } from '@/hooks/useGame'
import './App.css'

function cellOffset(index: number): number {
  return PADDING + index * (CELL_SIZE + GAP)
}

export default function App() {
  const [intervalSec, setIntervalSec] = useState('0.5')
  const [spawning, setSpawning] = useState(true)

  const parsed = parseFloat(intervalSec)
  const foodInterval = !isNaN(parsed) && parsed >= 0.1 ? Math.round(parsed * 1000) : 500

  const { state, dispatch } = useGame(foodInterval, spawning)

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // 숫자와 소수점 하나만 허용
    if (/^\d*\.?\d*$/.test(val)) {
      setIntervalSec(val)
    }
  }

  return (
    <div className="app">
      <h1 className="title">볼보이</h1>
      <p className="score">점수: {state.score}</p>
      <div className="game-area">
        <div className="grid-wrapper">
          <div className="grid">
            {Array.from({ length: GRID_SIZE }, (_, row) =>
              Array.from({ length: GRID_SIZE }, (_, col) => {
                const isFood = state.foods.some((f) => f.x === col && f.y === row)
                return (
                  <div
                    key={`${col}-${row}`}
                    className={`cell${isFood ? ' food' : ''}`}
                  />
                )
              })
            )}
          </div>
          <div
            className="player"
            style={{ left: cellOffset(state.player.x), top: cellOffset(state.player.y) }}
          />
        </div>
        <div className="side-panel">
          <button
            className={`spawn-btn ${spawning ? 'on' : 'off'}`}
            onClick={() => setSpawning((s) => !s)}
          >
            {spawning ? '생성 중지' : '생성 시작'}
          </button>
          <div className="interval-row">
            <label className="interval-label" htmlFor="interval">먹이 생성 주기</label>
            <input
              id="interval"
              className="interval-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={intervalSec}
              onChange={handleIntervalChange}
            />
            <span className="interval-unit">초</span>
          </div>
          <p className="interval-hint">최솟값 0.1초 · 유효하지 않은 값은 0.5초로 대체됩니다</p>
        </div>
      </div>
      <div className="btn-row">
        <button
          className="reset-btn"
          onClick={() => dispatch({ type: 'RESET_SCORE' })}
        >
          점수 초기화
        </button>
        <button
          className={`mode-btn ${state.mode}`}
          onClick={() => dispatch({ type: 'TOGGLE_MODE' })}
        >
          {state.mode === 'manual' ? '수동 모드' : '자동 모드'}
        </button>
      </div>
      {/* 고정 높이로 레이아웃 이동 방지 */}
      <div className="hint-area">
        <p className="hint" style={{ visibility: state.mode === 'manual' ? 'visible' : 'hidden' }}>
          방향키로 캐릭터를 이동하세요
        </p>
      </div>
      <footer className="footer">
        <p>만든이: Claude AI with Farmer Moon&nbsp;&nbsp;·&nbsp;&nbsp;2026-05-12</p>
        <p>이 프로젝트는 오픈 소스로 자유롭게 수정하여도 괜찮습니다.</p>
      </footer>
    </div>
  )
}
