import { useState } from 'react'
import PropTypes from 'prop-types'

function Square({ value, onSquareClick }) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	)
}

Square.propTypes = {
	value: PropTypes.string,
	onSquareClick: PropTypes.func,
}

function Board({ xIsNext, squares, onPlay }) {
	const winner = calculateWinner(squares)

	let status = winner
		? `Winner is ${winner}`
		: `Next Player is ${xIsNext ? 'X' : 'O'}`

	if (winner) {
		status = `Winner is ${winner}`
	} else if (!squares.includes(null)) {
		status = 'Draw, Lets play again!'
	} else {
		status = `Next Player is ${xIsNext ? 'X' : 'O'}`
	}

	function handleClick(index) {
		if (squares[index] || winner || !squares.includes(null)) return

		const nextSquares = squares.slice()
		nextSquares[index] = xIsNext ? 'X' : 'O'

		onPlay(nextSquares)
	}

	function renderSquare(index) {
		return (
			<Square
				value={squares[index]}
				onSquareClick={() => {
					handleClick(index)
				}}
				key={index}
			/>
		)
	}

	const renderSquares = Array(9)
		.fill(null)
		.map((_, index) => renderSquare(index))

	return (
		<>
			<h1 className="status">{status}</h1>
			<div className="board">{renderSquares}</div>
		</>
	)
}

Board.propTypes = {
	xIsNext: PropTypes.bool.isRequired,
	squares: PropTypes.array.isRequired,
	onPlay: PropTypes.func,
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpToMove(nextMove) {
		setCurrentMove(nextMove)
	}

	const moves = history.map((squares, move) => {
		let description = move > 0 ? `Go to move #${move}` : 'Go to game start'

		return (
			<li key={move}>
				<button onClick={() => jumpToMove(move)}>{description}</button>
			</li>
		)
	})

	return (
		<div className="game">
			<div className="gameBoard">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="gameInfo">
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

function calculateWinner(squares) {
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
