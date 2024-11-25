import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TicTacToe from './components/tic-tac-toe.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicTacToe />
  </StrictMode>,
)
