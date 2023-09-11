import { useState } from 'react';
import React from 'react';

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function checkDraw(squares){
  for (let i = 0; i < squares.length; i++){
    if(squares[i]===null){
      return false;
    }
  }
    return true;
}

function Square({ id, value, onSquareClick, highlighted }) {
  let color,bgColor;
  if(highlighted==='win'){
    color = "black";
    bgColor = "#adf7b6";
  }
  else if(highlighted==='O'){
    color = "black";
    bgColor = "#79addc";
  }
  else if(highlighted==='X'){
    color = "black";
    bgColor = "#ffc09f";
  }
  else if(value==='O'){
    color = "#79addc";
    bgColor = "white";
  }
  else if(value==='X'){
    color = "#ffc09f";
    bgColor = "white";
  }
  return (
    <button id={id} className="square" onClick={onSquareClick} style={{ background: bgColor, color: color }}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay,highlighted }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]||checkDraw(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  const draw = checkDraw(squares);
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    for(var i=0;i<winner.length;i++){
      highlighted[winner[i]]='win';
    }
    status = 'Winner: ' + winner[0];
  } 
  else if(draw){
    status = 'Draw';
    highlighted=squares;
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square id={'square0'} value={squares[0]} onSquareClick={() => handleClick(0)} highlighted={highlighted[0]}/>
        <Square id={'square1'} value={squares[1]} onSquareClick={() => handleClick(1)} highlighted={highlighted[1]}/>
        <Square id={'square2'} value={squares[2]} onSquareClick={() => handleClick(2)} highlighted={highlighted[2]}/>
      </div>
      <div className="board-row">
        <Square id={'square3'} value={squares[3]} onSquareClick={() => handleClick(3)} highlighted={highlighted[3]}/>
        <Square id={'square4'} value={squares[4]} onSquareClick={() => handleClick(4)} highlighted={highlighted[4]}/>
        <Square id={'square5'} value={squares[5]} onSquareClick={() => handleClick(5)} highlighted={highlighted[5]}/>
      </div>
      <div className="board-row">
        <Square id={'square6'} value={squares[6]} onSquareClick={() => handleClick(6)} highlighted={highlighted[6]}/>
        <Square id={'square7'} value={squares[7]} onSquareClick={() => handleClick(7)} highlighted={highlighted[7]}/>
        <Square id={'square8'} value={squares[8]} onSquareClick={() => handleClick(8)} highlighted={highlighted[8]}/>
      </div>
    </div>
  );
}

export default function Game() {
  const highlighted = Array(9).fill(null);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0)
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move)=>{
    let description;
    if (move===currentMove){
      description="You are at move "+move;
      return <p key={"current"}>{description}</p>;
    }
    else if(move>0){
      description="Go to move "+move;
    }
    else{
      description="Go to start of game";
    }
    return(
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} highlighted={highlighted} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

