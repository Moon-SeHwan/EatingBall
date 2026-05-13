import { useState } from 'react'
import { CELL_SIZE, GAP, GRID_SIZE, PADDING } from '@/game/constants'
import { useGame } from '@/hooks/useGame'
import { translations, type Lang } from '@/i18n/translations'
import './App.css'

function cellOffset(index: number): number {
  return PADDING + index * (CELL_SIZE + GAP)
}

export default function App() {
  const [intervalSec, setIntervalSec] = useState('0.5')
  const [autoStepSec, setAutoStepSec] = useState('0.5')
  const [spawning, setSpawning] = useState(true)
  const [lang, setLang] = useState<Lang>('ko')

  const t = translations[lang]

  const parsedFood = parseFloat(intervalSec)
  const foodInterval = !isNaN(parsedFood) && parsedFood >= 0.1 ? Math.round(parsedFood * 1000) : 500

  const parsedStep = parseFloat(autoStepSec)
  const autoStepInterval = !isNaN(parsedStep) && parsedStep >= 0.1 ? Math.round(parsedStep * 1000) : 500

  const { state, dispatch } = useGame(foodInterval, spawning, autoStepInterval)

  const handleNumericInput = (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      // 숫자와 소수점 하나만 허용
      if (/^\d*\.?\d*$/.test(val)) setter(val)
    }

  return (
    <div className="app">
      <h1 className="title">{t.title}</h1>
      <p className="score">{t.score}: {state.score}</p>
      <div className="game-area">
        <div className="lang-panel">
          <label className="lang-label" htmlFor="lang-select">{t.langLabel}</label>
          <select
            id="lang-select"
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="ko">{t.langKo}</option>
            <option value="en">{t.langEn}</option>
            <option value="zh">{t.langZh}</option>
            <option value="ja">{t.langJa}</option>
          </select>
        </div>
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
            {spawning ? t.spawnStop : t.spawnStart}
          </button>
          <div className="interval-row">
            <label className="interval-label" htmlFor="interval">{t.intervalLabel}</label>
            <input
              id="interval"
              className="interval-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={intervalSec}
              onChange={handleNumericInput(setIntervalSec)}
            />
            <span className="interval-unit">{t.intervalUnit}</span>
          </div>
          <div className="interval-row">
            <label className="interval-label" htmlFor="auto-step">{t.autoStepLabel}</label>
            <input
              id="auto-step"
              className="interval-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={autoStepSec}
              onChange={handleNumericInput(setAutoStepSec)}
            />
            <span className="interval-unit">{t.intervalUnit}</span>
          </div>
          <p className="interval-hint">{t.intervalHint}</p>
        </div>
      </div>
      <div className="btn-row">
        <button
          className="reset-btn"
          onClick={() => dispatch({ type: 'RESET_SCORE' })}
        >
          {t.resetScore}
        </button>
        <button
          className={`mode-btn ${state.mode}`}
          onClick={() => dispatch({ type: 'TOGGLE_MODE' })}
        >
          {state.mode === 'manual' ? t.manualMode : t.autoMode}
        </button>
      </div>
      {/* 고정 높이로 레이아웃 이동 방지 */}
      <div className="hint-area">
        <p className="hint" style={{ visibility: state.mode === 'manual' ? 'visible' : 'hidden' }}>
          {t.hint}
        </p>
      </div>
      <footer className="footer">
        <p>{t.footer1}</p>
        <p>{t.footer2}</p>
      </footer>
    </div>
  )
}
