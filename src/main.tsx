import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log(
  '%c' +
  '  ╔═════════════════════════════════╗\n' +
  '  ║          << 볼보이 >>           ║\n' +
  '  ╠═════════════════════════════════╣\n' +
  '  ║   볼보이에 오신 것을 환영합니다. ║\n' +
  '  ╚═════════════════════════════════╝',
  'color: #e94560; font-family: monospace; font-size: 13px; line-height: 1.9; font-weight: bold;'
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
