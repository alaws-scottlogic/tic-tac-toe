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

function setTextColor(letter,status){
  if(status){
    return "black";
  }
  if(letter==="X"){
    return "#ffc09f";
  }
  else{
    return "#79addc";
  }
}

function setBackgroundColor(status){
  if(status==='win'){
    return "#adf7b6";
  }
  else if (status==='X'){
    return "#ffc09f";
  }
  else if (status==='O'){
    return "#79addc";
  }
  return "white";
}

function Square({ id, letter, onSquareClick, status }) {
  return (
    <button id={id} className="square" onClick={onSquareClick} style={{ background: setBackgroundColor(status), color: setTextColor(letter,status) }}>
      {letter}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay,status }) {
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
  let gameStatus;
  if (winner) {
    for(var i=0;i<winner.length;i++){
      status[winner[i]]='win';
    }
    gameStatus = 'Winner: ' + squares[winner[0]];
  } 
  else if(draw){
    gameStatus = 'Draw';
    status=squares;
  }
  else {
    gameStatus = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  return (
    <div>
      <div className="gameStatus">{gameStatus}</div>
      <div className="board-row">
        <Square id={'square0'} letter={squares[0]} onSquareClick={() => handleClick(0)} status={status[0]}/>
        <Square id={'square1'} letter={squares[1]} onSquareClick={() => handleClick(1)} status={status[1]}/>
        <Square id={'square2'} letter={squares[2]} onSquareClick={() => handleClick(2)} status={status[2]}/>
      </div>
      <div className="board-row">
        <Square id={'square3'} letter={squares[3]} onSquareClick={() => handleClick(3)} status={status[3]}/>
        <Square id={'square4'} letter={squares[4]} onSquareClick={() => handleClick(4)} status={status[4]}/>
        <Square id={'square5'} letter={squares[5]} onSquareClick={() => handleClick(5)} status={status[5]}/>
      </div>
      <div className="board-row">
        <Square id={'square6'} letter={squares[6]} onSquareClick={() => handleClick(6)} status={status[6]}/>
        <Square id={'square7'} letter={squares[7]} onSquareClick={() => handleClick(7)} status={status[7]}/>
        <Square id={'square8'} letter={squares[8]} onSquareClick={() => handleClick(8)} status={status[8]}/>
      </div>
    </div>
  );
}

export default function Game() {
  const status = Array(9).fill(null);
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} status={status} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

