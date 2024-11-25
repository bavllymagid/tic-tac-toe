import { useState, useEffect } from 'react'
import '../styles/tic-tac-toe.css'

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [status, setStatus] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [timerCnt, setTimerCnt] = useState(3)

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i) => {
    if (gameOver || squares[i]) {
      return
    }
    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? 'X' : 'O'
    setSquares(newSquares)
    setXIsNext(!xIsNext)

    const newWinner = calculateWinner(newSquares)
    if (newWinner || newSquares.every(Boolean)) {
      setStatus(newWinner ? `Winner: ${newWinner}` : 'Draw!')
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setStatus(null)
    setGameOver(false)
    setTimerCnt(3)
  }

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        resetGame()
      }, 3000) // Reset after 3 seconds
      return () => clearTimeout(timer)
    }
  }, [gameOver])

  useEffect(() => {
    if (gameOver) {
      const timer = setInterval(() => {
        setTimerCnt(prevCount => prevCount - 1)
      }, 1000) // Count every second
      return () => clearInterval(timer)
    }
  }, [gameOver, timerCnt])



  const renderSquare = (i) => {
    return (
      <button
        key={i}
        className="square"
        onClick={() => handleClick(i)}
      >
        {squares[i]}
      </button>
    )
  }
  
  return (
    <div className="container">
      <div className="status">{status}</div>
      <div className="grid">
        {squares.map((_, index) => renderSquare(index))}
      </div>
      {gameOver && (
        <div className="resetMessage">
          Game will reset in {timerCnt} seconds...
        </div>
      )}
    </div>
  )
}

export default TicTacToe

